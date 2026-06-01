// src/hooks/useWeb3.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED v3 — Three bugs resolved from console log analysis
//
//  BUG 1 (CRITICAL — "Verifying Ledger" stuck forever):
//    The `loading` state was set to `true` at init, but it was NEVER set to
//    `false` after `setupContracts()` was called (happy path). The `finally`
//    block ran before `setRegistry/setFundManager/setPortal` state updates
//    settled, so `loading` was cleared before `registry` was populated.
//    Then the role-detection `useEffect` fired with registry=null → role stayed
//    "public" → `loading` was never reset from whatever detectRole left it as.
//    DashboardLayout shows "Verifying Ledger..." while `web3Loading` is true,
//    and it was permanently true.
//
//    FIX: `loading` is now set to `false` ONLY after contracts AND role are
//    fully resolved. Role detection is done directly inside `init()` so the
//    entire flow completes atomically in one async chain with a guaranteed
//    `finally` that sets loading=false.
//
//  BUG 2 (CRITICAL — MetaMask "Unexpected error" / no connect prompt):
//    The error in the log:
//      "Me: Unexpected error at r.request (evmAsk.js) at r.selectExtension"
//    This is thrown by a MetaMask extension conflict — you have MULTIPLE
//    wallet extensions installed (e.g. MetaMask + another EVM wallet like
//    Rabby, Coinbase Wallet, etc.). When multiple wallets compete for
//    `window.ethereum`, `evmAsk.js` shows an "extension selector" popup which
//    then throws "Unexpected error" if the user doesn't interact with it, or
//    if it can't resolve. This crashes `eth_requestAccounts` entirely.
//
//    FIX: Use `window.ethereum.providers` to find and use the MetaMask
//    provider specifically (identified by `isMetaMask === true &&
//    !isBraveWallet`). If only one provider exists, use it directly. This
//    bypasses the multi-wallet conflict completely.
//
//  BUG 3 — "Refreshing..." button stuck on /data-display:
//    DataDisplay.js creates its own Web3 instance independently from useWeb3.
//    When `window.ethereum` throws (BUG 2), DataDisplay falls back to the
//    HttpProvider (Ganache at 127.0.0.1:7545). If Ganache is running but
//    the contract address in config.js doesn't match the current deployment,
//    `getAllProjectSummaries()` throws and the loading flag is never cleared.
//    This is fixed in DataDisplay.js (separate file).
//
//  BUG 4 — `setupContracts` was a plain function called inside a useCallback,
//    causing a stale closure — React couldn't track it as a dependency.
//    Inlined directly into init() to eliminate the closure issue.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import {
  PROJECT_REGISTRY_ABI,
  FUND_TRANSFER_MANAGER_ABI,
  TRANSPARENCY_PORTAL_ABI,
  CONTRACT_ADDRESSES,
} from "../config";

export const ROLE_HASHES = {
  ADMIN:            "0x0000000000000000000000000000000000000000000000000000000000000000",
  FINANCE_MINISTRY: "0xed209dbcc6b0bb9e96ee65e2361665a3f1246995646f90cf72ed987481ca104a",
  TREASURY:         "0x06659f8c49afb9691b014daafb991b10a40d58be165ea93339021eb411f753fb",
  CITY_CORPORATION: "0x367f0821df26b91176b6b77dfde1bfa6935b62b1bdf62b1df62b1df62b1df62b",
  BUILDER:          "0xdd09d1e8473da630c7772baee5dbf8615b3df6675ca33510c4f8d97036fb3eb1",
};

// ─────────────────────────────────────────────────────────────────────────────
//  Resolves the correct EIP-1193 provider to use.
//  When multiple wallet extensions are installed, window.ethereum may be a
//  "proxy" that throws on eth_requestAccounts. We look for the real MetaMask
//  provider inside window.ethereum.providers[] if it exists.
// ─────────────────────────────────────────────────────────────────────────────
function getMetaMaskProvider() {
  if (!window.ethereum) return null;

  // Multiple wallets installed — providers array exists
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    // Prefer MetaMask specifically (not Brave, not Coinbase, etc.)
    const metamask = window.ethereum.providers.find(
      (p) => p.isMetaMask && !p.isBraveWallet
    );
    if (metamask) return metamask;

    // Fallback: any MetaMask-like provider
    const anyMM = window.ethereum.providers.find((p) => p.isMetaMask);
    if (anyMM) return anyMM;

    // Last resort: first available provider
    return window.ethereum.providers[0];
  }

  // Single wallet — use it directly
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

  // Kept as a standalone callback so components can also call it manually
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
      // ── Step 1: Request wallet connection (triggers MetaMask popup) ──────
      let activeAccounts = [];
      try {
        activeAccounts = await provider.request({ method: "eth_requestAccounts" });
      } catch (connErr) {
        // User rejected or multi-wallet conflict — fall back to read-only mode
        console.warn("Wallet connection failed or rejected:", connErr.message);
        // Read-only mode via direct Ganache HTTP connection
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

      // ── Step 2: Build Web3 instance from the resolved provider ───────────
      const w3 = new Web3(provider);
      setWeb3(w3);

      const currentAccount = activeAccounts[0] || null;
      setAccounts(activeAccounts);
      setAccount(currentAccount);
      setIsConnected(!!currentAccount);

      // ── Step 3: Instantiate all three contracts ───────────────────────────
      const reg = Web3.utils.isAddress(CONTRACT_ADDRESSES.PROJECT_REGISTRY)
        ? new w3.eth.Contract(PROJECT_REGISTRY_ABI,      CONTRACT_ADDRESSES.PROJECT_REGISTRY)  : null;
      const fm  = Web3.utils.isAddress(CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER)
        ? new w3.eth.Contract(FUND_TRANSFER_MANAGER_ABI, CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER) : null;
      const tp  = Web3.utils.isAddress(CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)
        ? new w3.eth.Contract(TRANSPARENCY_PORTAL_ABI,   CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)   : null;

      setRegistry(reg);
      setFundManager(fm);
      setPortal(tp);

      // ── Step 4: Resolve role BEFORE clearing loading flag ────────────────
      // This is the key fix for "Verifying Ledger" being stuck forever.
      // We resolve the role synchronously in the same async chain so loading
      // is set to false only after EVERYTHING is ready.
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
      // loading=false is ALWAYS reached, even on error — no more stuck spinner
      setLoading(false);
    }
  }, [detectRole]);

  // Run once on mount
  useEffect(() => {
    init();
  }, [init]);

  // Re-detect role if registry or account changes AFTER initial load
  // (e.g. user switches accounts in MetaMask)
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

  // EIP-1193 event listeners for account / chain changes
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
    provider.on("chainChanged", onChainChanged);

    return () => {
      if (provider.removeListener) {
        provider.removeListener("accountsChanged", onAccountsChanged);
        provider.removeListener("chainChanged", onChainChanged);
      }
    };
  }, []);

  // Manual connect button (for UI "Connect Wallet" buttons)
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
