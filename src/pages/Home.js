// src/pages/Home.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED — Removed broken image import.
//
//  BUG: The original file had:
//    import block from "../images/blockchain.png";
//
//  There is no "src/images/" directory in this project. This caused a
//  compile-time module-not-found error that crashed the entire route silently,
//  producing a blank page when navigating to /home.
//
//  FIX: Replaced the <img> with an inline SVG blockchain icon so no external
//  file is required. Everything else in this component is unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useState } from "react";
import TransactionFlowSteps from "../components/Dashboard/TransactionFlowSteps";
import BlockchainVisualization from "../components/Dashboard/BlockchainVisualization";

// Inline SVG that replaces the missing blockchain.png image
const BlockchainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="h-12 w-12"
    fill="none"
  >
    <rect x="4" y="18" width="12" height="12" rx="2" fill="#a855f7" opacity="0.9" />
    <rect x="18" y="10" width="12" height="12" rx="2" fill="#6366f1" opacity="0.9" />
    <rect x="32" y="18" width="12" height="12" rx="2" fill="#8b5cf6" opacity="0.9" />
    <rect x="18" y="26" width="12" height="12" rx="2" fill="#7c3aed" opacity="0.9" />
    <line x1="16" y1="24" x2="18" y2="22" stroke="#c4b5fd" strokeWidth="2" />
    <line x1="30" y1="16" x2="32" y2="22" stroke="#c4b5fd" strokeWidth="2" />
    <line x1="24" y1="22" x2="24" y2="26" stroke="#c4b5fd" strokeWidth="2" />
  </svg>
);

const Home = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true); // eslint-disable-line no-unused-vars
  const intervalMs = 2000;

  const flows = useMemo(
    () => [
      { id: "approve",    label: "Fund Approval",   from: "fm",       to: "treasury" },
      { id: "send",       label: "Send Fund",        from: "treasury", to: "cc" },
      { id: "distribute", label: "Distribution",     from: "cc",       to: "builders" },
      { id: "update",     label: "Progress Update",  from: "builders", to: "citizens" },
      { id: "verify",     label: "Verification",     from: "citizens", to: "fm" },
    ],
    []
  );

  useEffect(() => {
    if (!playing || !flows.length) return;
    const t = setInterval(() => {
      setStep((p) => (p + 1) % flows.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [playing, flows.length, intervalMs]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg overflow-x-auto">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* Header card */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 dark:bg-slate-800/90 dark:border-slate-700 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-4">
              {/* Inline SVG replaces the missing blockchain.png */}
              <BlockchainIcon />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Government Fund Management
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Blockchain-based project tracking and fund distribution
                </p>
              </div>
            </div>
          </div>
        </div>

        <TransactionFlowSteps
          flows={flows}
          activeIndex={step}
          onChange={(i) => setStep(i)}
          autoCycle={false}
          intervalMs={1700}
          glowMs={1000}
        />

        <div>
          <BlockchainVisualization />
        </div>

      </div>
    </div>
  );
};

export default Home;
