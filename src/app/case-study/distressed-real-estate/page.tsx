"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { caseStudyConfig } from "@/data/defaults";
import { useFundStore } from "@/hooks/useFundStore";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Clock,
  ArrowRight,
  RotateCcw,
  Download,
  Globe,
  Scale,
  Target,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Capital call pacing data
const capitalCallPacing = [
  { quarter: "Q1 Y1", called: 5, cumulative: 5 },
  { quarter: "Q2 Y1", called: 5, cumulative: 10 },
  { quarter: "Q3 Y1", called: 8, cumulative: 18 },
  { quarter: "Q4 Y1", called: 7, cumulative: 25 },
  { quarter: "Q1 Y2", called: 10, cumulative: 35 },
  { quarter: "Q2 Y2", called: 10, cumulative: 45 },
  { quarter: "Q3 Y2", called: 8, cumulative: 53 },
  { quarter: "Q4 Y2", called: 7, cumulative: 60 },
  { quarter: "Q1 Y3", called: 8, cumulative: 68 },
  { quarter: "Q2 Y3", called: 7, cumulative: 75 },
  { quarter: "Q3 Y3", called: 5, cumulative: 80 },
  { quarter: "Q4 Y3", called: 5, cumulative: 85 },
  { quarter: "Q1 Y4", called: 5, cumulative: 90 },
  { quarter: "Q2 Y4", called: 5, cumulative: 95 },
  { quarter: "Q3 Y4", called: 3, cumulative: 98 },
  { quarter: "Q4 Y4", called: 2, cumulative: 100 },
];

const deploymentWindows = [
  { window: "Year 1", distressed: 400, opportunistic: 100, total: 500 },
  { window: "Year 2", distressed: 500, opportunistic: 200, total: 700 },
  { window: "Year 3", distressed: 300, opportunistic: 200, total: 500 },
  { window: "Year 4", distressed: 100, opportunistic: 200, total: 300 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function CaseStudyPage() {
  const { config, setConfig, reset } = useFundStore(caseStudyConfig);
  const [activeTab, setActiveTab] = useState<"overview" | "deployment" | "structure" | "economics">("overview");

  const resetDefaults = () => {
    reset(caseStudyConfig);
  };

  const tabs = [
    { id: "overview" as const, label: "Executive Summary", icon: Briefcase },
    { id: "deployment" as const, label: "Deployment Model", icon: TrendingUp },
    { id: "structure" as const, label: "Structure", icon: Building2 },
    { id: "economics" as const, label: "Economics", icon: DollarSign },
  ];

  const gpCommitDollar = (config.targetSize * config.gps[0]?.gpCommitPercent) / 100;
  const managementFeeAnnual = (config.targetSize * config.managementFeePercent) / 100;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-card/80 via-card/50 to-card/80">
        <div className="max-w-[1400px] mx-auto px-8 py-16">
          <div className="flex items-start justify-between">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-semibold uppercase tracking-wider">
                  Case Study
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[10px] font-semibold uppercase tracking-wider">
                  {config.strategy}
                </span>
              </div>
              <h1 className="font-serif text-4xl font-bold mb-3">
                {config.fundName}
              </h1>
              <p className="text-sm text-muted">
                GP: Meridian Capital Partners &bull; Target: {formatCurrency(config.targetSize, true)} &bull; {config.domicile} &bull; {config.fundTerm}-Year Term
              </p>
            </motion.div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium hover:bg-card-hover hover:border-border-hover transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card/30">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="case-tab-active"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-14">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Target Fund Size", value: formatCurrency(config.targetSize, true), icon: DollarSign, color: "text-gold" },
                { label: "Target LPs", value: `${config.targetLPCount}`, icon: Users, color: "text-accent" },
                { label: "GP Commitment", value: formatCurrency(gpCommitDollar, true), icon: Target, color: "text-emerald-400" },
                { label: "Fund Term", value: `${config.fundTerm} Years`, icon: Clock, color: "text-purple-400" },
              ].map((metric) => (
                <motion.div
                  key={metric.label}
                  variants={fadeUp}
                  className="p-5 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                  <p className={`text-2xl font-bold font-serif ${metric.color}`}>
                    {metric.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              {/* Fund Snapshot */}
              <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-accent" />
                  Fund Snapshot
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between"><span className="text-muted">Strategy</span><span className="font-medium">{config.strategy}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Domicile</span><span className="font-medium">{config.domicile}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Structure</span><span className="font-medium">{config.masterFeeder ? "Master-Feeder" : "Standalone"}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Feeders</span><span className="font-medium">{config.feeders.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Closing Method</span><span className="font-medium">{config.closingMethod}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Min Commitment</span><span className="font-medium">{formatCurrency(config.minCommitment, true)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">LP Types</span><span className="font-medium text-right">{config.lpTypes.join(", ")}</span></div>
                </div>
              </motion.div>

              {/* Economics Snapshot */}
              <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gold" />
                  Economics
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between"><span className="text-muted">Management Fee</span><span className="font-medium">{config.managementFeePercent}% on {config.managementFeeBasis}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Annual Mgmt Fee</span><span className="font-medium text-gold">{formatCurrency(managementFeeAnnual, true)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Carried Interest</span><span className="font-medium">{config.carryPercent}%</span></div>
                  <div className="flex justify-between"><span className="text-muted">Preferred Return</span><span className="font-medium">{config.preferredReturn}%</span></div>
                  <div className="flex justify-between"><span className="text-muted">Catch-Up</span><span className="font-medium">{config.catchUp ? `${config.catchUpPercent}%` : "None"}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Waterfall</span><span className="font-medium">{config.waterfallType}</span></div>
                  <div className="flex justify-between"><span className="text-muted">GP Clawback</span><span className="font-medium">{config.gpClawback ? "Yes" : "No"}</span></div>
                </div>
              </motion.div>

              {/* Ops & Compliance */}
              <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Ops & Compliance
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between"><span className="text-muted">AML/KYC</span><span className="font-medium">{config.amlDepth}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Audit</span><span className="font-medium">{config.auditRequired ? "Required" : "Optional"}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Administrator</span><span className="font-medium">{config.administrator ? "Yes" : "No"}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Reporting</span><span className="font-medium">{config.reportingCadence}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Custody</span><span className="font-medium text-right">{config.custodyApproach}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Sub Line</span><span className="font-medium">{config.subscriptionLine ? "Yes" : "No"}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Key Person</span><span className="font-medium">{config.keyPersonProvisions ? "Yes" : "No"}</span></div>
                </div>
              </motion.div>
            </div>

            {/* GP Notes */}
            <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border mb-8">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gold" />
                Key Person & GP Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted block mb-1">Key Person Provisions</span>
                  <p className="text-foreground leading-relaxed">{config.keyPersonNotes || "Standard key person provisions apply."}</p>
                </div>
                <div>
                  <span className="text-muted block mb-1">GP Clawback</span>
                  <p className="text-foreground leading-relaxed">{config.gpClawbackNotes || "Standard GP clawback provisions apply."}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Deployment Tab */}
        {activeTab === "deployment" && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {/* Capital Call Pacing */}
              <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold">Capital Call Pacing Curve</h3>
                </div>
                <p className="text-xs text-muted mb-4">
                  Projected cumulative capital called as % of commitments over the investment period
                </p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={capitalCallPacing}>
                      <defs>
                        <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2030" />
                      <XAxis dataKey="quarter" tick={{ fill: "#6b7094", fontSize: 9 }} axisLine={{ stroke: "#1e2030" }} />
                      <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: "#6b7094", fontSize: 10 }} axisLine={{ stroke: "#1e2030" }} />
                      <Tooltip
                        contentStyle={{ background: "#12131a", border: "1px solid #1e2030", borderRadius: 8, fontSize: 12 }}
                        formatter={(value: unknown, name: unknown) => [`${value}%`, name === "cumulative" ? "Cumulative" : "Called"]}
                      />
                      <Area type="monotone" dataKey="cumulative" stroke="#3b82f6" fill="url(#colorCum)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Deployment Windows */}
              <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold">Deployment Windows ($M)</h3>
                </div>
                <p className="text-xs text-muted mb-4">
                  Expected deployment by strategy type across the investment period
                </p>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deploymentWindows}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2030" />
                      <XAxis dataKey="window" tick={{ fill: "#6b7094", fontSize: 10 }} axisLine={{ stroke: "#1e2030" }} />
                      <YAxis tickFormatter={(v) => `$${v}M`} tick={{ fill: "#6b7094", fontSize: 10 }} axisLine={{ stroke: "#1e2030" }} />
                      <Tooltip
                        contentStyle={{ background: "#12131a", border: "1px solid #1e2030", borderRadius: 8, fontSize: 12 }}
                        formatter={(value: unknown) => [`$${value}M`]}
                      />
                      <Bar dataKey="distressed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Distressed" />
                      <Bar dataKey="opportunistic" fill="#c9a84c" radius={[4, 4, 0, 0]} name="Opportunistic" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Deployment Metrics */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Investment Period", value: "4 Years", color: "text-accent" },
                { label: "Reserve Ratio", value: "15%", color: "text-gold" },
                { label: "Target Deployment", value: "85% of Commitments", color: "text-emerald-400" },
                { label: "Recycling Capacity", value: "Up to 20%", color: "text-purple-400" },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-xl bg-card border border-border">
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block mb-1">{m.label}</span>
                  <span className={`text-lg font-bold font-serif ${m.color}`}>{m.value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Structure Tab */}
        {activeTab === "structure" && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Structure Overview */}
              <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-accent" />
                  Fund Architecture
                </h3>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <span className="text-[10px] text-muted uppercase tracking-wider block mb-1">Structure Type</span>
                    <span className="text-sm font-semibold">{config.masterFeeder ? "Master-Feeder" : "Standalone"}</span>
                  </div>
                  {config.feeders.map((f, i) => (
                    <div key={f.id} className="p-3 rounded-lg bg-background border border-border">
                      <span className="text-[10px] text-muted uppercase tracking-wider block mb-1">Feeder {i + 1}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-medium">{f.jurisdiction}</span>
                        <span className="text-muted">•</span>
                        <span className="text-muted">{f.investorFocus}</span>
                        {f.blockerEntity && (
                          <>
                            <span className="text-muted">•</span>
                            <span className="text-orange-400">Blocker Entity</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {config.gps.map((g, i) => (
                    <div key={g.id} className="p-3 rounded-lg bg-background border border-border">
                      <span className="text-[10px] text-muted uppercase tracking-wider block mb-1">GP Entity {i + 1}</span>
                      <div className="text-xs">
                        <span className="font-medium">{g.entityType}</span>
                        <span className="text-muted"> — {g.gpCommitPercent}% commitment</span>
                        {g.votingNotes && <p className="text-muted mt-1">{g.votingNotes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Entity Checklist */}
              <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Entity & Service Providers
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Master Fund (Delaware LP)", active: true },
                    { label: `Offshore Feeder (${config.feeders[0]?.jurisdiction ?? "Cayman"})`, active: config.masterFeeder && config.feeders.length > 0 },
                    { label: "Blocker Entity (US Tax-Exempt)", active: config.feeders.some((f) => f.blockerEntity) },
                    { label: "General Partner (LLC)", active: true },
                    { label: "Management Company", active: config.managementCompany },
                    { label: "Carry Vehicle", active: config.carryVehicle },
                    { label: "Subscription Line Facility", active: config.subscriptionLine },
                    { label: "Fund Administrator", active: config.administrator },
                    { label: "Independent Auditor", active: config.auditRequired },
                    { label: "Legal Counsel (Onshore)", active: true },
                    { label: "Legal Counsel (Offshore)", active: config.masterFeeder },
                    { label: "Tax Advisor", active: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                        item.active
                          ? "bg-emerald-500/5 border border-emerald-500/20 text-foreground"
                          : "bg-background border border-border text-muted"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          item.active ? "text-emerald-400" : "text-muted/30"
                        }`}
                      />
                      {item.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Economics Tab */}
        {activeTab === "economics" && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {/* Fee Structure */}
              <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gold" />
                  Fee Structure
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted">Management Fee</span>
                      <span className="text-lg font-bold text-gold font-serif">{config.managementFeePercent}%</span>
                    </div>
                    <div className="text-[10px] text-muted">
                      On {config.managementFeeBasis} = {formatCurrency(managementFeeAnnual, true)}/year
                    </div>
                    <div className="mt-2 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${(config.managementFeePercent / 3) * 100}%` }} />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted">Carried Interest</span>
                      <span className="text-lg font-bold text-accent font-serif">{config.carryPercent}%</span>
                    </div>
                    <div className="text-[10px] text-muted">
                      {config.waterfallType} waterfall with {config.preferredReturn}% preferred return
                    </div>
                    <div className="mt-2 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${(config.carryPercent / 30) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Waterfall */}
              <motion.div variants={fadeUp} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-accent" />
                  Distribution Waterfall
                </h3>
                <div className="space-y-2">
                  {[
                    { step: 1, label: "Return of Capital", desc: "100% to LPs until contributed capital returned", color: "bg-blue-500" },
                    { step: 2, label: "Preferred Return", desc: `${config.preferredReturn}% hurdle rate to LPs`, color: "bg-emerald-500" },
                    { step: 3, label: "GP Catch-Up", desc: config.catchUp ? `${config.catchUpPercent}% to GP until carry % reached` : "No catch-up", color: "bg-gold" },
                    { step: 4, label: "Carried Interest Split", desc: `${config.carryPercent}% to GP / ${100 - config.carryPercent}% to LPs`, color: "bg-purple-500" },
                  ].map((step) => (
                    <div key={step.step} className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border">
                      <div className={`w-6 h-6 rounded-full ${step.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                        {step.step}
                      </div>
                      <div>
                        <span className="text-xs font-semibold block">{step.label}</span>
                        <span className="text-[10px] text-muted">{step.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Additional Economics */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Fee Offsets", value: `${config.feeOffsets}%` },
                { label: "GP Clawback", value: config.gpClawback ? "Yes (30% escrow)" : "No" },
                { label: "Key Person", value: config.keyPersonProvisions ? "Active" : "None" },
                { label: "Subscription Line", value: config.subscriptionLine ? "Available" : "No" },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-xl bg-card border border-border">
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block mb-1">{m.label}</span>
                  <span className="text-sm font-semibold">{m.value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-8 mt-14">
        <div className="max-w-[1400px] mx-auto text-xs text-muted text-center">
          Informational only. Not legal or investment advice.
        </div>
      </footer>
    </div>
  );
}
