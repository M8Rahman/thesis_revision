// src/components/ProjectCreation.js
// REVISED — uses ProjectRegistry.createProject() + useWeb3 hook.
// Finance Ministry role required on-chain.

import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import toast from "react-hot-toast";

export default function ProjectCreation() {
  const { accounts, isConnected, registry } = useWeb3();

  const [form, setForm] = useState({
    id: "", name: "", area: "", budget: "", treasury: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const { id, name, area, budget, treasury } = form;
    if (!id || !name || !area || !budget || !treasury) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!isConnected || !registry) {
      toast.error("Connect MetaMask first.");
      return;
    }
    setSubmitting(true);
    try {
      // budget is stored as wei; front-end sends ETH string, converts here
      const budgetWei = BigInt(Math.round(parseFloat(budget) * 1e18)).toString();
      await registry.methods
        .createProject(id, name, area, budgetWei, treasury)
        .send({ from: accounts[0] });
      toast.success("Project created successfully!");
      setForm({ id: "", name: "", area: "", budget: "", treasury: "" });
    } catch (err) {
      toast.error(err.message?.slice(0, 100) || "Transaction failed.");
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
        <p className="text-white/70 text-sm">Finance Ministry only. Creates a new project on-chain via ProjectRegistry.</p>
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
            <input className={inputCls} name={name} placeholder={placeholder}
              value={form[name]} onChange={handleChange} autoComplete="off" />
          </div>
        ))}

        <div>
          <label className={labelCls}>Budget (ETH)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-cyan-300/80 pointer-events-none">Ξ</span>
            <input className={inputCls + " pl-8"} name="budget" type="number" placeholder="e.g. 10"
              value={form.budget} onChange={handleChange} />
          </div>
          <p className="text-xs text-white/50 mt-1">Enter amount in ETH. Converted to wei on submission.</p>
        </div>

        <div>
          <label className={labelCls}>Treasury Address</label>
          <input className={inputCls} name="treasury" placeholder="0x…"
            value={form.treasury} onChange={handleChange} autoComplete="off" />
          <p className="text-xs text-white/50 mt-1">
            Off-chain process: Treasury account is identified by the Finance Ministry and registered here on-chain.
          </p>
        </div>

        <div className="border-t border-slate-700/50 pt-4" />

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
