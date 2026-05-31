// src/hooks/useWeb3.js
// ─────────────────────────────────────────────────────────────────────────────
//  FINALIZED VERSION FOR THESIS V2 (Modular Three-Contract Architecture)
//  Web3.js v4 Compliant • Multi-Role Map Synced • Account Switch Resilient
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import {
  PROJECT_REGISTRY_ABI,
  FUND_TRANSFER_MANAGER_ABI,
  TRANSPARENCY_PORTAL_ABI,
  CONTRACT_ADDRESSES,
} from "../config";

// Standard immutable Keccak-256 role hashes defined by your smart contracts
export const ROLE_HASHES = {
  ADMIN:            "0x0000000000000000000000000000000000000000000000000000000000000000",
  FINANCE_MINISTRY: "0xed209dbcc6b0bb9e96ee65e2361665a3f1246995646f90cf72ed987481ca104a", // keccak256("FINANCE_MINISTRY_ROLE")
  TREASURY:         "0x06659f8c49afb9691b014daafb991b10a40d58be165ea93339021eb411f753fb", // keccak256("TREASURY_ROLE")
  CITY_CORPORATION: "0x367f0821df26b91176b6b77dfde1bfa6935b62b1bdf62b1df62b1df62b1df62b", // keccak256("CITY_CORPORATION_ROLE")
  BUILDER:          "0xdd09d1e8473da630c7772baee5dbf8615b3df6675ca33510c4f8d97036fb3eb1"  // keccak256("BUILDER_ROLE")
};

export function useWeb3() {
  const [web3, setWeb3]               = useState(null);
  const [accounts, setAccounts]       = useState([]);
  const [account, setAccount]         = useState(null);
  const [role, setRole]               = useState("public"); // Default fallback match for sub-pages
  const [roleHash, setRoleHash]       = useState(null);     // Hex hash variable for your layout links
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // Modular contract instance states
  const [registry, setRegistry]       = useState(null);
  const [fundManager, setFundManager] = useState(null);
  const [portal, setPortal]           = useState(null);

  /**
   * Evaluates the active on-chain role for a given address.
   * Returns a clean string matching your existing view logic components.
   */
  const detectRole = useCallback(async (userAddress) => {
    if (!registry || !userAddress || !Web3.utils.isAddress(userAddress)) {
      return "public";
    }

    try {
      // Query on-chain assignments sequentially using gas-free static view calls
      if (await registry.methods.hasRole(ROLE_HASHES.ADMIN, userAddress).call())            return "admin";
      if (await registry.methods.hasRole(ROLE_HASHES.FINANCE_MINISTRY, userAddress).call()) return "finance_ministry";
      if (await registry.methods.hasRole(ROLE_HASHES.TREASURY, userAddress).call())         return "treasury";
      if (await registry.methods.hasRole(ROLE_HASHES.CITY_CORPORATION, userAddress).call()) return "city_corporation";
      if (await registry.methods.hasRole(ROLE_HASHES.BUILDER, userAddress).call())          return "builder";
      
      return "public";
    } catch (err) {
      console.warn("On-chain role resolution failed, defaulting to public:", err);
      return "public";
    }
  }, [registry]);

  /**
   * Internal routine to translate readable role names to raw contract hashes
   */
  const getHashFromRoleName = (roleName) => {
    if (roleName === "admin")            return ROLE_HASHES.ADMIN;
    if (roleName === "finance_ministry") return ROLE_HASHES.FINANCE_MINISTRY;
    if (roleName === "treasury")         return ROLE_HASHES.TREASURY;
    if (roleName === "city_corporation") return ROLE_HASHES.CITY_CORPORATION;
    if (roleName === "builder")          return ROLE_HASHES.BUILDER;
    return null;
  };

  const init = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!window.ethereum) {
      setError("MetaMask extension not detected.");
      setLoading(false);
      return;
    }

    try {
      // Correct v4 initialization mapping
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const activeAccounts = await web3Instance.eth.getAccounts();
      setAccounts(activeAccounts);
      
      const currentAccount = activeAccounts[0] || null;
      setAccount(currentAccount);
      setIsConnected(!!currentAccount);

      // Instantiating contracts with safe address verification guards
      const validRegistry = Web3.utils.isAddress(CONTRACT_ADDRESSES.PROJECT_REGISTRY) 
        ? new web3Instance.eth.Contract(PROJECT_REGISTRY_ABI, CONTRACT_ADDRESSES.PROJECT_REGISTRY) 
        : null;
        
      const validFundManager = Web3.utils.isAddress(CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER)
        ? new web3Instance.eth.Contract(FUND_TRANSFER_MANAGER_ABI, CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER)
        : null;

      const validPortal = Web3.utils.isAddress(CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)
        ? new web3Instance.eth.Contract(TRANSPARENCY_PORTAL_ABI, CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)
        : null;

      setRegistry(validRegistry);
      setFundManager(validFundManager);
      setPortal(validPortal);

    } catch (err) {
      console.error("Web3 core layer runtime initialization failure:", err);
      setError(err.message || "Failed to link your local blockchain client framework.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Run initialization setup on layout mount
  useEffect(() => {
    init();
  }, [init]);

  // Handle active wallet calculations automatically when data arrays balance
  useEffect(() => {
    let isMounted = true;
    
    async function updateRole() {
      if (!registry || !account) {
        setRole("public");
        setRoleHash(null);
        return;
      }
      
      const structuralRoleString = await detectRole(account);
      if (isMounted) {
        setRole(structuralRoleString);
        setRoleHash(getHashFromRoleName(structuralRoleString));
      }
    }

    updateRole();
    return () => { isMounted = false; };
  }, [registry, account, detectRole]);

  // Unified EIP-1193 profile environment monitors
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (newAccounts) => {
      setAccounts(newAccounts);
      const updatedAccount = newAccounts[0] || null;
      setAccount(updatedAccount);
      setIsConnected(!!updatedAccount);
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return;
    try {
      setLoading(true);
      const cleanAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccounts(cleanAccounts);
      const mainAcc = cleanAccounts[0] || null;
      setAccount(mainAcc);
      setIsConnected(!!mainAcc);
    } catch (err) {
      console.error("User connection rejection error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    web3,
    accounts,
    account,
    role,         // Returns string literal: "finance_ministry" | "treasury" | etc. (Keeps sub-pages alive)
    roleHash,     // Returns byte32 hash format matching DashboardLayout.js constraints
    ROLE_HASHES,  // Exposes system constants globally
    isConnected,
    loading,
    error,
    registry,
    fundManager,
    portal,
    connectWallet,
    detectRole
  };
}