// src/hooks/useWeb3.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED for Web3 v4 (your package.json has "web3": "^4.3.0")
//
//  Key Web3 v4 changes that affect this file:
//    • web3.eth.getAccounts() still works ✅
//    • new web3.eth.Contract(abi, address) still works ✅
//    • contract.methods.fn().call() still works ✅
//    • contract.methods.fn().send({}) still works ✅
//    • Web3.utils.toWei() → use web3.utils.toWei() (instance, not static) ✅
//    • window.ethereum.request still works ✅
//    • The provider constructor changed slightly — handled below
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import {
  PROJECT_REGISTRY_ABI,
  FUND_TRANSFER_MANAGER_ABI,
  TRANSPARENCY_PORTAL_ABI,
  CONTRACT_ADDRESSES,
} from "../config";

export function useWeb3() {
  const [web3, setWeb3]               = useState(null);
  const [accounts, setAccounts]       = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError]             = useState(null);

  // Contract instances
  const [registry, setRegistry]       = useState(null);
  const [fundManager, setFundManager] = useState(null);
  const [portal, setPortal]           = useState(null);

  const init = useCallback(async () => {
    try {
      let w3;

      if (window.ethereum) {
        // Web3 v4: pass window.ethereum directly — this is the same as v1
        w3 = new Web3(window.ethereum);
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        // Fallback to Ganache HTTP (read-only, no signing)
        w3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
      }

      const accs = await w3.eth.getAccounts();

      setWeb3(w3);
      setAccounts(accs);
      setIsConnected(true);

      // Instantiate contracts
      // Web3 v4: new w3.eth.Contract(abi, address) — same API as v1
      setRegistry(
        new w3.eth.Contract(PROJECT_REGISTRY_ABI, CONTRACT_ADDRESSES.PROJECT_REGISTRY)
      );
      setFundManager(
        new w3.eth.Contract(FUND_TRANSFER_MANAGER_ABI, CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER)
      );
      setPortal(
        new w3.eth.Contract(TRANSPARENCY_PORTAL_ABI, CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)
      );
    } catch (err) {
      console.error("Web3 init error:", err);
      setError(err.message || "Failed to connect Web3");
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  // Listen for MetaMask account changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (newAccounts) => {
      setAccounts(newAccounts);
      if (newAccounts.length === 0) setIsConnected(false);
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  // Listen for network changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleChainChanged = () => {
      // Reload on network change — recommended by MetaMask
      window.location.reload();
    };
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => window.ethereum.removeListener("chainChanged", handleChainChanged);
  }, []);

  /**
   * Detects the on-chain role of a given address by querying ProjectRegistry.
   * Returns one of: "admin" | "finance_ministry" | "treasury" |
   *                 "city_corporation" | "builder" | "public"
   */
  const detectRole = useCallback(
    async (address) => {
      if (!registry || !address) return "public";
      try {
        // Web3 v4: .methods.fn().call() — same as v1
        const FM_ROLE  = await registry.methods.FINANCE_MINISTRY_ROLE().call();
        const TR_ROLE  = await registry.methods.TREASURY_ROLE().call();
        const CC_ROLE  = await registry.methods.CITY_CORPORATION_ROLE().call();
        const BL_ROLE  = await registry.methods.BUILDER_ROLE().call();
        const ADM_ROLE = await registry.methods.DEFAULT_ADMIN_ROLE().call();

        if (await registry.methods.hasRole(ADM_ROLE, address).call()) return "admin";
        if (await registry.methods.hasRole(FM_ROLE,  address).call()) return "finance_ministry";
        if (await registry.methods.hasRole(TR_ROLE,  address).call()) return "treasury";
        if (await registry.methods.hasRole(CC_ROLE,  address).call()) return "city_corporation";
        if (await registry.methods.hasRole(BL_ROLE,  address).call()) return "builder";
        return "public";
      } catch {
        return "public";
      }
    },
    [registry]
  );

  return {
    web3,
    accounts,
    isConnected,
    error,
    registry,
    fundManager,
    portal,
    detectRole,
    reinit: init,
  };
}
