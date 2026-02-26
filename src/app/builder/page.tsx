"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Users,
  Network,
  TrendingUp,
  ShieldCheck,
  FileText,
  Clock,
  ChevronDown,
  Plus,
  Trash2,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Building2,
  DollarSign,
  Scale,
  Layers,
  CircleDot,
  Check,
  X,
} from "lucide-react";
import { useFundStore } from "@/hooks/useFundStore";
import {
  Strategy,
  Domicile,
  FeederJurisdiction,
  InvestorFocus,
  WaterfallType,
  AMLDepth,
  LaunchSpeed,
} from "@/data/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import dynamic from "next/dynamic";

const StructureDiagram = dynamic(
  () => import("@/components/diagram/StructureDiagram"),
  { ssr: false, loading: () => <div className="h-[500px] rounded-xl bg-card border border-border animate-pulse" /> }
);

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const STRATEGIES: Strategy[] = [
  "Distressed Real Estate",
  "Credit",
  "Buyout",
  "Venture Capital",
  "Secondaries",
  "Infrastructure",
];

const DOMICILES: Domicile[] = [
  "Delaware",
  "Cayman",
  "Luxembourg",
  "Ireland",
  "Custom",
];

const CURRENCIES = ["USD", "EUR", "GBP", "CHF", "JPY", "SGD", "AED"];

const FEEDER_JURISDICTIONS: FeederJurisdiction[] = [
  "Cayman",
  "Luxembourg",
  "Delaware",
  "Abu Dhabi (ADGM)",
  "Dubai (DIFC)",
  "Singapore",
  "Other",
];

const INVESTOR_FOCUSES: InvestorFocus[] = [
  "US Taxable",
  "US Tax-Exempt",
  "Non-US",
  "Mixed",
];

const WATERFALL_TYPES: WaterfallType[] = ["Whole Fund", "Deal-by-Deal"];

const AML_DEPTHS: AMLDepth[] = ["Light", "Standard", "Institutional"];

const LAUNCH_SPEEDS: LaunchSpeed[] = ["Fast", "Standard", "Institutional"];

const LP_TYPES = ["Institutional", "Family Office", "Sovereign", "HNW", "FoF"];

const TABS = [
  { id: "basics", label: "Basics", icon: Settings },
  { id: "investors", label: "Investors", icon: Users },
  { id: "structure", label: "Structure", icon: Network },
  { id: "economics", label: "Economics", icon: TrendingUp },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
  { id: "docs", label: "Docs", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Clock },
] as const;

type TabId = (typeof TABS)[number]["id"];

const REPORTING_CADENCES = ["Quarterly", "Semi-Annual", "Annual"] as const;

const VALUATION_POLICIES = [
  "Quarterly NAV with third-party valuation agent",
  "Annual third-party valuation",
  "Internal valuation with annual audit",
  "Monthly NAV (administrator-calculated)",
];

const CUSTODY_APPROACHES = [
  "Prime broker + qualified custodian",
  "Qualified custodian only",
  "Self-custody with annual audit",
  "Bank custody arrangement",
];

/* -------------------------------------------------------------------------- */
/*  Reusable styled primitives                                                 */
/* -------------------------------------------------------------------------- */

function Label({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-1.5">
      <label className="text-xs font-medium text-foreground/90 tracking-wide">
        {children}
      </label>
      {sub && (
        <span className="block text-[10px] text-muted mt-0.5">{sub}</span>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground
          focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60
          hover:border-border-hover transition-colors cursor-pointer pr-8"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground
        placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40
        focus:border-accent/60 hover:border-border-hover transition-colors"
    />
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground
          focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60
          hover:border-border-hover transition-colors [appearance:textfield]
          [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
          {suffix}
        </span>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 w-full text-left group"
    >
      <div
        className={`relative mt-0.5 w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
          checked ? "bg-accent" : "bg-border"
        }`}
      >
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      <div className="min-w-0">
        <span className="text-sm text-foreground/90 font-medium group-hover:text-foreground transition-colors">
          {label}
        </span>
        {description && (
          <span className="block text-[10px] text-muted mt-0.5 leading-relaxed">
            {description}
          </span>
        )}
      </div>
    </button>
  );
}

function Slider({
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue?: (v: number) => string;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percent}%, #1e2030 ${percent}%, #1e2030 100%)`,
        }}
      />
      <div className="flex justify-between text-[10px] text-muted">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
}

function LPTypeToggle({
  type,
  active,
  onToggle,
}: {
  type: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
        active
          ? "bg-accent/15 border-accent/40 text-accent shadow-[0_0_12px_rgba(59,130,246,0.1)]"
          : "bg-card border-border text-muted hover:text-foreground hover:border-border-hover"
      }`}
    >
      {type}
    </button>
  );
}

function SectionDivider({ label }: { label?: string }) {
  if (!label) return <div className="h-px bg-border/50 my-4" />;
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="h-px bg-border/50 flex-1" />
      <span className="text-[10px] uppercase tracking-widest text-muted font-medium">
        {label}
      </span>
      <div className="h-px bg-border/50 flex-1" />
    </div>
  );
}

function SnapshotCard({
  title,
  icon: Icon,
  items,
  accentColor = "accent",
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { label: string; value: string; highlight?: boolean }[];
  accentColor?: "accent" | "gold" | "success";
}) {
  const colorMap = {
    accent: "text-accent bg-accent/10 border-accent/20",
    gold: "text-gold bg-gold/10 border-gold/20",
    success: "text-success bg-success/10 border-success/20",
  };
  const badgeColors = colorMap[accentColor];

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-border-hover transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-7 h-7 rounded-lg border flex items-center justify-center ${badgeColors}`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-xs font-semibold text-foreground tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-[11px] text-muted">{item.label}</span>
            <span
              className={`text-[11px] font-semibold ${
                item.highlight ? "text-gold" : "text-foreground"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tab Content Components                                                     */
/* -------------------------------------------------------------------------- */

function BasicsTab({
  config,
  setConfig,
}: {
  config: ReturnType<typeof useFundStore>["config"];
  setConfig: ReturnType<typeof useFundStore>["setConfig"];
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Fund Name</Label>
        <TextInput
          value={config.fundName}
          onChange={(v) => setConfig({ fundName: v })}
          placeholder="e.g. Premier Distressed Real Estate Fund I"
        />
      </div>

      <div>
        <Label sub="Core investment thesis">Strategy</Label>
        <Select
          value={config.strategy}
          onChange={(v) => setConfig({ strategy: v as Strategy })}
          options={STRATEGIES}
        />
      </div>

      <div>
        <Label sub="Total capital target">Target Fund Size</Label>
        <motion.div
          className="flex items-baseline justify-center gap-1 py-4 mb-2"
          key={config.targetSize}
        >
          <motion.span
            className="text-4xl font-bold text-foreground tracking-tight font-serif"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {formatCurrency(config.targetSize, true)}
          </motion.span>
        </motion.div>
        <Slider
          value={config.targetSize}
          onChange={(v) => setConfig({ targetSize: v })}
          min={100_000_000}
          max={5_000_000_000}
          step={50_000_000}
          formatValue={(v) => formatCurrency(v, true)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label sub="Investment + harvest">Fund Term</Label>
          <NumberInput
            value={config.fundTerm}
            onChange={(v) => setConfig({ fundTerm: v })}
            min={3}
            max={20}
            step={1}
            suffix="years"
          />
        </div>
        <div>
          <Label>Currency</Label>
          <Select
            value={config.currency}
            onChange={(v) => setConfig({ currency: v })}
            options={CURRENCIES}
          />
        </div>
      </div>

      <div>
        <Label sub="Primary fund jurisdiction">Domicile</Label>
        <Select
          value={config.domicile}
          onChange={(v) => setConfig({ domicile: v as Domicile })}
          options={DOMICILES}
        />
      </div>
    </div>
  );
}

function InvestorsTab({
  config,
  setConfig,
}: {
  config: ReturnType<typeof useFundStore>["config"];
  setConfig: ReturnType<typeof useFundStore>["setConfig"];
}) {
  const toggleLP = (type: string) => {
    const current = config.lpTypes;
    if (current.includes(type)) {
      setConfig({ lpTypes: current.filter((t) => t !== type) });
    } else {
      setConfig({ lpTypes: [...current, type] });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <Label sub="Select all that apply">LP Types</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {LP_TYPES.map((type) => (
            <LPTypeToggle
              key={type}
              type={type}
              active={config.lpTypes.includes(type)}
              onToggle={() => toggleLP(type)}
            />
          ))}
        </div>
      </div>

      <div>
        <Label sub="Per LP minimum">Minimum Commitment</Label>
        <div className="text-center py-2 mb-1">
          <span className="text-2xl font-bold text-foreground font-serif">
            {formatCurrency(config.minCommitment, true)}
          </span>
        </div>
        <Slider
          value={config.minCommitment}
          onChange={(v) => setConfig({ minCommitment: v })}
          min={250_000}
          max={50_000_000}
          step={250_000}
          formatValue={(v) => formatCurrency(v, true)}
        />
      </div>

      <div>
        <Label>Target Number of LPs</Label>
        <div className="text-center py-2 mb-1">
          <span className="text-2xl font-bold text-foreground font-serif">
            {config.targetLPCount}
          </span>
          <span className="text-xs text-muted ml-1">LPs</span>
        </div>
        <Slider
          value={config.targetLPCount}
          onChange={(v) => setConfig({ targetLPCount: v })}
          min={5}
          max={200}
          step={1}
        />
      </div>

      <SectionDivider />

      <div>
        <Label sub="How closings are structured">Closing Method</Label>
        <div className="grid grid-cols-2 gap-2">
          {(
            ["Rolling Close", "First Close / Final Close"] as const
          ).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setConfig({ closingMethod: method })}
              className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                config.closingMethod === method
                  ? "bg-accent/15 border-accent/40 text-accent"
                  : "bg-card border-border text-muted hover:text-foreground hover:border-border-hover"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <Toggle
        checked={config.sideLetters}
        onChange={(v) => setConfig({ sideLetters: v })}
        label="Side Letters"
        description="Permit negotiated LP-specific terms & MFN provisions"
      />
    </div>
  );
}

function StructureTab({
  config,
  setConfig,
  addFeeder,
  removeFeeder,
  updateFeeder,
  addGP,
  removeGP,
  updateGP,
}: {
  config: ReturnType<typeof useFundStore>["config"];
  setConfig: ReturnType<typeof useFundStore>["setConfig"];
  addFeeder: ReturnType<typeof useFundStore>["addFeeder"];
  removeFeeder: ReturnType<typeof useFundStore>["removeFeeder"];
  updateFeeder: ReturnType<typeof useFundStore>["updateFeeder"];
  addGP: ReturnType<typeof useFundStore>["addGP"];
  removeGP: ReturnType<typeof useFundStore>["removeGP"];
  updateGP: ReturnType<typeof useFundStore>["updateGP"];
}) {
  return (
    <div className="space-y-5">
      <Toggle
        checked={config.masterFeeder}
        onChange={(v) => setConfig({ masterFeeder: v })}
        label="Master-Feeder Structure"
        description="Multiple feeder funds investing into a single master fund"
      />

      {config.masterFeeder && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
              Feeder Funds
            </span>
            <button
              type="button"
              onClick={addFeeder}
              className="flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 transition-colors font-medium"
            >
              <Plus className="w-3 h-3" />
              Add Feeder
            </button>
          </div>

          {config.feeders.map((feeder, i) => (
            <motion.div
              key={feeder.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-surface border border-border rounded-lg p-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-accent">
                  Feeder {i + 1}
                </span>
                {config.feeders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeeder(feeder.id)}
                    className="text-muted hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-muted block mb-1">
                    Jurisdiction
                  </span>
                  <Select
                    value={feeder.jurisdiction}
                    onChange={(v) =>
                      updateFeeder(feeder.id, {
                        jurisdiction: v as FeederJurisdiction,
                      })
                    }
                    options={FEEDER_JURISDICTIONS}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted block mb-1">
                    Investor Focus
                  </span>
                  <Select
                    value={feeder.investorFocus}
                    onChange={(v) =>
                      updateFeeder(feeder.id, {
                        investorFocus: v as InvestorFocus,
                      })
                    }
                    options={INVESTOR_FOCUSES}
                  />
                </div>
              </div>
              <Toggle
                checked={feeder.blockerEntity}
                onChange={(v) =>
                  updateFeeder(feeder.id, { blockerEntity: v })
                }
                label="Blocker Entity"
                description="Interpose a blocker to shield tax-exempt/non-US LPs from UBTI/ECI"
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <SectionDivider label="GP Entities" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
            General Partners
          </span>
          <button
            type="button"
            onClick={addGP}
            className="flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 transition-colors font-medium"
          >
            <Plus className="w-3 h-3" />
            Add GP
          </button>
        </div>

        {config.gps.map((gp, i) => (
          <motion.div
            key={gp.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="bg-surface border border-border rounded-lg p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gold">
                GP Entity {i + 1}
              </span>
              {config.gps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGP(gp.id)}
                  className="text-muted hover:text-danger transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-muted block mb-1">
                  Entity Type
                </span>
                <Select
                  value={gp.entityType}
                  onChange={(v) =>
                    updateGP(gp.id, {
                      entityType: v as "LLC" | "LP",
                    })
                  }
                  options={["LLC", "LP"]}
                />
              </div>
              <div>
                <span className="text-[10px] text-muted block mb-1">
                  GP Commit %
                </span>
                <NumberInput
                  value={gp.gpCommitPercent}
                  onChange={(v) =>
                    updateGP(gp.id, { gpCommitPercent: v })
                  }
                  min={0}
                  max={20}
                  step={0.5}
                  suffix="%"
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-muted block mb-1">
                Voting & Control Notes
              </span>
              <TextInput
                value={gp.votingNotes}
                onChange={(v) =>
                  updateGP(gp.id, { votingNotes: v })
                }
                placeholder="e.g. Sole voting and investment control"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <SectionDivider label="Vehicles" />

      <Toggle
        checked={config.managementCompany}
        onChange={(v) => setConfig({ managementCompany: v })}
        label="Management Company"
        description="Separate entity to collect management fees and employ staff"
      />
      <Toggle
        checked={config.carryVehicle}
        onChange={(v) => setConfig({ carryVehicle: v })}
        label="Carry Vehicle"
        description="Dedicated entity for carried interest distribution"
      />
      <Toggle
        checked={config.subscriptionLine}
        onChange={(v) => setConfig({ subscriptionLine: v })}
        label="Subscription Line"
        description="Credit facility secured by LP commitments for bridging capital calls"
      />
    </div>
  );
}

function EconomicsTab({
  config,
  setConfig,
}: {
  config: ReturnType<typeof useFundStore>["config"];
  setConfig: ReturnType<typeof useFundStore>["setConfig"];
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label sub="Annual rate charged on basis">Management Fee</Label>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <div className="text-center py-2 mb-1">
              <span className="text-2xl font-bold text-foreground font-serif">
                {formatPercent(config.managementFeePercent)}
              </span>
            </div>
            <Slider
              value={config.managementFeePercent}
              onChange={(v) => setConfig({ managementFeePercent: v })}
              min={0}
              max={3}
              step={0.1}
              formatValue={(v) => `${v}%`}
            />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-[10px] text-muted block mb-1">Fee Basis</span>
          <div className="grid grid-cols-2 gap-2">
            {(
              ["Committed Capital", "Invested Capital"] as const
            ).map((basis) => (
              <button
                key={basis}
                type="button"
                onClick={() => setConfig({ managementFeeBasis: basis })}
                className={`px-3 py-2 rounded-lg text-[11px] font-medium border transition-all duration-200 ${
                  config.managementFeeBasis === basis
                    ? "bg-accent/15 border-accent/40 text-accent"
                    : "bg-card border-border text-muted hover:text-foreground hover:border-border-hover"
                }`}
              >
                {basis}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SectionDivider />

      <div>
        <Label sub="Performance allocation to GP">Carried Interest</Label>
        <div className="text-center py-2 mb-1">
          <span className="text-2xl font-bold text-gold font-serif">
            {formatPercent(config.carryPercent)}
          </span>
        </div>
        <Slider
          value={config.carryPercent}
          onChange={(v) => setConfig({ carryPercent: v })}
          min={0}
          max={35}
          step={0.5}
          formatValue={(v) => `${v}%`}
        />
      </div>

      <div>
        <Label sub="LP preferred return before carry">Preferred Return</Label>
        <div className="text-center py-2 mb-1">
          <span className="text-2xl font-bold text-foreground font-serif">
            {formatPercent(config.preferredReturn)}
          </span>
        </div>
        <Slider
          value={config.preferredReturn}
          onChange={(v) => setConfig({ preferredReturn: v })}
          min={0}
          max={15}
          step={0.5}
          formatValue={(v) => `${v}%`}
        />
      </div>

      <SectionDivider />

      <Toggle
        checked={config.catchUp}
        onChange={(v) => setConfig({ catchUp: v })}
        label="Catch-Up Provision"
        description="GP receives disproportionate share of profits after pref return"
      />

      {config.catchUp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Label sub="% of catch-up going to GP">Catch-Up Rate</Label>
          <div className="text-center py-1 mb-1">
            <span className="text-lg font-bold text-foreground font-serif">
              {config.catchUpPercent}%
            </span>
          </div>
          <Slider
            value={config.catchUpPercent}
            onChange={(v) => setConfig({ catchUpPercent: v })}
            min={0}
            max={100}
            step={5}
            formatValue={(v) => `${v}%`}
          />
        </motion.div>
      )}

      <div>
        <Label sub="Distribution methodology">Waterfall Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {WATERFALL_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setConfig({ waterfallType: type })}
              className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                config.waterfallType === type
                  ? "bg-gold/15 border-gold/40 text-gold"
                  : "bg-card border-border text-muted hover:text-foreground hover:border-border-hover"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label sub="% of monitoring/transaction fees offset against mgmt fee">
          Fee Offsets
        </Label>
        <div className="text-center py-1 mb-1">
          <span className="text-lg font-bold text-foreground font-serif">
            {config.feeOffsets}%
          </span>
        </div>
        <Slider
          value={config.feeOffsets}
          onChange={(v) => setConfig({ feeOffsets: v })}
          min={0}
          max={100}
          step={5}
          formatValue={(v) => `${v}%`}
        />
      </div>

      <SectionDivider label="Protections" />

      <Toggle
        checked={config.keyPersonProvisions}
        onChange={(v) => setConfig({ keyPersonProvisions: v })}
        label="Key Person Provisions"
        description="Investment period suspension/termination upon departure of key persons"
      />
      {config.keyPersonProvisions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <TextInput
            value={config.keyPersonNotes}
            onChange={(v) => setConfig({ keyPersonNotes: v })}
            placeholder="Key person details (names, triggers, cure periods)..."
          />
        </motion.div>
      )}

      <Toggle
        checked={config.gpClawback}
        onChange={(v) => setConfig({ gpClawback: v })}
        label="GP Clawback"
        description="GP returns excess carry if fund underperforms over its life"
      />
      {config.gpClawback && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <TextInput
            value={config.gpClawbackNotes}
            onChange={(v) => setConfig({ gpClawbackNotes: v })}
            placeholder="Clawback mechanics (escrow %, timing, guarantees)..."
          />
        </motion.div>
      )}
    </div>
  );
}

function ComplianceTab({
  config,
  setConfig,
}: {
  config: ReturnType<typeof useFundStore>["config"];
  setConfig: ReturnType<typeof useFundStore>["setConfig"];
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label sub="Investor due diligence intensity">AML/KYC Depth</Label>
        <div className="grid grid-cols-3 gap-2">
          {AML_DEPTHS.map((depth) => (
            <button
              key={depth}
              type="button"
              onClick={() => setConfig({ amlDepth: depth })}
              className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                config.amlDepth === depth
                  ? "bg-accent/15 border-accent/40 text-accent"
                  : "bg-card border-border text-muted hover:text-foreground hover:border-border-hover"
              }`}
            >
              {depth}
            </button>
          ))}
        </div>
      </div>

      <Toggle
        checked={config.auditRequired}
        onChange={(v) => setConfig({ auditRequired: v })}
        label="Annual Audit"
        description="Annual financial statement audit by independent auditor"
      />

      <div>
        <Label sub="NAV determination methodology">Valuation Policy</Label>
        <Select
          value={config.valuationPolicy}
          onChange={(v) => setConfig({ valuationPolicy: v })}
          options={VALUATION_POLICIES}
        />
      </div>

      <Toggle
        checked={config.administrator}
        onChange={(v) => setConfig({ administrator: v })}
        label="Fund Administrator"
        description="Third-party administrator for NAV, capital calls & investor servicing"
      />

      <div>
        <Label sub="Asset safekeeping arrangement">Custody Approach</Label>
        <Select
          value={config.custodyApproach}
          onChange={(v) => setConfig({ custodyApproach: v })}
          options={CUSTODY_APPROACHES}
        />
      </div>

      <div>
        <Label sub="LP reporting frequency">Reporting Cadence</Label>
        <div className="grid grid-cols-3 gap-2">
          {REPORTING_CADENCES.map((cadence) => (
            <button
              key={cadence}
              type="button"
              onClick={() => setConfig({ reportingCadence: cadence })}
              className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                config.reportingCadence === cadence
                  ? "bg-accent/15 border-accent/40 text-accent"
                  : "bg-card border-border text-muted hover:text-foreground hover:border-border-hover"
              }`}
            >
              {cadence}
            </button>
          ))}
        </div>
      </div>

      <Toggle
        checked={config.capitalCallBestPractices}
        onChange={(v) => setConfig({ capitalCallBestPractices: v })}
        label="Capital Call Best Practices"
        description="Follow ILPA capital call & distribution notice standards"
      />
    </div>
  );
}

function DocsTab({
  config,
}: {
  config: ReturnType<typeof useFundStore>["config"];
}) {
  const docChecklist = useMemo(() => {
    const docs: { id: string; name: string; required: boolean; reason: string }[] = [
      {
        id: "lpa",
        name: "Limited Partnership Agreement (LPA)",
        required: true,
        reason: "Core governing document for the fund",
      },
      {
        id: "ppm",
        name: "Private Placement Memorandum (PPM)",
        required: true,
        reason: "Investor disclosure document required for Reg D offering",
      },
      {
        id: "sub-agreement",
        name: "Subscription Agreement",
        required: true,
        reason: "LP commitment and investor qualification",
      },
      {
        id: "investor-questionnaire",
        name: "Investor Questionnaire",
        required: true,
        reason: "Accreditation, suitability and AML/KYC data collection",
      },
      {
        id: "ddq",
        name: "Due Diligence Questionnaire (DDQ)",
        required: config.lpTypes.includes("Institutional") || config.lpTypes.includes("Sovereign"),
        reason: "Required for institutional and sovereign LP marketing",
      },
      {
        id: "side-letter",
        name: "Side Letter Template",
        required: config.sideLetters,
        reason: "Template for negotiated LP-specific terms",
      },
      {
        id: "mfn-letter",
        name: "MFN Election Letter",
        required: config.sideLetters,
        reason: "Most Favored Nation rights election for qualifying LPs",
      },
      {
        id: "mgmt-co-agreement",
        name: "Management Company Operating Agreement",
        required: config.managementCompany,
        reason: "Governs fee-collecting management company entity",
      },
      {
        id: "carry-vehicle",
        name: "Carry Vehicle Agreement",
        required: config.carryVehicle,
        reason: "Governs carried interest allocation and distribution",
      },
      {
        id: "feeder-lpa",
        name: "Feeder Fund LPA(s)",
        required: config.masterFeeder,
        reason: `${config.feeders.length} feeder fund(s) each require separate governing docs`,
      },
      {
        id: "blocker-docs",
        name: "Blocker Entity Documentation",
        required: config.feeders.some((f) => f.blockerEntity),
        reason: "Corporate documents for UBTI/ECI blocker entities",
      },
      {
        id: "sub-line",
        name: "Subscription Line Facility Agreement",
        required: config.subscriptionLine,
        reason: "Credit facility documentation secured by LP commitments",
      },
      {
        id: "admin-agreement",
        name: "Fund Administration Agreement",
        required: config.administrator,
        reason: "Engagement terms with third-party fund administrator",
      },
      {
        id: "valuation-policy",
        name: "Valuation Policy Document",
        required: true,
        reason: "Defines methodology for determining asset fair values",
      },
      {
        id: "compliance-manual",
        name: "Compliance Manual",
        required: true,
        reason: "Internal compliance policies and procedures",
      },
      {
        id: "form-d",
        name: "Form D (SEC Filing)",
        required: config.domicile === "Delaware",
        reason: "Required Regulation D notice filing with the SEC",
      },
      {
        id: "cima-registration",
        name: "CIMA Registration",
        required:
          config.domicile === "Cayman" ||
          config.feeders.some((f) => f.jurisdiction === "Cayman"),
        reason: "Cayman Islands Monetary Authority fund registration",
      },
      {
        id: "blue-sky",
        name: "Blue Sky Filings",
        required: config.domicile === "Delaware",
        reason: "State-level notice filings for Reg D offerings",
      },
      {
        id: "aml-policy",
        name: "AML/KYC Policy & Procedures",
        required: config.amlDepth !== "Light",
        reason: "Anti-money laundering compliance documentation",
      },
    ];
    return docs;
  }, [config]);

  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const requiredDocs = docChecklist.filter((d) => d.required);
  const optionalDocs = docChecklist.filter((d) => !d.required);
  const completedCount = requiredDocs.filter((d) => checked.has(d.id)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-foreground">
            Document Checklist
          </span>
          <span className="text-[10px] text-muted ml-2">
            Auto-generated from config
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted">
            {completedCount}/{requiredDocs.length}
          </span>
          <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedCount / requiredDocs.length) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
          Required
        </span>
        {requiredDocs.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => toggle(doc.id)}
            className="flex items-start gap-2.5 w-full text-left py-2 px-2 rounded-lg hover:bg-card-hover transition-colors group"
          >
            <div
              className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                checked.has(doc.id)
                  ? "bg-accent border-accent"
                  : "border-border group-hover:border-border-hover"
              }`}
            >
              {checked.has(doc.id) && (
                <Check className="w-2.5 h-2.5 text-white" />
              )}
            </div>
            <div className="min-w-0">
              <span
                className={`text-xs font-medium block transition-colors ${
                  checked.has(doc.id)
                    ? "text-muted line-through"
                    : "text-foreground/90"
                }`}
              >
                {doc.name}
              </span>
              <span className="text-[10px] text-muted leading-relaxed">
                {doc.reason}
              </span>
            </div>
          </button>
        ))}
      </div>

      {optionalDocs.length > 0 && (
        <div className="space-y-1 pt-2">
          <span className="text-[10px] uppercase tracking-widest text-muted font-semibold">
            Not Required (Current Config)
          </span>
          {optionalDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-2.5 py-2 px-2 opacity-50"
            >
              <div className="w-4 h-4 rounded border border-border/50 flex-shrink-0 mt-0.5 flex items-center justify-center">
                <X className="w-2.5 h-2.5 text-muted/50" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-muted block">{doc.name}</span>
                <span className="text-[10px] text-muted/60 leading-relaxed">
                  {doc.reason}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineTab({
  config,
  setConfig,
}: {
  config: ReturnType<typeof useFundStore>["config"];
  setConfig: ReturnType<typeof useFundStore>["setConfig"];
}) {
  const timelinePhases = useMemo(() => {
    const speedMultiplier: Record<LaunchSpeed, number> = {
      Fast: 0.6,
      Standard: 1,
      Institutional: 1.5,
    };
    const mult = speedMultiplier[config.launchSpeed];

    return [
      {
        phase: "Strategy & Structuring",
        baseWeeks: 3,
        icon: Settings,
        color: "accent",
      },
      {
        phase: "Documentation & Legal",
        baseWeeks: 6,
        icon: FileText,
        color: "gold",
      },
      {
        phase: "Fundraising & Marketing",
        baseWeeks: 12,
        icon: Users,
        color: "accent",
      },
      {
        phase: "Operations Setup",
        baseWeeks: 5,
        icon: ShieldCheck,
        color: "gold",
      },
      {
        phase: "Capital Deployment",
        baseWeeks: 0,
        icon: TrendingUp,
        color: "success",
      },
    ].map((p) => ({
      ...p,
      weeks: p.baseWeeks > 0 ? Math.round(p.baseWeeks * mult) : 0,
    }));
  }, [config.launchSpeed]);

  const totalWeeks = timelinePhases.reduce((s, p) => s + p.weeks, 0);

  return (
    <div className="space-y-5">
      <div>
        <Label sub="Affects phase durations and resource intensity">
          Launch Speed
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {LAUNCH_SPEEDS.map((speed) => {
            const labels: Record<LaunchSpeed, string> = {
              Fast: "Accelerated",
              Standard: "Standard",
              Institutional: "Full Institutional",
            };
            const subs: Record<LaunchSpeed, string> = {
              Fast: "~16 weeks",
              Standard: "~26 weeks",
              Institutional: "~39 weeks",
            };
            return (
              <button
                key={speed}
                type="button"
                onClick={() => setConfig({ launchSpeed: speed })}
                className={`px-3 py-3 rounded-lg text-center border transition-all duration-200 ${
                  config.launchSpeed === speed
                    ? "bg-accent/15 border-accent/40"
                    : "bg-card border-border hover:border-border-hover"
                }`}
              >
                <span
                  className={`block text-xs font-semibold ${
                    config.launchSpeed === speed ? "text-accent" : "text-foreground/80"
                  }`}
                >
                  {labels[speed]}
                </span>
                <span className="block text-[10px] text-muted mt-0.5">
                  {subs[speed]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <SectionDivider label="Recommended Timeline" />

      <div className="space-y-3">
        {timelinePhases.map((phase, i) => {
          const Icon = phase.icon;
          const colorClasses: Record<string, string> = {
            accent: "text-accent bg-accent/10 border-accent/20",
            gold: "text-gold bg-gold/10 border-gold/20",
            success: "text-success bg-success/10 border-success/20",
          };
          return (
            <div key={phase.phase} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorClasses[phase.color]}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground/90 truncate">
                    {phase.phase}
                  </span>
                  <span className="text-[11px] font-semibold text-foreground ml-2 flex-shrink-0">
                    {phase.weeks > 0 ? `${phase.weeks} wks` : "Ongoing"}
                  </span>
                </div>
                {phase.weeks > 0 && (
                  <div className="w-full h-1.5 bg-border rounded-full mt-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        phase.color === "gold"
                          ? "bg-gold/60"
                          : phase.color === "success"
                          ? "bg-success/60"
                          : "bg-accent/60"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(phase.weeks / (totalWeeks || 1)) * 100}%`,
                      }}
                      transition={{
                        delay: i * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted">
            Estimated total to first deployment
          </span>
          <span className="text-sm font-bold text-accent">
            ~{totalWeeks} weeks
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Issues & Drafting Notes Generator                                          */
/* -------------------------------------------------------------------------- */

function useIssuesAndNotes(config: ReturnType<typeof useFundStore>["config"]) {
  return useMemo(() => {
    const issues: {
      id: string;
      severity: "warning" | "info" | "success";
      title: string;
      detail: string;
    }[] = [];

    // Structure-related issues
    if (config.masterFeeder && config.feeders.length === 1) {
      issues.push({
        id: "single-feeder",
        severity: "warning",
        title: "Single Feeder in Master-Feeder",
        detail:
          "Master-feeder structure is enabled but only one feeder exists. Consider whether a standalone fund would be simpler and more cost-effective, or add additional feeders to justify the complexity.",
      });
    }

    if (config.masterFeeder && config.feeders.length > 3) {
      issues.push({
        id: "many-feeders",
        severity: "info",
        title: "Multiple Feeder Complexity",
        detail: `${config.feeders.length} feeders will require separate governing documents, regulatory filings, and ongoing compliance for each jurisdiction. Budget for additional legal costs of $100K-200K per feeder.`,
      });
    }

    if (config.feeders.some((f) => f.blockerEntity)) {
      const blockerCount = config.feeders.filter((f) => f.blockerEntity).length;
      issues.push({
        id: "blocker-entities",
        severity: "info",
        title: `${blockerCount} Blocker ${blockerCount > 1 ? "Entities" : "Entity"} Required`,
        detail:
          "Blocker entities must be formed as separate corporations (typically Delaware C-Corps) to shield tax-exempt and non-US LPs from UBTI and ECI. Ensure counsel addresses check-the-box elections and treaty benefits.",
      });
    }

    // Domicile-specific
    if (config.domicile === "Cayman") {
      issues.push({
        id: "cayman-cima",
        severity: "info",
        title: "CIMA Registration Required",
        detail:
          "Cayman-domiciled funds require registration with CIMA. Budget 4-6 weeks for registration and ensure ongoing compliance with Anti-Money Laundering Regulations and the Securities Investment Business Act.",
      });
    }

    if (config.domicile === "Luxembourg") {
      issues.push({
        id: "lux-aifmd",
        severity: "warning",
        title: "AIFMD Compliance",
        detail:
          "Luxembourg fund vehicles are subject to AIFMD. Consider whether RAIF, SIF, or SICAR is most appropriate. Engage Luxembourg counsel early for regulatory structuring and CSSF interaction.",
      });
    }

    if (config.domicile === "Custom") {
      issues.push({
        id: "custom-domicile",
        severity: "warning",
        title: "Custom Domicile Selected",
        detail:
          "Ensure local counsel is engaged to advise on regulatory requirements, tax implications, and any restrictions on fund marketing in the selected jurisdiction.",
      });
    }

    // Economics
    if (config.managementFeePercent > 2) {
      issues.push({
        id: "high-mgmt-fee",
        severity: "warning",
        title: "Above-Market Management Fee",
        detail: `Management fee of ${formatPercent(config.managementFeePercent)} exceeds the institutional norm of 1.5-2.0%. Institutional LPs may push back during diligence. Consider fee step-downs after the investment period.`,
      });
    }

    if (config.carryPercent > 25) {
      issues.push({
        id: "high-carry",
        severity: "warning",
        title: "Above-Market Carried Interest",
        detail: `Carry of ${formatPercent(config.carryPercent)} exceeds the standard 20%. Document the justification (e.g., track record, niche strategy) in the PPM. Consider tiered carry based on performance hurdles.`,
      });
    }

    if (config.preferredReturn === 0) {
      issues.push({
        id: "no-pref",
        severity: "warning",
        title: "No Preferred Return",
        detail:
          "ILPA best practices recommend a preferred return of 7-8%. Operating without a preferred return may deter institutional LPs and requires clear disclosure in the PPM.",
      });
    }

    if (config.waterfallType === "Deal-by-Deal" && !config.gpClawback) {
      issues.push({
        id: "dbd-no-clawback",
        severity: "warning",
        title: "Deal-by-Deal Without GP Clawback",
        detail:
          "A deal-by-deal waterfall without GP clawback creates significant LP risk. Strongly recommend adding a clawback provision with escrow mechanism. This will be a major LP negotiation point.",
      });
    }

    if (config.feeOffsets < 80) {
      issues.push({
        id: "low-fee-offset",
        severity: "info",
        title: "Below-Standard Fee Offset",
        detail: `Fee offset of ${config.feeOffsets}% is below the ILPA-recommended 80-100%. Institutional LPs may request higher offsets during side letter negotiations.`,
      });
    }

    // GP commitment
    const totalGPCommit = config.gps.reduce((s, g) => s + g.gpCommitPercent, 0);
    if (totalGPCommit < 1) {
      issues.push({
        id: "low-gp-commit",
        severity: "warning",
        title: "Low GP Commitment",
        detail: `Total GP commitment of ${totalGPCommit}% is below the typical 1-3% range. Institutional LPs view meaningful GP commitment as essential alignment. Consider increasing to at least 1-2%.`,
      });
    }

    // Compliance
    if (config.lpTypes.includes("Institutional") && config.amlDepth === "Light") {
      issues.push({
        id: "light-aml-institutional",
        severity: "warning",
        title: "AML/KYC Too Light for Institutional",
        detail:
          "Light AML/KYC depth is insufficient for institutional LP requirements. Institutional investors will expect Standard or Institutional-grade due diligence procedures.",
      });
    }

    if (!config.administrator && config.targetSize >= 500_000_000) {
      issues.push({
        id: "no-admin-large",
        severity: "warning",
        title: "No Administrator for Large Fund",
        detail: `A fund targeting ${formatCurrency(config.targetSize, true)} without a third-party administrator may face institutional LP pushback. Consider engaging an administrator for independent NAV and investor servicing.`,
      });
    }

    if (!config.auditRequired) {
      issues.push({
        id: "no-audit",
        severity: "warning",
        title: "No Annual Audit",
        detail:
          "Most institutional LPs require annual audited financial statements. Disabling audit will significantly narrow the potential LP universe.",
      });
    }

    // Investor-related
    if (config.lpTypes.includes("Sovereign") && config.amlDepth !== "Institutional") {
      issues.push({
        id: "sovereign-aml",
        severity: "info",
        title: "Sovereign LP AML Considerations",
        detail:
          "Sovereign wealth funds typically require enhanced due diligence including OFAC screening, beneficial ownership verification, and PEP checks. Consider upgrading AML depth to Institutional.",
      });
    }

    if (config.targetLPCount > 99 && config.domicile === "Delaware") {
      issues.push({
        id: "lp-count-reg",
        severity: "warning",
        title: "LP Count Near Regulatory Threshold",
        detail:
          "With 100+ LPs, the fund may trigger Investment Company Act registration requirements. Ensure reliance on Section 3(c)(7) (qualified purchasers) rather than 3(c)(1) (100 beneficial owner limit).",
      });
    }

    // Key person
    if (config.keyPersonProvisions && !config.keyPersonNotes) {
      issues.push({
        id: "key-person-no-detail",
        severity: "info",
        title: "Key Person Details Needed",
        detail:
          "Key person provisions are enabled but no details specified. Draft should include: named key persons, departure triggers, cure period, and consequences (suspension vs. termination of investment period).",
      });
    }

    // Subscription line
    if (config.subscriptionLine) {
      issues.push({
        id: "sub-line-disclosure",
        severity: "info",
        title: "Subscription Line Disclosure",
        detail:
          "ILPA recommends full disclosure of subscription line usage including impact on IRR calculations. Ensure PPM and quarterly reports address levered vs. unlevered returns.",
      });
    }

    // Positive validations
    if (
      config.gpClawback &&
      config.catchUp &&
      config.preferredReturn >= 7 &&
      config.feeOffsets >= 80
    ) {
      issues.push({
        id: "ilpa-aligned",
        severity: "success",
        title: "ILPA-Aligned Economics",
        detail:
          "Fund economics align with ILPA Principles 3.0 best practices. This will be well-received by institutional LPs during diligence.",
      });
    }

    if (config.administrator && config.auditRequired && config.capitalCallBestPractices) {
      issues.push({
        id: "ops-solid",
        severity: "success",
        title: "Strong Operational Infrastructure",
        detail:
          "Third-party administrator, annual audit, and ILPA capital call best practices create a robust operational framework. This demonstrates institutional-quality governance.",
      });
    }

    return issues;
  }, [config]);
}

/* -------------------------------------------------------------------------- */
/*  Main Page Component                                                        */
/* -------------------------------------------------------------------------- */

export default function BuilderPage() {
  const {
    config,
    loaded,
    setConfig,
    addFeeder,
    removeFeeder,
    updateFeeder,
    addGP,
    removeGP,
    updateGP,
  } = useFundStore();

  const [activeTab, setActiveTab] = useState<TabId>("basics");
  const issues = useIssuesAndNotes(config);

  /* LP Workflow Data */
  const lpWorkflow = useMemo(() => {
    const steps = [
      {
        label: "Marketing & Outreach",
        detail: `Target ${config.targetLPCount} LPs across ${config.lpTypes.length} investor categories`,
        done: false,
      },
      {
        label: "Diligence & DDQ",
        detail: config.lpTypes.includes("Institutional")
          ? "Institutional DDQ + data room required"
          : "Standard DDQ package",
        done: false,
      },
      {
        label: "Subscription & KYC",
        detail: `${config.amlDepth} AML/KYC depth, min ${formatCurrency(config.minCommitment, true)} commitment`,
        done: false,
      },
      {
        label: config.closingMethod === "Rolling Close" ? "Rolling Closings" : "First Close",
        detail:
          config.closingMethod === "Rolling Close"
            ? "Continuous acceptance of subscriptions"
            : "Initial close followed by subsequent closes",
        done: false,
      },
      {
        label: "Side Letter Negotiation",
        detail: config.sideLetters
          ? "Side letters enabled with MFN provisions"
          : "No side letter program",
        done: false,
      },
      {
        label: "Capital Call & Deployment",
        detail: config.subscriptionLine
          ? "Subscription line available for bridging"
          : "Direct capital calls to LPs",
        done: false,
      },
    ];
    return steps;
  }, [config]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const strategyColors: Record<Strategy, string> = {
    "Distressed Real Estate": "bg-orange-500/15 text-orange-400 border-orange-500/30",
    Credit: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Buyout: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    "Venture Capital": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Secondaries: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    Infrastructure: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Header Bar ---- */}
      <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
              <Layers className="w-3 h-3 text-accent" />
            </div>
            <h1 className="text-sm font-semibold text-foreground truncate">
              {config.fundName || "Untitled Fund"}
            </h1>
            <span
              className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                strategyColors[config.strategy]
              }`}
            >
              {config.strategy}
            </span>
            <span className="hidden md:inline text-[10px] text-muted">
              {formatCurrency(config.targetSize, true)} &middot; {config.domicile}{" "}
              &middot; {config.fundTerm}yr
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-muted
                border border-border hover:border-border-hover hover:text-foreground transition-colors"
            >
              <Share2 className="w-3 h-3" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---- Main Split Pane ---- */}
      <div className="mx-auto max-w-[1600px] px-4 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ======== LEFT PANEL: Inputs ======== */}
          <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0">
            <div className="sticky top-[6.5rem]">
              {/* Tab Bar */}
              <div className="flex items-center gap-0.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium
                        transition-colors whitespace-nowrap flex-shrink-0 ${
                          isActive
                            ? "text-foreground"
                            : "text-muted hover:text-foreground"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="builder-tab-active"
                          className="absolute inset-0 bg-card border border-border rounded-lg"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        <Icon className="w-3 h-3" />
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="bg-card border border-border rounded-xl p-4 sm:p-5 min-h-[320px] sm:min-h-[500px] overflow-y-auto max-h-[calc(100vh-10rem)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeTab === "basics" && (
                      <BasicsTab config={config} setConfig={setConfig} />
                    )}
                    {activeTab === "investors" && (
                      <InvestorsTab config={config} setConfig={setConfig} />
                    )}
                    {activeTab === "structure" && (
                      <StructureTab
                        config={config}
                        setConfig={setConfig}
                        addFeeder={addFeeder}
                        removeFeeder={removeFeeder}
                        updateFeeder={updateFeeder}
                        addGP={addGP}
                        removeGP={removeGP}
                        updateGP={updateGP}
                      />
                    )}
                    {activeTab === "economics" && (
                      <EconomicsTab config={config} setConfig={setConfig} />
                    )}
                    {activeTab === "compliance" && (
                      <ComplianceTab config={config} setConfig={setConfig} />
                    )}
                    {activeTab === "docs" && <DocsTab config={config} />}
                    {activeTab === "timeline" && (
                      <TimelineTab config={config} setConfig={setConfig} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ======== RIGHT PANEL: Outputs ======== */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Structure Diagram Placeholder */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="w-3.5 h-3.5 text-accent" />
                  <h2 className="text-xs font-semibold text-foreground">
                    Structure Diagram
                  </h2>
                </div>
                <span className="text-[10px] text-muted">
                  {config.masterFeeder ? "Master-Feeder" : "Standalone"} &middot;{" "}
                  {config.domicile}
                </span>
              </div>
              <div id="diagram-container">
                <StructureDiagram config={config} />
              </div>
            </div>

            {/* Executive Summary Cards */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CircleDot className="w-3.5 h-3.5 text-accent" />
                <h2 className="text-xs font-semibold text-foreground">
                  Executive Summary
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SnapshotCard
                  title="Fund Snapshot"
                  icon={Building2}
                  accentColor="accent"
                  items={[
                    { label: "Strategy", value: config.strategy },
                    {
                      label: "Target Size",
                      value: formatCurrency(config.targetSize, true),
                      highlight: true,
                    },
                    { label: "Term", value: `${config.fundTerm} years` },
                    { label: "Domicile", value: config.domicile },
                    {
                      label: "Structure",
                      value: config.masterFeeder
                        ? `Master + ${config.feeders.length} Feeder(s)`
                        : "Standalone",
                    },
                    { label: "Currency", value: config.currency },
                  ]}
                />
                <SnapshotCard
                  title="Economics Snapshot"
                  icon={DollarSign}
                  accentColor="gold"
                  items={[
                    {
                      label: "Mgmt Fee",
                      value: `${formatPercent(config.managementFeePercent)} on ${config.managementFeeBasis === "Committed Capital" ? "CC" : "IC"}`,
                    },
                    {
                      label: "Carry",
                      value: formatPercent(config.carryPercent),
                      highlight: true,
                    },
                    {
                      label: "Pref Return",
                      value: formatPercent(config.preferredReturn),
                    },
                    {
                      label: "Catch-Up",
                      value: config.catchUp
                        ? `${config.catchUpPercent}%`
                        : "None",
                    },
                    { label: "Waterfall", value: config.waterfallType },
                    {
                      label: "Fee Offset",
                      value: `${config.feeOffsets}%`,
                    },
                  ]}
                />
                <SnapshotCard
                  title="Ops & Compliance"
                  icon={Scale}
                  accentColor="success"
                  items={[
                    { label: "AML/KYC", value: config.amlDepth },
                    {
                      label: "Audit",
                      value: config.auditRequired ? "Required" : "Optional",
                    },
                    {
                      label: "Administrator",
                      value: config.administrator ? "Yes" : "No",
                    },
                    { label: "Reporting", value: config.reportingCadence },
                    {
                      label: "Key Person",
                      value: config.keyPersonProvisions ? "Yes" : "No",
                    },
                    {
                      label: "GP Clawback",
                      value: config.gpClawback ? "Yes" : "No",
                    },
                  ]}
                />
              </div>
            </div>

            {/* Issues & Drafting Notes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-gold" />
                  <h2 className="text-xs font-semibold text-foreground">
                    Issues & Drafting Notes
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="flex items-center gap-1 text-danger">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                    {issues.filter((i) => i.severity === "warning").length} warnings
                  </span>
                  <span className="flex items-center gap-1 text-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {issues.filter((i) => i.severity === "info").length} notes
                  </span>
                  <span className="flex items-center gap-1 text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    {issues.filter((i) => i.severity === "success").length} passed
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {issues.map((issue) => {
                  const severityConfig = {
                    warning: {
                      icon: AlertTriangle,
                      border: "border-l-danger/60",
                      bg: "bg-danger/5",
                      iconColor: "text-danger",
                      badge: "bg-danger/15 text-danger",
                    },
                    info: {
                      icon: Info,
                      border: "border-l-accent/60",
                      bg: "bg-accent/5",
                      iconColor: "text-accent",
                      badge: "bg-accent/15 text-accent",
                    },
                    success: {
                      icon: CheckCircle2,
                      border: "border-l-success/60",
                      bg: "bg-success/5",
                      iconColor: "text-success",
                      badge: "bg-success/15 text-success",
                    },
                  };
                  const sc = severityConfig[issue.severity];
                  const Icon = sc.icon;

                  return (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border border-border ${sc.border} border-l-2 rounded-lg p-3 ${sc.bg}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <Icon
                          className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${sc.iconColor}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-foreground">
                              {issue.title}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${sc.badge}`}
                            >
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted leading-relaxed">
                            {issue.detail}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {issues.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-8 h-8 text-success/40 mx-auto mb-2" />
                    <p className="text-xs text-muted">
                      No issues detected. Configuration looks clean.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* LP Workflow */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <h2 className="text-xs font-semibold text-foreground">
                  LP Workflow
                </h2>
                <span className="text-[10px] text-muted">
                  Capital raising pipeline
                </span>
              </div>

              <div className="bg-card border border-border rounded-xl p-4">
                <div className="space-y-0">
                  {lpWorkflow.map((step, i) => (
                    <div key={step.label} className="flex gap-3">
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            i === 0
                              ? "border-accent bg-accent/20"
                              : "border-border bg-card"
                          }`}
                        >
                          <span
                            className={`text-[9px] font-bold ${
                              i === 0 ? "text-accent" : "text-muted"
                            }`}
                          >
                            {i + 1}
                          </span>
                        </div>
                        {i < lpWorkflow.length - 1 && (
                          <div className="w-px h-full min-h-[28px] bg-border" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-4 min-w-0">
                        <span className="text-xs font-semibold text-foreground/90 block">
                          {step.label}
                        </span>
                        <span className="text-[10px] text-muted leading-relaxed block mt-0.5">
                          {step.detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
