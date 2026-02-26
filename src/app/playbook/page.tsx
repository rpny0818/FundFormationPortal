"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playbookPhases } from "@/data/defaults";
import {
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Target,
  ArrowRight,
} from "lucide-react";

const phaseColors = [
  "border-blue-500/40 bg-blue-500/5",
  "border-emerald-500/40 bg-emerald-500/5",
  "border-amber-500/40 bg-amber-500/5",
  "border-purple-500/40 bg-purple-500/5",
  "border-rose-500/40 bg-rose-500/5",
];

const phaseDotColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
];

export default function PlaybookPage() {
  const [activePhase, setActivePhase] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-serif text-3xl font-bold mb-3">
              Formation Playbook
            </h1>
            <p className="text-sm text-muted max-w-2xl">
              A phase-by-phase guide through the complete fund formation lifecycle —
              from initial strategy and structuring through capital deployment and
              ongoing operations.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {/* Timeline Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold">Timeline Overview</h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-6 left-0 right-0 h-px bg-border hidden lg:block" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {playbookPhases.map((phase, i) => (
                <motion.button
                  key={phase.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  onClick={() =>
                    setActivePhase(activePhase === phase.id ? null : phase.id)
                  }
                  className={`relative text-left p-4 rounded-xl border transition-all duration-300 group ${
                    activePhase === phase.id
                      ? phaseColors[i]
                      : "border-border bg-card hover:border-border-hover hover:bg-card-hover"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${phaseDotColors[i]} ${
                        activePhase === phase.id ? "ring-2 ring-offset-2 ring-offset-background" : ""
                      }`}
                      style={
                        activePhase === phase.id
                          ? ({ "--tw-ring-color": phaseDotColors[i] } as React.CSSProperties)
                          : {}
                      }
                    />
                    <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                      Phase {phase.phase}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{phase.title}</h3>
                  <p className="text-[11px] text-muted">{phase.duration}</p>
                  <ChevronRight
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted transition-transform ${
                      activePhase === phase.id ? "rotate-90" : ""
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Phase Details */}
        <AnimatePresence mode="wait">
          {activePhase && (
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.42, 0, 0.58, 1] }}
              className="overflow-hidden"
            >
              {playbookPhases
                .filter((p) => p.id === activePhase)
                .map((phase) => {
                  const idx = phase.phase - 1;
                  return (
                    <div
                      key={phase.id}
                      className={`rounded-xl border p-8 mb-8 ${phaseColors[idx]}`}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-4 h-4 rounded-full ${phaseDotColors[idx]}`}
                            />
                            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                              Phase {phase.phase} — {phase.duration}
                            </span>
                          </div>
                          <h2 className="font-serif text-2xl font-bold mb-2">
                            {phase.title}
                          </h2>
                          <p className="text-sm text-muted max-w-2xl leading-relaxed">
                            {phase.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tasks */}
                        <div className="bg-background/40 rounded-lg p-5 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                            <h3 className="text-sm font-semibold">Tasks</h3>
                          </div>
                          <ul className="space-y-2">
                            {phase.tasks.map((task, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-muted leading-relaxed"
                              >
                                <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-accent/50" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Deliverables */}
                        <div className="bg-background/40 rounded-lg p-5 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-sm font-semibold">
                              Deliverables
                            </h3>
                          </div>
                          <ul className="space-y-2">
                            {phase.deliverables.map((d, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-muted leading-relaxed"
                              >
                                <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0 text-emerald-400/50" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Key Decisions */}
                        <div className="bg-background/40 rounded-lg p-5 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-4 h-4 text-gold" />
                            <h3 className="text-sm font-semibold">
                              Key Decisions
                            </h3>
                          </div>
                          <ul className="space-y-2">
                            {phase.keyDecisions.map((d, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-muted leading-relaxed"
                              >
                                <Target className="w-3 h-3 mt-0.5 shrink-0 text-gold/50" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Phases Expanded (when none selected) */}
        {!activePhase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold">
                Click a phase above to expand details
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {playbookPhases.map((phase, i) => (
                <motion.button
                  key={phase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => setActivePhase(phase.id)}
                  className="text-left p-6 rounded-xl bg-card border border-border hover:border-border-hover hover:bg-card-hover transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-3 h-3 rounded-full ${phaseDotColors[i]}`}
                    />
                    <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                      Phase {phase.phase} — {phase.duration}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2 group-hover:text-accent transition-colors">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {phase.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[10px] text-muted">
                    <span>{phase.tasks.length} tasks</span>
                    <span>{phase.deliverables.length} deliverables</span>
                    <span>{phase.keyDecisions.length} decisions</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 mt-10">
        <div className="max-w-[1400px] mx-auto text-xs text-muted text-center">
          Informational only. Not legal or investment advice.
        </div>
      </footer>
    </div>
  );
}
