// src/components/Builder/Builder.js
// REVISED — calls ProjectRegistry.assignBuilder()
// Finance Ministry role required.

import React, { useState } from "react";
import { useWeb3 } from "../../hooks/useWeb3";
import toast from "react-hot-toast";

export default function Builder() {
  const { accounts, isConnected, registry } = useWeb3();
  const [projectID, setProjectID]   = useState("");
  const [builder, setBuilder]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAssign = async () => {
    if (!projectID || !builder) { toast.error("Fill in all fields."); return; }
    if (!isConnected || !registry) { toast.error("Connect MetaMask."); return; }
    setSubmitting(true);
    try {
      await registry.methods
        .assignBuilder(projectID, builder)
        .send({ from: accounts[0] });
      toast.success("Builder assigned successfully!");
      setProjectID(""); setBuilder("");
    } catch (err) {
      toast.error(err.message?.slice(0, 120) || "Transaction failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full rounded-lg border px-4 py-3 bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40";

  return (
    <div className="m-auto w-full max-w-xl rounded-b-3xl border shadow-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-slate-700/50">
      <div className="border-b px-8 py-6 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-slate-700/50 space-y-1">
        <h2 className="text-white text-2xl font-semibold">Assign Builder</h2>
        <p className="text-white/70 text-sm">Finance Ministry only. Records the selected contractor on-chain.</p>
      </div>
      <div className="p-8 space-y-5">
        <div>
          <label className="text-white text-base block mb-2">Project ID</label>
          <input className={inputCls} placeholder="PRJ-2025-0001" value={projectID}
            onChange={(e) => setProjectID(e.target.value)} autoComplete="off" />
        </div>
        <div>
          <label className="text-white text-base block mb-2">Builder Address</label>
          <input className={inputCls} placeholder="0x…" value={builder}
            onChange={(e) => setBuilder(e.target.value)} autoComplete="off" />
          <p className="text-xs text-white/50 mt-1">
            Off-chain: tender evaluation determines the builder. This registers the result immutably on-chain.
          </p>
        </div>
        <div className="border-t border-slate-700/50 pt-4" />
        <div className="flex justify-end">
          <button onClick={handleAssign} disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold disabled:opacity-50">
            {submitting ? "Assigning…" : "Assign Builder"}
          </button>
        </div>
      </div>
    </div>
  );
}
