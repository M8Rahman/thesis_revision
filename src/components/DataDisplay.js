// src/components/DataDisplay.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED for Web3 v4
//
//  Changes:
//    • Web3 v4 .call() returns BigInt for uint256 values.
//      weiToEth() now converts via String() before fromWei().
//    • utilizationRate display: BigInt → String() before rendering.
//    • Sort comparison: Number(String(bigint)) instead of direct Number(bigint).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { TRANSPARENCY_PORTAL_ABI, CONTRACT_ADDRESSES } from "../config";

// Web3 v4 returns BigInt — always stringify first
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
        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function DataDisplay() {
  const [portal, setPortal]     = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searchTerm, setSearch] = useState("");
  const [sortKey, setSortKey]   = useState("");
  const [sortDir, setSortDir]   = useState("asc");

  useEffect(() => {
    const provider = window.ethereum
      ? window.ethereum
      : new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    const w3 = new Web3(provider);
    setPortal(
      new w3.eth.Contract(TRANSPARENCY_PORTAL_ABI, CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)
    );
  }, []);

  const fetchProjects = useCallback(async () => {
    if (!portal) return;
    if (CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL === "YOUR_TRANSPARENCY_PORTAL_ADDRESS") return;
    setLoading(true);
    try {
      const data = await portal.methods.getAllProjectSummaries().call();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err.message);
    } finally {
      setLoading(false);
    }
  }, [portal]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

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
      // Web3 v4 FIX: BigInt fields must go through String() before Number()
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
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

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
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading…</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  {projects.length === 0
                    ? "No projects found. Deploy contracts and create a project first."
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
                    {/* Web3 v4 FIX: BigInt → String before rendering */}
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
