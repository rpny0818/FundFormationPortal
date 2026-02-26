export type Strategy =
  | "Distressed Real Estate"
  | "Credit"
  | "Buyout"
  | "Venture Capital"
  | "Secondaries"
  | "Infrastructure";

export type Domicile = "Delaware" | "Cayman" | "Luxembourg" | "Ireland" | "Custom";

export type FeederJurisdiction =
  | "Cayman"
  | "Luxembourg"
  | "Delaware"
  | "Abu Dhabi (ADGM)"
  | "Dubai (DIFC)"
  | "Singapore"
  | "Other";

export type InvestorFocus = "US Taxable" | "US Tax-Exempt" | "Non-US" | "Mixed";

export type WaterfallType = "Whole Fund" | "Deal-by-Deal";

export type AMLDepth = "Light" | "Standard" | "Institutional";

export type LaunchSpeed = "Fast" | "Standard" | "Institutional";

export type ScenarioType = "Lean" | "Standard" | "Institutional";

export interface Feeder {
  id: string;
  jurisdiction: FeederJurisdiction;
  investorFocus: InvestorFocus;
  blockerEntity: boolean;
}

export interface GPEntity {
  id: string;
  entityType: "LLC" | "LP";
  gpCommitPercent: number;
  votingNotes: string;
}

export interface FundConfig {
  // Basics
  fundName: string;
  strategy: Strategy;
  targetSize: number;
  fundTerm: number;
  currency: string;
  domicile: Domicile;

  // Investors
  lpTypes: string[];
  minCommitment: number;
  targetLPCount: number;
  closingMethod: "Rolling Close" | "First Close / Final Close";
  sideLetters: boolean;

  // Structure
  masterFeeder: boolean;
  feeders: Feeder[];
  gps: GPEntity[];
  managementCompany: boolean;
  carryVehicle: boolean;
  subscriptionLine: boolean;

  // Economics
  managementFeePercent: number;
  managementFeeBasis: "Committed Capital" | "Invested Capital";
  carryPercent: number;
  preferredReturn: number;
  catchUp: boolean;
  catchUpPercent: number;
  waterfallType: WaterfallType;
  feeOffsets: number;
  keyPersonProvisions: boolean;
  keyPersonNotes: string;
  gpClawback: boolean;
  gpClawbackNotes: string;

  // Compliance
  amlDepth: AMLDepth;
  auditRequired: boolean;
  valuationPolicy: string;
  administrator: boolean;
  custodyApproach: string;
  reportingCadence: "Quarterly" | "Semi-Annual" | "Annual";
  capitalCallBestPractices: boolean;

  // Timeline
  launchSpeed: LaunchSpeed;
}

export interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  lean: number;
  standard: number;
  institutional: number;
}

export interface Resource {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  url: string;
  type: "PDF" | "Portal" | "Guide";
  slides?: string[];
}

export interface PlaybookPhase {
  id: string;
  phase: number;
  title: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
  keyDecisions: string[];
  description: string;
}
