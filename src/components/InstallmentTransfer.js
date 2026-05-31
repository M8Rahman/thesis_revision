// src/components/InstallmentTransfer.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED for Web3 v4
//
//  Changes:
//    • web3.utils.toWei() — value must be a STRING in Web3 v4.
//      Changed: toWei(amountEth, "ether") → toWei(String(amountEth), "ether")
//    • Error message extraction updated for v4 nested error structure.
//    • Added contract address placeholder guard.
//    • MetaMask account display added for clarity during testing.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import toast from "react-hot-toast";
import { CONTRACT_ADDRESSES } from "../config";

export default function InstallmentTransfer() {
  const { web3, accounts, isConnected, fundManager } = useWeb3();
  const [projectID, setProjectID]   = useState("");
  const [amountEth, setAmountEth]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleTransfer = async () => {
    if (!projectID || !amountEth) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!isConnected || !fundManager) {
      toast.error("MetaMask not connected. Please connect your wallet.");
      return;
    }
    if (CONTRACT_ADDRESSES.FUND_TRANSFER_MANAGER === "YOUR_FUND_TRANSFER_MANAGER_ADDRESS") {
      toast.error("Contract not deployed yet. Update CONTRACT_ADDRESSES in config.js.");
      return;
    }

    setSubmitting(true);
    try {
      // Web3 v4 FIX: toWei requires a string, not a number
      const amountWei = web3.utils.toWei(String(amountEth), "ether");

      await fundManager.methods
        .sendInstallment(projectID)
        .send({ from: accounts[0], value: amountWei });

      toast.success("Installment transferred to City Corporation!");
      setProjectID("");
      setAmountEth("");
    } catch (err) {
      const msg = err?.cause?.message || err?.message || "Transaction failed.";
      toast.error(msg.slice(0, 150));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border px-4 py-3 bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40";

  return (
    <div className="m-auto w-full max-w-xl rounded-b-3xl border shadow-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-slate-700/50">
      <div className="border-b px-8 py-6 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-slate-700/50 space-y-1">
        <h2 className="text-white text-2xl font-semibold">Transfer Installment</h2>
        <p className="text-white/70 text-sm">
          Treasury only — sends ETH installment to City Corporation via FundTransferManager.
        </p>
      </div>
      <div className="p-8 space-y-5">
        <div>
          <label className="text-white text-base block mb-2">Project ID</label>
          <input
            className={inputCls}
            placeholder="PRJ-2025-0001"
            value={projectID}
            onChange={(e) => setProjectID(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label className="text-white text-base block mb-2">Installment Amount (ETH)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-cyan-300/80 pointer-events-none">
              Ξ
            </span>
            <input
              className={inputCls + " pl-8"}
              placeholder="e.g. 2"
              value={amountEth}
              onChange={(e) => setAmountEth(e.target.value)}
              type="number"
              min="0"
              step="any"
            />
          </div>
          <p className="text-xs text-white/50 mt-1">
            Max 3 installments per project. Total cannot exceed the allocated budget.
          </p>
        </div>

        <div className="border-t border-slate-700/50 pt-4" />

        {accounts[0] && (
          <p className="text-xs text-cyan-400/70">
            Sending from: {accounts[0].slice(0, 6)}…{accounts[0].slice(-4)} (must be Treasury account)
          </p>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleTransfer}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Transfer Installment"}
          </button>
        </div>
      </div>
    </div>
  );
}
