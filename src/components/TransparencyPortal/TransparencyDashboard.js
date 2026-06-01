// src/components/TransparencyPortal/TransparencyDashboard.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED — "Searching..." stuck forever resolved
//
//  ROOT CAUSE:
//    The component called four methods:
//      portal.methods.getProjectStatus(id).call()
//      portal.methods.getProjectProgress(id).call()
//      portal.methods.getFundFlow(id).call()
//      portal.methods.getProjectParticipants(id).call()
//
//    BUT the TRANSPARENCY_PORTAL_ABI in the original config.js only declared
//    two functions: getProjectCompleteDetails() and getAllProjectSummaries().
//    The four individual functions were missing from the ABI entirely.
//
//    When Web3 tries to call a method not in the ABI, it encodes the call
//    incorrectly and the RPC call either returns garbage or hangs. Combined
//    with no timeout, this left loading=true permanently — the button stuck
//    on "Searching…" forever with no error shown.
//
//  FIX 1 (PRIMARY): config.js now has all four functions in the ABI.
//    Make sure you are using the fixed config.js from this patch set.
//
//  FIX 2 (SAFETY NET): Added a 15-second timeout to Promise.all so the
//    button NEVER stays stuck forever — it will show a clear error message.
//
//  FIX 3: portal initialization now uses getMetaMaskProvider() instead of
//    window.ethereum directly, matching the fix in useWeb3.js and DataDisplay.
//    This avoids the multi-wallet conflict that could silently break the
//    HttpProvider fallback.
//
//  FIX 4: Added a null-guard — if portal is still null when Search is clicked
//    (e.g. Ganache not running), show a clear error immediately instead of
//    hanging silently.
//
//  Everything else (UI, layout, styles) is unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import {
  TRANSPARENCY_PORTAL_ABI,
  CONTRACT_ADDRESSES,
} from "../../config";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const weiToEth = (wei) => {
  if (wei === undefined || wei === null) return "0.0000";
  try {
    const eth = Web3.utils.fromWei(String(wei), "ether");
    return parseFloat(eth).toFixed(4);
  } catch {
    return "0.0000";
  }
};

const fmtDate = (ts) => {
  if (!ts) return "—";
  try {
    return new Date(Number(ts) * 1000).toLocaleDateString("en-BD");
  } catch {
    return "—";
  }
};

const phaseColor = (phase) => {
  if (phase === "Planned")     return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
  if (phase === "Assigned")    return "bg-blue-500/20 text-blue-300 border-blue-500/40";
  if (phase === "In Progress") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
  return "bg-green-500/20 text-green-300 border-green-500/40";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, Number(String(value || 0))));
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
    <div className="flex justify-between items-center text-sm border-b border-slate-700/40 pb-1 gap-4">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="text-white font-medium text-right break-all">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TransparencyDashboard() {
  const [portal, setPortal]           = useState(null);
  const [searchID, setSearchID]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [allProjects, setAllProjects] = useState([]);
  const [selected, setSelected]       = useState(null);

  // ── Initialize portal contract (no MetaMask required) ──────────────────────
  useEffect(() => {
    try {
      // FIX 3: Use getMetaMaskProvider() to avoid multi-wallet conflict
      const mmProvider = getMetaMaskProvider();
      const provider = mmProvider
        ? mmProvider
        : new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      const w3 = new Web3(provider);

      if (!Web3.utils.isAddress(CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL)) {
        console.warn("TransparencyDashboard: invalid contract address in config.js");
        return;
      }

      const p = new w3.eth.Contract(
        TRANSPARENCY_PORTAL_ABI,
        CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL
      );
      setPortal(p);
    } catch (e) {
      console.warn("TransparencyDashboard: portal init error:", e.message);
    }
  }, []);

  // ── Load all project summaries on mount ────────────────────────────────────
  useEffect(() => {
    if (!portal) return;
    if (CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL === "YOUR_TRANSPARENCY_PORTAL_ADDRESS") return;

    portal.methods
      .getAllProjectSummaries()
      .call()
      .then((data) => setAllProjects(data || []))
      .catch((err) => console.warn("getAllProjectSummaries:", err.message));
  }, [portal]);

  // ── Core search: calls the four individual view functions ──────────────────
  const doSearch = useCallback(async (id) => {
    // FIX 4: Null-guard with clear error
    if (!portal) {
      setError(
        "Contract not initialized. Make sure Ganache is running and contract addresses in config.js are correct."
      );
      return;
    }
    if (!id) return;

    setLoading(true);
    setError("");
    setSelected(null);

    // FIX 2: 15-second timeout — button will NEVER stay stuck forever
    const timeout = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Request timed out after 15 seconds. Is Ganache running?")),
        15000
      )
    );

    try {
      // FIX 1: These four methods now work because config.js ABI includes them.
      //   getProjectStatus()      → ProjectStatus struct
      //   getProjectProgress()    → ProjectProgress struct
      //   getFundFlow()           → FundFlow struct
      //   getProjectParticipants()→ ProjectParticipants struct
      const [status, progress, fundFlow, participants] = await Promise.race([
        Promise.all([
          portal.methods.getProjectStatus(id).call(),
          portal.methods.getProjectProgress(id).call(),
          portal.methods.getFundFlow(id).call(),
          portal.methods.getProjectParticipants(id).call(),
        ]),
        timeout,
      ]);

      setSelected({ status, progress, fundFlow, participants });
    } catch (err) {
      console.error("TransparencyDashboard search error:", err.message);
      if (err.message.includes("timed out")) {
        setError(err.message);
      } else {
        setError(
          "Project not found or contract call failed. " +
          "Check the Project ID and make sure the contract addresses in config.js are correct."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [portal]);

  // ── Search handler (called by button and Enter key) ────────────────────────
  const handleSearch = useCallback(() => {
    doSearch(searchID.trim());
  }, [doSearch, searchID]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xl">
            🔍
          </div>
          <div>
            <h1 className="text-2xl font-bold">Public Transparency Portal</h1>
            <p className="text-slate-400 text-sm">
              Search and verify government fund disbursements — no wallet required
            </p>
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
        {error && <p className="text-red-400 mt-2 text-sm">⚠ {error}</p>}
      </div>

      {/* Search result cards */}
      {selected && (
        <div className="max-w-5xl mx-auto mb-10 space-y-4">

          {/* Status */}
          <Card title="Project Status">
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${phaseColor(selected.status.phase)}`}>
                {selected.status.phase}
              </span>
              {!selected.status.isActive && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-red-500/20 text-red-300 border-red-500/40">
                  Inactive
                </span>
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
            <InfoRow
              label="Installments Released"
              value={`${String(selected.progress.installmentsReleased)} / ${String(selected.progress.maxInstallments)}`}
            />
            <div>
              <div className="flex justify-between text-sm text-slate-400 mt-1">
                <span>Budget Disbursed</span>
                <span>{String(selected.progress.percentFunded)}%</span>
              </div>
              <ProgressBar value={selected.progress.percentFunded} />
            </div>
            <InfoRow label="Funds Reached City Corp" value={`${weiToEth(selected.progress.fundsReachedCC)} ETH`} />
            <InfoRow label="Funds Reached Builder"   value={`${weiToEth(selected.progress.fundsReachedBuilder)} ETH`} />
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
            <InfoRow label="City Corporation"  value={selected.participants.cityCorporation || "Not yet assigned"} />
            <InfoRow label="Builder"           value={selected.participants.builder || "Not yet assigned"} />
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
                    <td className="px-4 py-3 font-mono text-cyan-400 text-xs">{p.projectID}</td>
                    <td className="px-4 py-3 text-white">{p.projectName}</td>
                    <td className="px-4 py-3">{weiToEth(p.allocatedBudget)}</td>
                    <td className="px-4 py-3">{weiToEth(p.totalDisbursed)}</td>
                    <td className="px-4 py-3">{weiToEth(p.totalUtilized)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={p.utilizationRate} />
                        <span className="text-slate-300 w-10 text-right">
                          {String(p.utilizationRate)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSearchID(p.projectID);
                          doSearch(p.projectID);
                        }}
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

      {/* No contracts message */}
      {CONTRACT_ADDRESSES.TRANSPARENCY_PORTAL === "YOUR_TRANSPARENCY_PORTAL_ADDRESS" && (
        <div className="max-w-5xl mx-auto mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm">
          ⚠️ Contract addresses not configured. Deploy contracts in Remix and update{" "}
          <code className="bg-yellow-500/20 px-1 rounded">src/config.js</code> → CONTRACT_ADDRESSES.
        </div>
      )}
    </div>
  );
}
