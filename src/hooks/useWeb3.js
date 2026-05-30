// src/hooks/useWeb3.js
// Shared hook — replaces the copy-pasted initWeb3 in every component.

import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import {
  PROJECT_REGISTRY_ABI,
  FUND_TRANSFER_MANAGER_ABI,
  TRANSPARENCY_PORTAL_ABI,
  CONTRACT_ADDRESSES,
} from "../config";

export function useWeb3() {
  const [web3, setWeb3]           = useState(null);
  const [accounts, setAccounts]   = useState([]);
  const [isConnected, setConnected] = useState(false);
  const [error, setError]         = useState(null);

  // Contract instances
  const [registry, setRegistry]         = useState(null);
  const [fundManager, setFundManager]   = useState(null);
  const [portal, setPortal]             = useState(null);

  const init = useCallback(async () => {
    try {
      let w3;
      if (window.ethereum) {
        w3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        w3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
      }

      const accs = await w3.eth.getAccounts();
      setWeb3(w3);
      setAccounts(accs);
      setConnected(true);

      setRegistry(new w3.eth.Contract(PROJECT_REGISTRY_ABI,      CONTRACT_ADDRESSES.PROJECT_REGISTRY));
      setFundManager(new w3.eth.Contract(FUND_TRANSFER_MANAGER_ABI, CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER));
      setPortal(new w3.eth.Contract(TRANSPARENCY_PORTAL_ABI,     CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL));
    } catch (err) {
      setError(err.message);
      console.error("Web3 init error:", err);
    }
  }, []);

  useEffect(() => { init(); }, [init]);

  // Convenience: detect the current account's on-chain role
  const detectRole = useCallback(async (address) => {
    if (!registry || !address) return "public";
    try {
      const FM_ROLE  = await registry.methods.FINANCE_MINISTRY_ROLE().call();
      const TR_ROLE  = await registry.methods.TREASURY_ROLE().call();
      const CC_ROLE  = await registry.methods.CITY_CORPORATION_ROLE().call();
      const BL_ROLE  = await registry.methods.BUILDER_ROLE().call();
      const ADM_ROLE = await registry.methods.DEFAULT_ADMIN_ROLE().call();

      if (await registry.methods.hasRole(ADM_ROLE, address).call())  return "admin";
      if (await registry.methods.hasRole(FM_ROLE,  address).call())  return "finance_ministry";
      if (await registry.methods.hasRole(TR_ROLE,  address).call())  return "treasury";
      if (await registry.methods.hasRole(CC_ROLE,  address).call())  return "city_corporation";
      if (await registry.methods.hasRole(BL_ROLE,  address).call())  return "builder";
      return "public";
    } catch {
      return "public";
    }
  }, [registry]);

  return { web3, accounts, isConnected, error, registry, fundManager, portal, detectRole, reinit: init };
}
