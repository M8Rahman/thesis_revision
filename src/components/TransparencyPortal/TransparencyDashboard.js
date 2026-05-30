// src/components/TransparencyPortal/TransparencyDashboard.js
// Public Transparency Dashboard — no wallet required for read-only queries.
// Implements Step 7A: search by project ID, view fund flow, progress, budget, participants.

import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import {
  TRANSPARENCY_PORTAL_ABI,
  CONTRACT_ADDRESSES,
} from "../../config";

// ──────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────
const weiToEth = (wei) =>
  wei ? parseFloat(Web3.utils.fromWei(String(wei), "ether")).toFixed(4) : "0.0000";

const fmtDate = (ts) =>
  ts ? new Date(Number(ts) * 1000).toLocaleDateString("en-BD") : "—";

const phaseColor = (phase) => {
  if (phase === "Planned")     return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
  if (phase === "Assigned")    return "bg-blue-500/20 text-blue-300 border-blue-500/40";
  if (phase === "In Progress") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
  return "bg-green-500/20 text-green-300 border-green-500/40";
};

function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, Number(value)));
  return (
    <div className="w-full bg-slate-700 rounded-full h-3 mt-1">
      <div
        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
      <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-slate-700/40 pb-1">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium text-right max-w-xs break-all">{value}</span>
    </div>
  );
}

// ──────────────────────────────────────────────
//  Main component
// ──────────────────────────────────────────────
export default function TransparencyDashboard() {
  const [portal, setPortal]         = useState(null);
  const [searchID, setSearchID]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [selected, setSelected]     = useState(null); // full project details

  // Initialize portal with read-only provider (no MetaMask required)
  useEffect(() => {
    const w3 = new Web3(
      window.ethereum || new Web3.providers.HttpProvider("http://localhost:7545")
    );
    const p = new w3.eth.Contract(
      TRANSPARENCY_PORTAL_ABI,
      CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL
    );
    setPortal(p);
  }, []);

  // Load all project summaries on mount
  useEffect(() => {
    if (!portal) return;
    portal.methods.getAllProjectSummaries().call()
      .then(setAllProjects)
      .catch(() => {}); // contract may not be deployed yet in dev
  }, [portal]);

  const handleSearch = useCallback(async () => {
    if (!portal || !searchID.trim()) return;
    setLoading(true);
    setError("");
    setSelected(null);
    try {
      const [status, progress, fundFlow, participants] = await Promise.all([
        portal.methods.getProjectStatus(searchID.trim()).call(),
        portal.methods.getProjectProgress(searchID.trim()).call(),
        portal.methods.getFundFlow(searchID.trim()).call(),
        portal.methods.getProjectParticipants(searchID.trim()).call(),
      ]);
      setSelected({ status, progress, fundFlow, participants });
    } catch (err) {
      setError("Project not found or contract unavailable. Check the Project ID.");
    } finally {
      setLoading(false);
    }
  }, [portal, searchID]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xl">🔍</div>
          <div>
            <h1 className="text-2xl font-bold">Public Transparency Portal</h1>
            <p className="text-slate-400 text-sm">Search and verify government fund disbursements — no wallet required</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchID}
            onChange={(e) => setSearchID(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter Project ID (e.g. PRJ-2025-0001)"
            className="flex-1 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
      </div>

      {/* Search result */}
      {selected && (
        <div className="max-w-5xl mx-auto mb-10 space-y-4">
          {/* Status */}
          <Card title="Project Status">
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${phaseColor(selected.status.phase)}`}>
                {selected.status.phase}
              </span>
              {!selected.status.isActive && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-red-500/20 text-red-300 border-red-500/40">Inactive</span>
              )}
            </div>
            <InfoRow label="Project ID"   value={selected.status.projectID} />
            <InfoRow label="Project Name" value={selected.status.projectName} />
            <InfoRow label="Project Area" value={selected.status.projectArea} />
            <InfoRow label="Created At"   value={fmtDate(selected.status.createdAt)} />
            <InfoRow label="City Corporation Assigned" value={selected.status.hasCityCorporation ? "✅ Yes" : "❌ No"} />
            <InfoRow label="Builder Assigned"           value={selected.status.hasBuilder ? "✅ Yes" : "❌ No"} />
          </Card>

          {/* Progress */}
          <Card title="Funding Progress">
            <InfoRow label="Installments Released" value={`${selected.progress.installmentsReleased} / ${selected.progress.maxInstallments}`} />
            <div>
              <div className="flex justify-between text-sm text-slate-400 mt-1">
                <span>Budget Disbursed</span>
                <span>{String(selected.progress.percentFunded)}%</span>
              </div>
              <ProgressBar value={selected.progress.percentFunded} />
            </div>
            <InfoRow label="Funds Reached City Corp"  value={`${weiToEth(selected.progress.fundsReachedCC)} ETH`} />
            <InfoRow label="Funds Reached Builder"    value={`${weiToEth(selected.progress.fundsReachedBuilder)} ETH`} />
          </Card>

          {/* Fund Flow */}
          <Card title="Fund Flow Breakdown">
            <InfoRow label="Allocated Budget"     value={`${weiToEth(selected.fundFlow.allocatedBudget)} ETH`} />
            <InfoRow label="Released to CC"       value={`${weiToEth(selected.fundFlow.releasedToCC)} ETH`} />
            <InfoRow label="Forwarded to Builder" value={`${weiToEth(selected.fundFlow.forwardedToBuilder)} ETH`} />
            <InfoRow label="Pending at CC"        value={`${weiToEth(selected.fundFlow.pendingAtCC)} ETH`} />
            <InfoRow label="Unreleased Budget"    value={`${weiToEth(selected.fundFlow.unreleasedBudget)} ETH`} />
          </Card>

          {/* Participants */}
          <Card title="Project Participants (Accountability)">
            <InfoRow label="Finance Ministry"  value={selected.participants.financeMinistry} />
            <InfoRow label="Treasury"          value={selected.participants.treasury} />
            <InfoRow label="City Corporation"  value={selected.participants.cityCorporation || "Not assigned"} />
            <InfoRow label="Builder"           value={selected.participants.builder || "Not assigned"} />
          </Card>
        </div>
      )}

      {/* All projects table */}
      {allProjects.length > 0 && (
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold text-slate-300 mb-3">All Registered Projects</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Project ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Budget (ETH)</th>
                  <th className="px-4 py-3">Disbursed (ETH)</th>
                  <th className="px-4 py-3">Utilised (ETH)</th>
                  <th className="px-4 py-3">Utilisation %</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {allProjects.map((p, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-700/40 hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-cyan-400">{p.projectID}</td>
                    <td className="px-4 py-3 text-white">{p.projectName}</td>
                    <td className="px-4 py-3">{weiToEth(p.allocatedBudget)}</td>
                    <td className="px-4 py-3">{weiToEth(p.totalDisbursed)}</td>
                    <td className="px-4 py-3">{weiToEth(p.totalUtilized)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={p.utilizationRate} />
                        <span className="text-slate-300 w-10 text-right">{String(p.utilizationRate)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setSearchID(p.projectID); setSelected(null); }}
                        className="text-cyan-400 hover:text-cyan-300 text-xs underline"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
