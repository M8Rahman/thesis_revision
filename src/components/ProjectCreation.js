// src/components/ProjectCreation.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED for Web3 v4
//
//  Changes from previous version:
//    • Budget conversion: Web3 v4 utils.toWei() requires a string argument.
//      BigInt approach replaced with web3.utils.toWei(budget, "ether") which
//      works correctly in both v1 and v4.
//    • Added null-guard: contract addresses placeholder check prevents silent
//      failure when CONTRACT_ADDRESSES haven't been filled in yet.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import toast from "react-hot-toast";
import { CONTRACT_ADDRESSES } from "../config";

export default function ProjectCreation() {
  const { web3, accounts, isConnected, registry } = useWeb3();

  const [form, setForm] = useState({
    id: "", name: "", area: "", budget: "", treasury: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const { id, name, area, budget, treasury } = form;

    // Basic validation
    if (!id || !name || !area || !budget || !treasury) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!isConnected || !registry) {
      toast.error("MetaMask not connected. Please connect your wallet.");
      return;
    }
    if (CONTRACT_ADDRESSES.PROJECT_REGISTRY === "YOUR_PROJECT_REGISTRY_ADDRESS") {
      toast.error("Contract not deployed yet. Update CONTRACT_ADDRESSES in config.js first.");
      return;
    }
    if (!treasury.startsWith("0x") || treasury.length !== 42) {
      toast.error("Treasury address is not a valid Ethereum address.");
      return;
    }

    setSubmitting(true);
    try {
      // Web3 v4: utils.toWei(value, unit) — value must be a string
      const budgetWei = web3.utils.toWei(String(budget), "ether");

      // Web3 v4: .methods.fn(args).send({ from }) — same API as v1
      await registry.methods
        .createProject(id, name, area, budgetWei, treasury)
        .send({ from: accounts[0] });

      toast.success("Project created on-chain successfully!");
      setForm({ id: "", name: "", area: "", budget: "", treasury: "" });
    } catch (err) {
      // Web3 v4 error messages can be nested — extract the most useful part
      const msg = err?.cause?.message || err?.message || "Transaction failed.";
      toast.error(msg.slice(0, 150));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = `
    w-full rounded-lg border px-4 py-3 transition-all duration-200
    bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60
    focus:outline-none focus:ring-2 focus:ring-cyan-400/40
  `;
  const labelCls = "text-white text-base block mb-2";

  return (
    <div className="m-auto w-full max-w-xl rounded-b-3xl border shadow-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-slate-700/50">
      {/* Header */}
      <div className="border-b px-8 py-6 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-slate-700/50 space-y-1">
        <h2 className="text-white text-2xl font-semibold">Create / Allocate Project Budget</h2>
        <p className="text-white/70 text-sm">
          Finance Ministry only — creates a new project on-chain via ProjectRegistry.
        </p>
      </div>

      {/* Form */}
      <div className="p-8 space-y-5">
        {[
          { label: "Project ID",   name: "id",   placeholder: "PRJ-2025-0001" },
          { label: "Project Name", name: "name", placeholder: "Road Construction – Dhaka North" },
          { label: "Project Area", name: "area", placeholder: "Uttara, Dhaka" },
        ].map(({ label, name, placeholder }) => (
          <div key={name}>
            <label className={labelCls}>{label}</label>
            <input
              className={inputCls}
              name={name}
              placeholder={placeholder}
              value={form[name]}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        ))}

        <div>
          <label className={labelCls}>Budget (ETH)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-cyan-300/80 pointer-events-none">
              Ξ
            </span>
            <input
              className={inputCls + " pl-8"}
              name="budget"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 10"
              value={form.budget}
              onChange={handleChange}
            />
          </div>
          <p className="text-xs text-white/50 mt-1">
            Enter amount in ETH (e.g. 10). Converted to wei automatically.
          </p>
        </div>

        <div>
          <label className={labelCls}>Treasury Address</label>
          <input
            className={inputCls}
            name="treasury"
            placeholder="0x…"
            value={form.treasury}
            onChange={handleChange}
            autoComplete="off"
          />
          <p className="text-xs text-white/50 mt-1">
            Off-chain process: Treasury account is identified by the Finance Ministry
            and registered here on-chain. Paste Account 1 address from Ganache/MetaMask.
          </p>
        </div>

        <div className="border-t border-slate-700/50 pt-4" />

        {/* Connected wallet info */}
        {accounts[0] && (
          <p className="text-xs text-cyan-400/70">
            Sending from: {accounts[0].slice(0, 6)}…{accounts[0].slice(-4)}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center rounded-lg px-6 py-2.5 font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white disabled:opacity-50 transition-all"
          >
            {submitting ? "Creating…" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
