"use client";

import { useEffect, useCallback, memo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FundConfig } from "@/data/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Building2,
  Landmark,
  Shield,
  Briefcase,
  CreditCard,
  GitFork,
  Ban,
  Pencil,
  Plus,
  Trash2,
  X,
  RotateCcw,
  Layers,
  Network,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface StructureDiagramProps {
  config: FundConfig;
  onNodeEdit?: (nodeId: string, label: string, subtitle: string) => void;
}

interface CustomNodeData {
  label: string;
  subtitle?: string;
  icon: string;
  accentColor?: string;
  bgColor?: string;
  handles?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  [key: string]: unknown;
}

type DiagramNode = Node<CustomNodeData>;

/* -------------------------------------------------------------------------- */
/*  Icon map                                                                  */
/* -------------------------------------------------------------------------- */

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  building: Building2,
  landmark: Landmark,
  shield: Shield,
  briefcase: Briefcase,
  creditCard: CreditCard,
  gitFork: GitFork,
  ban: Ban,
  layers: Layers,
};

/* -------------------------------------------------------------------------- */
/*  Custom Node Component                                                     */
/* -------------------------------------------------------------------------- */

const FundNode = memo(({ data }: { data: CustomNodeData }) => {
  const Icon = iconMap[data.icon] || Building2;
  const accent = data.accentColor || "#4b8df8";
  const bgColor = data.bgColor || "#111218";
  const handles = data.handles || {
    top: true,
    bottom: true,
    left: false,
    right: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group"
      style={{
        background: bgColor,
        border: `1px solid ${accent}45`,
        borderRadius: 14,
        padding: "16px 22px",
        minWidth: 185,
        cursor: "pointer",
        transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
        boxShadow: `0 2px 16px ${accent}12`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = `${accent}85`;
        el.style.boxShadow = `0 4px 30px ${accent}28, 0 0 60px ${accent}10`;
        el.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = `${accent}45`;
        el.style.boxShadow = `0 2px 16px ${accent}12`;
        el.style.transform = "translateY(0)";
      }}
    >
      {handles.top && (
        <Handle type="target" position={Position.Top}
          style={{ background: accent, border: "2px solid #111218", width: 9, height: 9 }} />
      )}
      {handles.bottom && (
        <Handle type="source" position={Position.Bottom}
          style={{ background: accent, border: "2px solid #111218", width: 9, height: 9 }} />
      )}
      {handles.left && (
        <Handle type="target" position={Position.Left} id="left"
          style={{ background: accent, border: "2px solid #111218", width: 9, height: 9 }} />
      )}
      {handles.right && (
        <Handle type="source" position={Position.Right} id="right"
          style={{ background: accent, border: "2px solid #111218", width: 9, height: 9 }} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${accent}18`, border: `1px solid ${accent}30`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          {/* @ts-expect-error dynamic icon component */}
          <Icon size={17} color={accent} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            color: "#eaeaef", fontSize: 13, fontWeight: 600, lineHeight: 1.35,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {data.label}
          </div>
          {data.subtitle && (
            <div style={{
              color: "#7a7fa8", fontSize: 11, fontWeight: 400, lineHeight: 1.35,
              marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {data.subtitle}
            </div>
          )}
        </div>
        <Pencil size={12} color="#7a7fa8" style={{ flexShrink: 0, opacity: 0.4 }} />
      </div>
    </motion.div>
  );
});

FundNode.displayName = "FundNode";

const nodeTypes = { fundNode: FundNode };

/* -------------------------------------------------------------------------- */
/*  Layout constants                                                          */
/* -------------------------------------------------------------------------- */

const NODE_W = 200;
const ROW_GAP = 135;
const COL_GAP = 270;

/* -------------------------------------------------------------------------- */
/*  Edge factory                                                              */
/* -------------------------------------------------------------------------- */

function mkEdge(src: string, tgt: string, srcH?: string, tgtH?: string): Edge {
  return {
    id: `e-${src}-${tgt}`,
    source: src, target: tgt,
    sourceHandle: srcH || undefined, targetHandle: tgtH || undefined,
    animated: true,
    style: { stroke: "#4b8df8", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4b8df8", width: 16, height: 16 },
  };
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function fmtCur(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value}`;
}

/* -------------------------------------------------------------------------- */
/*  VIEW 1 — Vale Law Master-Feeder Layout                                   */
/*  This is the clean "advisory-style" layout:                                */
/*  Onshore LPs → Onshore Feeder ┐                                          */
/*                                ├→ Master Fund → Vintage 1..N             */
/*  Offshore LPs → Offshore Feeder┘     ↑ GP                               */
/* -------------------------------------------------------------------------- */

function buildView1(config: FundConfig): { nodes: DiagramNode[]; edges: Edge[] } {
  const nodes: DiagramNode[] = [];
  const edges: Edge[] = [];

  const cx = 320;

  // Row 0: Investor groups
  nodes.push({
    id: "us-taxable-lps",
    type: "fundNode",
    position: { x: cx - COL_GAP, y: 0 },
    data: {
      label: "US Taxable Investors",
      subtitle: "Onshore LPs",
      icon: "users", accentColor: "#a78bfa", bgColor: "#16132a",
      handles: { top: false, bottom: true, left: false, right: false },
    },
  });

  nodes.push({
    id: "non-us-lps",
    type: "fundNode",
    position: { x: cx + COL_GAP, y: 0 },
    data: {
      label: "Non-US & Tax-Exempt",
      subtitle: "Offshore / Exempt LPs",
      icon: "users", accentColor: "#60a5fa", bgColor: "#101828",
      handles: { top: false, bottom: true, left: false, right: false },
    },
  });

  // Row 1: Feeders
  nodes.push({
    id: "onshore-feeder",
    type: "fundNode",
    position: { x: cx - COL_GAP, y: ROW_GAP },
    data: {
      label: "Onshore Feeder",
      subtitle: `${config.domicile} LP`,
      icon: "gitFork", accentColor: "#34d67a", bgColor: "#0f1a14",
      handles: { top: true, bottom: true, left: false, right: false },
    },
  });

  nodes.push({
    id: "offshore-feeder",
    type: "fundNode",
    position: { x: cx + COL_GAP, y: ROW_GAP },
    data: {
      label: "Offshore Feeder",
      subtitle: "Cayman Islands LP",
      icon: "gitFork", accentColor: "#4b8df8", bgColor: "#101828",
      handles: { top: true, bottom: true, left: false, right: false },
    },
  });

  edges.push(mkEdge("us-taxable-lps", "onshore-feeder"));
  edges.push(mkEdge("non-us-lps", "offshore-feeder"));

  // Row 2: Master Fund (center)
  nodes.push({
    id: "master-fund",
    type: "fundNode",
    position: { x: cx, y: ROW_GAP * 2 },
    data: {
      label: config.fundName || "Master Fund",
      subtitle: `${config.domicile} | ${fmtCur(config.targetSize)} Target`,
      icon: "landmark", accentColor: "#4b8df8", bgColor: "#0c1225",
      handles: { top: true, bottom: true, left: false, right: true },
    },
  });

  edges.push(mkEdge("onshore-feeder", "master-fund"));
  edges.push(mkEdge("offshore-feeder", "master-fund"));

  // GP Entity (right of master fund)
  const gp = config.gps[0];
  nodes.push({
    id: "gp-entity",
    type: "fundNode",
    position: { x: cx + COL_GAP + 80, y: ROW_GAP * 2 },
    data: {
      label: "Investment Manager / GP",
      subtitle: gp ? `${gp.gpCommitPercent}% commit | ${fmtCur(config.targetSize * gp.gpCommitPercent / 100)}` : "General Partner",
      icon: "briefcase", accentColor: "#34d67a", bgColor: "#0f1a14",
      handles: { top: false, bottom: false, left: true, right: false },
    },
  });

  edges.push(mkEdge("master-fund", "gp-entity", "right", "left"));

  // Row 3: Assets / Vintages
  const vintageCount = Math.max(3, Math.min(6, Math.ceil(config.targetSize / 300_000_000)));
  const vintageStartX = cx - ((vintageCount - 1) * (NODE_W + 30)) / 2;

  for (let i = 0; i < vintageCount; i++) {
    const vid = `vintage-${i + 1}`;
    nodes.push({
      id: vid,
      type: "fundNode",
      position: { x: vintageStartX + i * (NODE_W + 30), y: ROW_GAP * 3 + 10 },
      data: {
        label: `Vintage ${i + 1}`,
        subtitle: `~${fmtCur(config.targetSize / vintageCount)}`,
        icon: "layers", accentColor: "#d4ae4f", bgColor: "#18160f",
        handles: { top: true, bottom: false, left: false, right: false },
      },
    });
    edges.push(mkEdge("master-fund", vid));
  }

  return { nodes, edges };
}

/* -------------------------------------------------------------------------- */
/*  VIEW 2 — Config-Driven Layout (original)                                 */
/* -------------------------------------------------------------------------- */

function buildView2(config: FundConfig): { nodes: DiagramNode[]; edges: Edge[] } {
  const nodes: DiagramNode[] = [];
  const edges: Edge[] = [];

  const feederCount = config.masterFeeder ? config.feeders.length : 0;
  const columnsNeeded = Math.max(feederCount, 1);
  const totalFeederWidth = columnsNeeded * COL_GAP;
  const cx = totalFeederWidth / 2 - NODE_W / 2;

  let row = 0;

  // LPs
  const lpId = "lp-aggregate";
  nodes.push({
    id: lpId, type: "fundNode",
    position: { x: cx, y: row * ROW_GAP },
    data: {
      label: "Limited Partners",
      subtitle: `${config.targetLPCount} LPs | Min ${fmtCur(config.minCommitment)}`,
      icon: "users", accentColor: "#a78bfa", bgColor: "#16132a",
      handles: { top: false, bottom: true, left: false, right: false },
    },
  });
  row++;

  // Feeders
  if (config.masterFeeder && config.feeders.length > 0) {
    const sx = cx - ((config.feeders.length - 1) * COL_GAP) / 2;
    config.feeders.forEach((f, idx) => {
      const fid = `feeder-${f.id}`;
      const fx = sx + idx * COL_GAP;
      const fy = row * ROW_GAP;
      nodes.push({
        id: fid, type: "fundNode",
        position: { x: fx, y: fy },
        data: {
          label: `${f.jurisdiction} Feeder`,
          subtitle: f.investorFocus,
          icon: "gitFork", accentColor: "#60a5fa", bgColor: "#101828",
          handles: { top: true, bottom: true, left: false, right: false },
        },
      });
      edges.push(mkEdge(lpId, fid));
      if (f.blockerEntity) {
        const bid = `blocker-${f.id}`;
        nodes.push({
          id: bid, type: "fundNode",
          position: { x: fx + COL_GAP * 0.7, y: fy },
          data: {
            label: "Blocker Entity",
            subtitle: `${f.jurisdiction} Corp`,
            icon: "ban", accentColor: "#fbbf24", bgColor: "#1a1710",
            handles: { top: false, bottom: true, left: true, right: false },
          },
        });
        edges.push(mkEdge(fid, bid, "right", "left"));
      }
    });
    row++;
  }

  // Master Fund
  const fundId = "master-fund";
  const fundY = row * ROW_GAP;
  nodes.push({
    id: fundId, type: "fundNode",
    position: { x: cx, y: fundY },
    data: {
      label: config.masterFeeder ? (config.fundName || "Master Fund") : (config.fundName || "Fund"),
      subtitle: `${config.domicile} | ${config.strategy} | ${fmtCur(config.targetSize)}`,
      icon: "landmark", accentColor: "#4b8df8", bgColor: "#0c1225",
      handles: { top: true, bottom: true, left: false, right: true },
    },
  });

  if (config.masterFeeder && config.feeders.length > 0) {
    config.feeders.forEach((f) => {
      edges.push(mkEdge(`feeder-${f.id}`, fundId));
      if (f.blockerEntity) edges.push(mkEdge(`blocker-${f.id}`, fundId));
    });
  } else {
    edges.push(mkEdge(lpId, fundId));
  }

  // GPs
  const gpSX = cx + COL_GAP + 60;
  const gpSY = fundY - ((config.gps.length - 1) * 95) / 2;
  config.gps.forEach((gp, idx) => {
    const gpId = `gp-${gp.id}`;
    nodes.push({
      id: gpId, type: "fundNode",
      position: { x: gpSX, y: gpSY + idx * 95 },
      data: {
        label: `GP Entity (${gp.entityType})`,
        subtitle: `${gp.gpCommitPercent}% commit | ${fmtCur(config.targetSize * gp.gpCommitPercent / 100)}`,
        icon: "briefcase", accentColor: "#34d67a", bgColor: "#0f1a14",
        handles: { top: false, bottom: false, left: true, right: false },
      },
    });
    edges.push(mkEdge(fundId, gpId, "right", "left"));
  });
  row++;

  // Support entities
  const support = [
    { show: config.managementCompany, id: "mgmt-co", label: "Management Company",
      subtitle: `${config.managementFeePercent}% fee | ${fmtCur(config.targetSize * config.managementFeePercent / 100)}/yr`,
      icon: "building", accent: "#818cf8", bg: "#131428" },
    { show: config.carryVehicle, id: "carry-vehicle", label: "Carry Vehicle",
      subtitle: `${config.carryPercent}% carried interest`,
      icon: "shield", accent: "#d4ae4f", bg: "#1a1810" },
    { show: config.subscriptionLine, id: "sub-line", label: "Subscription Line",
      subtitle: "Credit facility",
      icon: "creditCard", accent: "#f472b6", bg: "#1a1018" },
  ].filter((e) => e.show);

  const sSX = cx - ((support.length - 1) * COL_GAP) / 2;
  const sY = row * ROW_GAP;
  support.forEach((ent, idx) => {
    nodes.push({
      id: ent.id, type: "fundNode",
      position: { x: sSX + idx * COL_GAP, y: sY },
      data: {
        label: ent.label, subtitle: ent.subtitle,
        icon: ent.icon, accentColor: ent.accent, bgColor: ent.bg,
        handles: { top: true, bottom: false, left: false, right: false },
      },
    });
    edges.push(mkEdge(fundId, ent.id));
  });

  return { nodes, edges };
}

/* -------------------------------------------------------------------------- */
/*  Node Templates for Add Node                                              */
/* -------------------------------------------------------------------------- */

const NODE_TEMPLATES = [
  { label: "Custom Entity", icon: "building", accent: "#818cf8", bg: "#131428" },
  { label: "Feeder Fund", icon: "gitFork", accent: "#60a5fa", bg: "#101828" },
  { label: "SPV / Vehicle", icon: "shield", accent: "#d4ae4f", bg: "#1a1810" },
  { label: "Blocker Entity", icon: "ban", accent: "#fbbf24", bg: "#1a1710" },
  { label: "GP Entity", icon: "briefcase", accent: "#34d67a", bg: "#0f1a14" },
  { label: "Credit Facility", icon: "creditCard", accent: "#f472b6", bg: "#1a1018" },
];

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export default function StructureDiagram({ config, onNodeEdit }: StructureDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<DiagramNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeView, setActiveView] = useState<1 | 2>(1);

  const applyLayout = useCallback((view: 1 | 2) => {
    const { nodes: n, edges: e } = view === 1 ? buildView1(config) : buildView2(config);
    setNodes(n);
    setEdges(e);
    setSelectedNodeId(null);
    setShowAddMenu(false);
  }, [config, setNodes, setEdges]);

  useEffect(() => {
    applyLayout(activeView);
  }, [applyLayout, activeView]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: DiagramNode) => {
    setSelectedNodeId(node.id);
    setEditLabel(node.data.label);
    setEditSubtitle(node.data.subtitle || "");
    setShowAddMenu(false);
  }, []);

  const saveEdit = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNodeId
          ? { ...n, data: { ...n.data, label: editLabel, subtitle: editSubtitle } }
          : n
      )
    );
    onNodeEdit?.(selectedNodeId, editLabel, editSubtitle);
    setSelectedNodeId(null);
  }, [selectedNodeId, editLabel, editSubtitle, setNodes, onNodeEdit]);

  const cancelEdit = useCallback(() => { setSelectedNodeId(null); }, []);

  const deleteNode = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  const addNode = useCallback((t: typeof NODE_TEMPLATES[0]) => {
    const id = `custom-${Date.now()}`;
    setNodes((nds) => [...nds, {
      id, type: "fundNode",
      position: { x: 150 + Math.random() * 300, y: 80 + Math.random() * 200 },
      data: {
        label: t.label, subtitle: "Click to edit",
        icon: t.icon, accentColor: t.accent, bgColor: t.bg,
        handles: { top: true, bottom: true, left: true, right: true },
      },
    }]);
    setShowAddMenu(false);
  }, [setNodes]);

  return (
    <div
      className="h-[420px] sm:h-[580px] relative"
      style={{
        background: "#08090d",
        borderRadius: 16,
        border: "1px solid #2a2e4a",
        overflow: "hidden",
      }}
    >
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView fitViewOptions={{ padding: 0.3 }}
        minZoom={0.25} maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        nodesDraggable nodesConnectable={false} elementsSelectable
        panOnScroll zoomOnScroll
        defaultEdgeOptions={{ animated: true, style: { stroke: "#4b8df8", strokeWidth: 2 } }}
      >
        <Background color="#2a2e4a" gap={40} size={1} style={{ opacity: 0.25 }} />
        <Controls
          showInteractive={false}
          style={{
            background: "#111218", border: "1px solid #2a2e4a",
            borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
          className="rf-controls-dark"
        />
      </ReactFlow>

      {/* ── Top-Left Toolbar ── */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <button
          onClick={() => { setShowAddMenu(!showAddMenu); setSelectedNodeId(null); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#111218]/90 backdrop-blur border border-[#2a2e4a] text-[#7a7fa8] hover:text-[#eaeaef] hover:border-[#3d4268] transition-all shadow-lg"
        >
          <Plus size={14} /> Add Node
        </button>
        <button
          onClick={() => applyLayout(activeView)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#111218]/90 backdrop-blur border border-[#2a2e4a] text-[#7a7fa8] hover:text-[#eaeaef] hover:border-[#3d4268] transition-all shadow-lg"
          title="Reset to default layout"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* ── Top-Right View Toggle ── */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        <button
          onClick={() => setActiveView(1)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all shadow-lg ${
            activeView === 1
              ? "bg-[#4b8df8] text-white border border-[#4b8df8]"
              : "bg-[#111218]/90 backdrop-blur border border-[#2a2e4a] text-[#7a7fa8] hover:text-[#eaeaef] hover:border-[#3d4268]"
          }`}
          title="Vale Law — Master-Feeder View"
        >
          <Layers size={15} />
        </button>
        <button
          onClick={() => setActiveView(2)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all shadow-lg ${
            activeView === 2
              ? "bg-[#4b8df8] text-white border border-[#4b8df8]"
              : "bg-[#111218]/90 backdrop-blur border border-[#2a2e4a] text-[#7a7fa8] hover:text-[#eaeaef] hover:border-[#3d4268]"
          }`}
          title="Config-Driven View"
        >
          <Network size={15} />
        </button>
      </div>

      {/* ── Add Node Menu ── */}
      <AnimatePresence>
        {showAddMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-14 left-3 z-20 w-56 bg-[#111218] border border-[#2a2e4a] rounded-xl p-2 shadow-2xl shadow-black/60"
          >
            <div className="text-[10px] uppercase tracking-wider text-[#7a7fa8] font-semibold px-2.5 py-2 mb-1">
              Add Entity
            </div>
            {NODE_TEMPLATES.map((t, i) => {
              const TIcon = iconMap[t.icon] || Building2;
              return (
                <button key={i} onClick={() => addNode(t)}
                  className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-xs text-[#eaeaef] hover:bg-[#191a24] transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${t.accent}18`, border: `1px solid ${t.accent}30` }}>
                    {/* @ts-expect-error dynamic icon */}
                    <TIcon size={13} color={t.accent} />
                  </div>
                  {t.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Panel ── */}
      <AnimatePresence>
        {selectedNodeId && (
          <motion.div
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 right-3 z-20 w-72 bg-[#111218] border border-[#2a2e4a] rounded-xl p-5 shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pencil size={13} className="text-[#4b8df8]" />
                <span className="text-[10px] uppercase tracking-wider text-[#7a7fa8] font-semibold">Edit Node</span>
              </div>
              <button onClick={cancelEdit} className="text-[#7a7fa8] hover:text-[#eaeaef] transition-colors">
                <X size={15} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#7a7fa8] block mb-1.5">Label</label>
                <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  className="w-full bg-[#08090d] border border-[#2a2e4a] rounded-lg px-3 py-2.5 text-xs text-[#eaeaef] focus:outline-none focus:border-[#4b8df8]/50 focus:ring-1 focus:ring-[#4b8df8]/20 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] text-[#7a7fa8] block mb-1.5">Subtitle</label>
                <input value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  className="w-full bg-[#08090d] border border-[#2a2e4a] rounded-lg px-3 py-2.5 text-xs text-[#eaeaef] focus:outline-none focus:border-[#4b8df8]/50 focus:ring-1 focus:ring-[#4b8df8]/20 transition-colors" />
              </div>
              <div className="flex gap-2 pt-1.5">
                <button onClick={saveEdit}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-[#4b8df8] text-white text-xs font-medium hover:bg-[#4b8df8]/85 transition-colors">
                  Save
                </button>
                <button onClick={deleteNode}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#f05252]/10 border border-[#f05252]/20 text-[#f05252] text-xs font-medium hover:bg-[#f05252]/20 transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── View label ── */}
      <div className="absolute bottom-3 left-3 z-10">
        <span className="px-3 py-1.5 rounded-lg bg-[#111218]/80 backdrop-blur border border-[#2a2e4a] text-[10px] text-[#7a7fa8] font-medium tracking-wide">
          {activeView === 1 ? "Advisory View — Master-Feeder Structure" : "Config-Driven Structure"}
        </span>
      </div>

      {/* Dark theme overrides */}
      <style>{`
        .rf-controls-dark button {
          background: #111218 !important;
          border: none !important;
          border-bottom: 1px solid #2a2e4a !important;
          color: #7a7fa8 !important;
          width: 30px !important;
          height: 30px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background 0.15s, color 0.15s !important;
        }
        .rf-controls-dark button:hover {
          background: #191a24 !important;
          color: #eaeaef !important;
        }
        .rf-controls-dark button:last-child {
          border-bottom: none !important;
        }
        .rf-controls-dark button svg,
        .rf-controls-dark button path {
          fill: currentColor !important;
        }
      `}</style>
    </div>
  );
}
