import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react"; // 👉 arrow icon

const TransactionFlowSteps = ({
  flows = [],
  activeIndex = 0,
  onChange = () => {},
  autoCycle = false,
  intervalMs = 1700,
  glowMs = 1000,
}) => {
  const [flash, setFlash] = useState(flows.map(() => false));
  const timersRef = useRef([]);

  useEffect(() => {
    setFlash(flows.map(() => false));
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, [flows.length]);

  useEffect(() => {
    if (!flows.length) return;

    setFlash((prev) => {
      const next = [...prev];
      next[activeIndex] = true;
      return next;
    });

    const t = setTimeout(() => {
      setFlash((prev) => {
        const next = [...prev];
        next[activeIndex] = false;
        return next;
      });
    }, glowMs);

    timersRef.current.push(t);
    return () => clearTimeout(t);
  }, [activeIndex, glowMs, flows.length]);

  useEffect(() => {
    if (!autoCycle || !flows.length) return;
    const tick = setInterval(() => {
      onChange((activeIndex + 1) % flows.length);
    }, intervalMs);
    return () => clearInterval(tick);
  }, [autoCycle, flows.length, intervalMs, activeIndex, onChange]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 dark:bg-slate-800/90 dark:border-slate-700 shadow-sm">
      <h2 className="px-6 pt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
        Transaction Flow Steps
      </h2>

      <div className="p-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        {flows.map((f, i) => {
          const isActive = i === activeIndex;
          const isFlashing = !isActive && flash[i];
          return (
            <button
              key={f.id}
              onClick={() => onChange(i)}
              className={[
                "relative rounded-xl p-4 text-start transition-all border focus:outline-none",
                isActive
                  ? "bg-gradient-to-br from-fuchsia-600 to-violet-600 text-white border-fuchsia-500 shadow-lg"
                  : "bg-gradient-to-br from-fuchsia-900/10 to-violet-900/10 text-fuchsia-700 dark:text-fuchsia-200 border-fuchsia-400/30 hover:scale-[1.02]",
                isFlashing ? "ring-2 ring-fuchsia-400/70 animate-pulse" : "",
              ].join(" ")}
              aria-current={isActive ? "step" : undefined}
            >
              <div className="mb-2 text-2xl font-bold">{i + 1}</div>
              <div className="mb-2 font-semibold">{f.label}</div>
              <div className="text-xs opacity-80">
                {f.from.toUpperCase()} → {f.to.toUpperCase()}
              </div>

              {/* Arrow Icon */}
              <div className="absolute bottom-2 right-2 text-fuchsia-500 dark:text-fuchsia-300">
                <ArrowRight size={18} />
              </div>

              {isFlashing && (
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-fuchsia-400" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default TransactionFlowSteps;
