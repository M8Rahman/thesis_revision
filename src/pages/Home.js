import block from "..public/images/blockchain.png";
import React, { useEffect, useMemo, useState } from "react";
import TransactionFlowSteps from "../components/Dashboard/TransactionFlowSteps";
import BlockchainVisualization from "../components/Dashboard/BlockchainVisualization";

const Home = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalMs = 2000;

  const flows = useMemo(
    () => [
      { id: "approve",    label: "Fund Approval",   from: "fm",        to: "treasury" },
      { id: "send",       label: "Send Fund",       from: "treasury",  to: "cc" },
      { id: "distribute", label: "Distribution",    from: "cc",        to: "builders" },
      { id: "update",     label: "Progress Update", from: "builders",  to: "citizens" },
      { id: "verify",     label: "Verification",    from: "citizens",  to: "fm" },
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
        {/* Header Card (kept airy but compact) */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 dark:bg-slate-800/90 dark:border-slate-700 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-4">
              <img src={block} className="h-12 w-12" alt="Blockchain" />
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
