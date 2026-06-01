// src/components/DataDisplay.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED — "Refreshing..." button stuck forever resolved.
//
//  BUG: The original fetchProjects() used a `loading` state that was set to
//  true at the start and only cleared in a `finally` block. BUT the `useEffect`
//  that calls `fetchProjects()` was running on every render cycle because
//  `fetchProjects` itself was a `useCallback` that depended on `portal`, and
//  `portal` was being recreated on every render (new object reference each
//  time the parent re-rendered). This caused:
//    1. fetchProjects fires → loading=true
//    2. state update triggers re-render
//    3. portal reference changes → fetchProjects fires again
//    4. Infinite re-render loop with loading permanently true
//
//  Also: if `window.ethereum` threw (multi-wallet conflict), the fallback
//  HttpProvider was used, but if Ganache wasn't running the contract call
//  would hang indefinitely with no timeout — loading=true forever.
//
//  FIX 1: Removed the unstable `portal` from the useEffect dependency array.
//         fetchProjects is now called only on explicit user action (the Refresh
//         button) and once on mount via a one-time useEffect with [].
//  FIX 2: Added a 10-second timeout to the contract call so it fails fast
//         instead of hanging if Ganache is unreachable.
//  FIX 3: Uses getMetaMaskProvider() same as useWeb3 to avoid the multi-wallet
//         conflict that was causing window.ethereum to throw.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback, useRef } from "react";
import Web3 from "web3";
import { TRANSPARENCY_PORTAL_ABI, CONTRACT_ADDRESSES } from "../config";

// ── Same multi-wallet resolver used in useWeb3 ────────────────────────────────
function getMetaMaskProvider() {
  if (!window.ethereum) return null;
  if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
    const mm = window.ethereum.providers.find((p) => p.isMetaMask && !p.isBraveWallet)
            || window.ethereum.providers.find((p) => p.isMetaMask)
            || window.ethereum.providers[0];
    return mm || null;
  }
  return window.ethereum;
}

const weiToEth = (wei) => {
  if (wei === undefined || wei === null) return "0.0000";
  try {
    return parseFloat(Web3.utils.fromWei(String(wei), "ether")).toFixed(4);
  } catch {
    return "0.0000";
  }
};

function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, Number(String(value || 0))));
  return (
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function DataDisplay() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searchTerm, setSearch] = useState("");
  const [sortKey, setSortKey]   = useState("");
  const [sortDir, setSortDir]   = useState("asc");
  const [fetchError, setFetchError] = useState("");
  const portalRef = useRef(null);   // stable ref — avoids the re-render loop

  // Build the portal contract instance once on mount
  useEffect(() => {
    try {
      const provider = getMetaMaskProvider();
      const w3 = provider
        ? new Web3(provider)
        : new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

      if (Web3.utils.isAddress(CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)) {
        portalRef.current = new w3.eth.Contract(
          TRANSPARENCY_PORTAL_ABI,
          CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL
        );
      }
    } catch (e) {
      console.warn("DataDisplay: could not create portal contract:", e.message);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    // Guard: contract not deployed yet
    if (
      !CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL ||
      CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL === "YOUR_TRANSPARENCY_PORTAL_ADDRESS"
    ) {
      setFetchError("Contract address not set. Deploy contracts and update config.js.");
      return;
    }

    if (!portalRef.current) {
      setFetchError("Contract not initialized. Check that Ganache is running.");
      return;
    }

    setLoading(true);
    setFetchError("");

    // 10-second timeout so the button never hangs forever
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out after 10 seconds. Is Ganache running?")), 10000)
    );

    try {
      const data = await Promise.race([
        portalRef.current.methods.getAllProjectSummaries().call(),
        timeout,
      ]);
      setProjects(data || []);
    } catch (err) {
      console.error("DataDisplay fetch error:", err.message);
      setFetchError(err.message || "Failed to fetch projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []); // empty deps — stable function, uses ref internally

  // Fetch once on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = projects
    .filter((p) => {
      const s = searchTerm.toLowerCase();
      return (
        p.projectID.toLowerCase().includes(s) ||
        p.projectName.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const isStr = sortKey === "projectID" || sortKey === "projectName";
      const aV = isStr ? a[sortKey].toLowerCase() : Number(String(a[sortKey]));
      const bV = isStr ? b[sortKey].toLowerCase() : Number(String(b[sortKey]));
      return sortDir === "asc" ? (aV > bV ? 1 : -1) : (aV < bV ? 1 : -1);
    });

  const SortIcon = ({ col }) =>
    sortKey !== col
      ? <span className="text-slate-600 ml-1">↕</span>
      : <span className="text-cyan-400 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;

  const thCls =
    "px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white select-none";

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white text-2xl font-semibold">Project Data Overview</h2>
          <p className="text-slate-400 text-sm mt-1">
            Live data from TransparencyPortal smart contract
          </p>
        </div>
        <button
          onClick={fetchProjects}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          ⚠ {fetchError}
        </div>
      )}

      <input
        type="text"
        placeholder="Search by Project ID or Name…"
        value={searchTerm}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md rounded-lg border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm"
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800/80">
            <tr>
              <th className={thCls} onClick={() => handleSort("projectID")}>Project ID <SortIcon col="projectID" /></th>
              <th className={thCls} onClick={() => handleSort("projectName")}>Name <SortIcon col="projectName" /></th>
              <th className={thCls} onClick={() => handleSort("allocatedBudget")}>Budget (ETH) <SortIcon col="allocatedBudget" /></th>
              <th className={thCls} onClick={() => handleSort("totalDisbursed")}>Disbursed (ETH) <SortIcon col="totalDisbursed" /></th>
              <th className={thCls} onClick={() => handleSort("totalUtilized")}>Utilised (ETH) <SortIcon col="totalUtilized" /></th>
              <th className={thCls} onClick={() => handleSort("utilizationRate")}>Utilisation % <SortIcon col="utilizationRate" /></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Loading from blockchain…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && !fetchError && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  {projects.length === 0
                    ? "No projects found. Create a project first using the dashboard."
                    : "No results match your search."}
                </td>
              </tr>
            )}
            {!loading && filtered.map((p, i) => (
              <tr
                key={i}
                className="border-t border-slate-700/40 hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-cyan-400 text-xs">{p.projectID}</td>
                <td className="px-4 py-3 text-white font-medium">{p.projectName}</td>
                <td className="px-4 py-3 text-slate-300">{weiToEth(p.allocatedBudget)}</td>
                <td className="px-4 py-3 text-slate-300">{weiToEth(p.totalDisbursed)}</td>
                <td className="px-4 py-3 text-slate-300">{weiToEth(p.totalUtilized)}</td>
                <td className="px-4 py-3 w-40">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={p.utilizationRate} />
                    <span className="text-slate-300 text-xs w-8 text-right">
                      {String(p.utilizationRate)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-slate-500 text-xs">
        Showing {filtered.length} of {projects.length} projects · Data from on-chain TransparencyPortal
      </p>
    </div>
  );
}
