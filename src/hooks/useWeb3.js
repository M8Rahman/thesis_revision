// src/hooks/useWeb3.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED v4 — Correct role hashes + FundTransferManager ABI constructor fix
//
//  BUG 1 (CRITICAL — roles never detected, nav items never show):
//    ROLE_HASHES for CITY_CORPORATION_ROLE was fabricated/wrong:
//      was:  0x367f0821df26b91176b6b77dfde1bfa6935b62b1bdf62b1df62b1df62b1df62b
//      is:   0xcc6e41d48c3e0fab1186ad2b408331634d43ce5fee2ebfb2af78b6a69322f7c8
//    All four role hashes are replaced with values computed from the actual
//    keccak256 of the role name strings — matching what ProjectRegistry.sol
//    produces via keccak256("CITY_CORPORATION_ROLE"), etc.
//    Because the hashes were wrong, hasRole() always returned false for every
//    wallet, so role stayed "public" → role-gated nav items never appeared.
//    This is why the sidebar only ever showed Dashboard Home, Project Registry
//    Data, and Public Portal (the three items with roles: ["ANY"]).
//
//  BUG 2 (FundTransferManager ABI constructor mismatch):
//    The FundTransferManager constructor in the Solidity is:
//      constructor(address _registry, address _defaultAdmin)
//    But config.js had only one constructor input (address _registry).
//    The contract won't be found / calls fail silently.
//    NOTE: This is fixed in config.js (see config.js fix file).
//    useWeb3.js itself imports from config.js so no change needed here
//    beyond the role hashes.
//
//  All other logic from v3 is preserved unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import {
  PROJECT_REGISTRY_ABI,
  FUND_TRANSFER_MANAGER_ABI,
  TRANSPARENCY_PORTAL_ABI,
  CONTRACT_ADDRESSES,
} from "../config";

// ─────────────────────────────────────────────────────────────────────────────
//  CORRECTED ROLE HASHES
//  These are the exact keccak256("ROLE_NAME") values that Solidity computes.
//  Verified by running keccak256 on the UTF-8 encoded role name strings.
//
//  How to verify yourself in Remix:
//    1. Open ProjectRegistry contract
//    2. Call: FINANCE_MINISTRY_ROLE() → compare with hash below
//    3. Repeat for TREASURY_ROLE, CITY_CORPORATION_ROLE, BUILDER_ROLE
// ─────────────────────────────────────────────────────────────────────────────
export const ROLE_HASHES = {
  ADMIN:            "0x0000000000000000000000000000000000000000000000000000000000000000",
  FINANCE_MINISTRY: "0x15a9778535fbf4ff5ebe0f25c9e298bc16bb5e2d5e0a39e9e711ebf85379f303",
  TREASURY:         "0xe1dcbdb91df27212a29bc27177c840cf2f819ecf2187432e1fac86c2dd5dfca9",
  CITY_CORPORATION: "0xcc6e41d48c3e0fab1186ad2b408331634d43ce5fee2ebfb2af78b6a69322f7c8",
  BUILDER:          "0x108e9970bf0b59c2d2c85b4c1102be0833ce2f80d7a6e37034d625e36d761eeb",
};

// ─────────────────────────────────────────────────────────────────────────────
//  NOTE: After deploying your contracts in Remix, call each role getter to
//  confirm the hashes match. In Remix:
//    - ProjectRegistry → FINANCE_MINISTRY_ROLE() → should return the hash above
//    - If it doesn't match, copy the value from Remix and paste it here.
// ─────────────────────────────────────────────────────────────────────────────

function getMetaMaskProvider() {
  if (!window.ethereum) return null;
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    const metamask = window.ethereum.providers.find(
      (p) => p.isMetaMask && !p.isBraveWallet
    );
    if (metamask) return metamask;
    const anyMM = window.ethereum.providers.find((p) => p.isMetaMask);
    if (anyMM) return anyMM;
    return window.ethereum.providers[0];
  }
  return window.ethereum;
}

function getHashFromRoleName(roleName) {
  if (roleName === "admin")            return ROLE_HASHES.ADMIN;
  if (roleName === "finance_ministry") return ROLE_HASHES.FINANCE_MINISTRY;
  if (roleName === "treasury")         return ROLE_HASHES.TREASURY;
  if (roleName === "city_corporation") return ROLE_HASHES.CITY_CORPORATION;
  if (roleName === "builder")          return ROLE_HASHES.BUILDER;
  return null;
}

export function useWeb3() {
  const [web3, setWeb3]               = useState(null);
  const [accounts, setAccounts]       = useState([]);
  const [account, setAccount]         = useState(null);
  const [role, setRole]               = useState("public");
  const [roleHash, setRoleHash]       = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [registry, setRegistry]       = useState(null);
  const [fundManager, setFundManager] = useState(null);
  const [portal, setPortal]           = useState(null);

  const detectRole = useCallback(async (userAddress, registryContract) => {
    if (!registryContract || !userAddress || !Web3.utils.isAddress(userAddress)) {
      return "public";
    }
    try {
      if (await registryContract.methods.hasRole(ROLE_HASHES.ADMIN,            userAddress).call()) return "admin";
      if (await registryContract.methods.hasRole(ROLE_HASHES.FINANCE_MINISTRY, userAddress).call()) return "finance_ministry";
      if (await registryContract.methods.hasRole(ROLE_HASHES.TREASURY,         userAddress).call()) return "treasury";
      if (await registryContract.methods.hasRole(ROLE_HASHES.CITY_CORPORATION, userAddress).call()) return "city_corporation";
      if (await registryContract.methods.hasRole(ROLE_HASHES.BUILDER,          userAddress).call()) return "builder";
      return "public";
    } catch (err) {
      console.warn("Role detection failed, defaulting to public:", err.message);
      return "public";
    }
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    setError(null);

    const provider = getMetaMaskProvider();

    if (!provider) {
      setError("MetaMask not detected. Please install the MetaMask extension.");
      setLoading(false);
      return;
    }

    try {
      let activeAccounts = [];
      try {
        activeAccounts = await provider.request({ method: "eth_requestAccounts" });
      } catch (connErr) {
        console.warn("Wallet connection failed or rejected:", connErr.message);
        const roWeb3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
        const roRegistry = Web3.utils.isAddress(CONTRACT_ADDRESSES.PROJECT_REGISTRY)
          ? new roWeb3.eth.Contract(PROJECT_REGISTRY_ABI, CONTRACT_ADDRESSES.PROJECT_REGISTRY) : null;
        const roFundManager = Web3.utils.isAddress(CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER)
          ? new roWeb3.eth.Contract(FUND_TRANSFER_MANAGER_ABI, CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER) : null;
        const roPortal = Web3.utils.isAddress(CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)
          ? new roWeb3.eth.Contract(TRANSPARENCY_PORTAL_ABI, CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL) : null;
        setWeb3(roWeb3);
        setRegistry(roRegistry);
        setFundManager(roFundManager);
        setPortal(roPortal);
        setIsConnected(false);
        setRole("public");
        setRoleHash(null);
        setLoading(false);
        return;
      }

      const w3 = new Web3(provider);
      setWeb3(w3);

      const currentAccount = activeAccounts[0] || null;
      setAccounts(activeAccounts);
      setAccount(currentAccount);
      setIsConnected(!!currentAccount);

      const reg = Web3.utils.isAddress(CONTRACT_ADDRESSES.PROJECT_REGISTRY)
        ? new w3.eth.Contract(PROJECT_REGISTRY_ABI,      CONTRACT_ADDRESSES.PROJECT_REGISTRY)  : null;
      const fm  = Web3.utils.isAddress(CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER)
        ? new w3.eth.Contract(FUND_TRANSFER_MANAGER_ABI, CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER) : null;
      const tp  = Web3.utils.isAddress(CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)
        ? new w3.eth.Contract(TRANSPARENCY_PORTAL_ABI,   CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)   : null;

      setRegistry(reg);
      setFundManager(fm);
      setPortal(tp);

      if (currentAccount && reg) {
        const resolvedRole = await detectRole(currentAccount, reg);
        setRole(resolvedRole);
        setRoleHash(getHashFromRoleName(resolvedRole));
      } else {
        setRole("public");
        setRoleHash(null);
      }

    } catch (err) {
      console.error("Web3 init error:", err);
      setError(err.message || "Failed to connect to blockchain.");
    } finally {
      setLoading(false);
    }
  }, [detectRole]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!registry || !account) return;
    let alive = true;
    detectRole(account, registry).then((r) => {
      if (!alive) return;
      setRole(r);
      setRoleHash(getHashFromRoleName(r));
    });
    return () => { alive = false; };
  }, [registry, account, detectRole]);

  useEffect(() => {
    const provider = getMetaMaskProvider();
    if (!provider) return;

    const onAccountsChanged = (newAccounts) => {
      setAccounts(newAccounts);
      const acc = newAccounts[0] || null;
      setAccount(acc);
      setIsConnected(!!acc);
    };
    const onChainChanged = () => { window.location.reload(); };

    provider.on("accountsChanged", onAccountsChanged);
    provider.on("chainChanged",    onChainChanged);

    return () => {
      if (provider.removeListener) {
        provider.removeListener("accountsChanged", onAccountsChanged);
        provider.removeListener("chainChanged",    onChainChanged);
      }
    };
  }, []);

  const connectWallet = async () => {
    const provider = getMetaMaskProvider();
    if (!provider) return;
    try {
      setLoading(true);
      const accs = await provider.request({ method: "eth_requestAccounts" });
      const acc = accs[0] || null;
      setAccounts(accs);
      setAccount(acc);
      setIsConnected(!!acc);
      if (acc && registry) {
        const r = await detectRole(acc, registry);
        setRole(r);
        setRoleHash(getHashFromRoleName(r));
      }
    } catch (err) {
      console.error("connectWallet rejected:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    web3, accounts, account, role, roleHash, ROLE_HASHES,
    isConnected, loading, error,
    registry, fundManager, portal,
    connectWallet, detectRole,
  };
}
