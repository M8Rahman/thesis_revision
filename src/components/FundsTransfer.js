// src/components/FundsTransfer.js
// REVISED — calls FundTransferManager.sendFundsToBuilder()
// City Corporation role required.

import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import toast from "react-hot-toast";

export default function FundsTransfer() {
  const { web3, accounts, isConnected, fundManager } = useWeb3();
  const [projectID, setProjectID]   = useState("");
  const [amountEth, setAmountEth]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleTransfer = async () => {
    if (!projectID || !amountEth) { toast.error("Fill in all fields."); return; }
    if (!isConnected || !fundManager) { toast.error("Connect MetaMask."); return; }
    setSubmitting(true);
    try {
      const amountWei = web3.utils.toWei(amountEth, "ether");
      await fundManager.methods
        .sendFundsToBuilder(projectID)
        .send({ from: accounts[0], value: amountWei });
      toast.success("Funds transferred to Builder!");
      setProjectID(""); setAmountEth("");
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
        <h2 className="text-white text-2xl font-semibold">Funds Transfer to Builder</h2>
        <p className="text-white/70 text-sm">City Corporation only. Forwards received ETH to the registered Builder.</p>
      </div>
      <div className="p-8 space-y-5">
        <div>
          <label className="text-white text-base block mb-2">Project ID</label>
          <input className={inputCls} placeholder="PRJ-2025-0001" value={projectID}
            onChange={(e) => setProjectID(e.target.value)} autoComplete="off" />
        </div>
        <div>
          <label className="text-white text-base block mb-2">Amount (ETH)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-cyan-300/80 pointer-events-none">Ξ</span>
            <input className={inputCls + " pl-8"} placeholder="e.g. 1.5" value={amountEth}
              onChange={(e) => setAmountEth(e.target.value)} type="number" step="any" />
          </div>
        </div>
        <div className="border-t border-slate-700/50 pt-4" />
        <div className="flex justify-end">
          <button onClick={handleTransfer} disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold disabled:opacity-50">
            {submitting ? "Sending…" : "Transfer Funds"}
          </button>
        </div>
      </div>
    </div>
  );
}
