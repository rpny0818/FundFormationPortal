"use client";

import { useEffect, useCallback, memo } from "react";
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
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Landmark,
  Shield,
  Briefcase,
  CreditCard,
  GitFork,
  Ban,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface StructureDiagramProps {
  config: FundConfig;
}

interface CustomNodeData {
  label: string;
  subtitle?: string;
  icon: string;
  accentColor?: string;
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
};

/* -------------------------------------------------------------------------- */
/*  Custom Node Component                                                     */
/* -------------------------------------------------------------------------- */

const FundNode = memo(({ data }: { data: CustomNodeData }) => {
  const Icon = iconMap[data.icon] || Building2;
  const accent = data.accentColor || "#3b82f6";
  const handles = data.handles || {
    top: true,
    bottom: true,
    left: false,
    right: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="group"
      style={{
        background: "#12131a",
        border: "1px solid #1e2030",
        borderRadius: 10,
        padding: "14px 20px",
        minWidth: 170,
        cursor: "default",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = accent;
        el.style.boxShadow = `0 0 20px ${accent}22, 0 0 40px ${accent}11`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "#1e2030";
        el.style.boxShadow = "none";
      }}
    >
      {/* Handles */}
      {handles.top && (
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: accent,
            border: "2px solid #12131a",
            width: 8,
            height: 8,
          }}
        />
      )}
      {handles.bottom && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: accent,
            border: "2px solid #12131a",
            width: 8,
            height: 8,
          }}
        />
      )}
      {handles.left && (
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={{
            background: accent,
            border: "2px solid #12131a",
            width: 8,
            height: 8,
          }}
        />
      )}
      {handles.right && (
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={{
            background: accent,
            border: "2px solid #12131a",
            width: 8,
            height: 8,
          }}
        />
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${accent}15`,
            border: `1px solid ${accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* @ts-expect-error dynamic icon component */}
          <Icon size={16} color={accent} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#e8e8ed",
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data.label}
          </div>
          {data.subtitle && (
            <div
              style={{
                color: "#6b7094",
                fontSize: 11,
                fontWeight: 400,
                lineHeight: 1.3,
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {data.subtitle}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

FundNode.displayName = "FundNode";

/* -------------------------------------------------------------------------- */
/*  Node types registry                                                       */
/* -------------------------------------------------------------------------- */

const nodeTypes = { fundNode: FundNode };

/* -------------------------------------------------------------------------- */
/*  Layout constants                                                          */
/* -------------------------------------------------------------------------- */

const NODE_WIDTH = 200;
const ROW_GAP_Y = 120;
const COL_GAP_X = 240;

/* -------------------------------------------------------------------------- */
/*  Edge factory                                                              */
/* -------------------------------------------------------------------------- */

function makeEdge(
  source: string,
  target: string,
  sourceHandle?: string,
  targetHandle?: string
): Edge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    sourceHandle: sourceHandle || undefined,
    targetHandle: targetHandle || undefined,
    animated: true,
    style: { stroke: "#3b82f6", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#3b82f6",
      width: 16,
      height: 16,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Layout builder                                                            */
/* -------------------------------------------------------------------------- */

function buildLayout(config: FundConfig): {
  nodes: DiagramNode[];
  edges: Edge[];
} {
  const nodes: DiagramNode[] = [];
  const edges: Edge[] = [];

  /* ---- Determine the horizontal center ---- */
  const feederCount = config.masterFeeder ? config.feeders.length : 0;
  const columnsNeeded = Math.max(feederCount, 1);
  const totalFeederWidth = columnsNeeded * COL_GAP_X;
  const centerX = totalFeederWidth / 2 - NODE_WIDTH / 2;

  let currentRow = 0;

  /* ---- ROW 0: Limited Partners ---- */
  const lpId = "lp-aggregate";
  nodes.push({
    id: lpId,
    type: "fundNode",
    position: { x: centerX, y: currentRow * ROW_GAP_Y },
    data: {
      label: "Limited Partners",
      subtitle: `${config.targetLPCount} LPs | Min ${formatCurrency(config.minCommitment)}`,
      icon: "users",
      accentColor: "#8b5cf6",
      handles: { top: false, bottom: true, left: false, right: false },
    },
  });

  currentRow++;

  /* ---- ROW 1: Feeders (if master-feeder) ---- */
  if (config.masterFeeder && config.feeders.length > 0) {
    const feederStartX =
      centerX - ((config.feeders.length - 1) * COL_GAP_X) / 2;

    config.feeders.forEach((feeder, idx) => {
      const feederId = `feeder-${feeder.id}`;
      const feederX = feederStartX + idx * COL_GAP_X;
      const feederY = currentRow * ROW_GAP_Y;

      nodes.push({
        id: feederId,
        type: "fundNode",
        position: { x: feederX, y: feederY },
        data: {
          label: `${feeder.jurisdiction} Feeder`,
          subtitle: feeder.investorFocus,
          icon: "gitFork",
          accentColor: "#3b82f6",
          handles: { top: true, bottom: true, left: false, right: false },
        },
      });

      // LP -> Feeder
      edges.push(makeEdge(lpId, feederId));

      // Blocker entity
      if (feeder.blockerEntity) {
        const blockerId = `blocker-${feeder.id}`;
        const blockerX = feederX + COL_GAP_X * 0.7;
        const blockerY = feederY;

        nodes.push({
          id: blockerId,
          type: "fundNode",
          position: { x: blockerX, y: blockerY },
          data: {
            label: "Blocker Entity",
            subtitle: `${feeder.jurisdiction} Corp`,
            icon: "ban",
            accentColor: "#f59e0b",
            handles: { top: false, bottom: true, left: true, right: false },
          },
        });

        edges.push(
          makeEdge(feederId, blockerId, "right", "left")
        );
      }
    });

    currentRow++;
  }

  /* ---- ROW 2 (or 1 if no feeders): Master / Standalone Fund ---- */
  const fundId = "master-fund";
  const fundY = currentRow * ROW_GAP_Y;

  nodes.push({
    id: fundId,
    type: "fundNode",
    position: { x: centerX, y: fundY },
    data: {
      label: config.masterFeeder
        ? `${config.fundName || "Master Fund"}`
        : `${config.fundName || "Fund"}`,
      subtitle: `${config.domicile} | ${config.strategy} | ${formatCurrency(config.targetSize)}`,
      icon: "landmark",
      accentColor: "#3b82f6",
      handles: { top: true, bottom: true, left: false, right: true },
    },
  });

  // Connect feeders -> master fund
  if (config.masterFeeder && config.feeders.length > 0) {
    config.feeders.forEach((feeder) => {
      edges.push(makeEdge(`feeder-${feeder.id}`, fundId));
      if (feeder.blockerEntity) {
        edges.push(makeEdge(`blocker-${feeder.id}`, fundId));
      }
    });
  } else {
    // Standalone: LP -> Fund directly
    edges.push(makeEdge(lpId, fundId));
  }

  /* ---- GP Entities (right side, aligned with fund row) ---- */
  const gpStartX = centerX + COL_GAP_X + 60;
  const gpStartY = fundY - ((config.gps.length - 1) * 80) / 2;

  config.gps.forEach((gp, idx) => {
    const gpId = `gp-${gp.id}`;
    nodes.push({
      id: gpId,
      type: "fundNode",
      position: { x: gpStartX, y: gpStartY + idx * 80 },
      data: {
        label: `GP Entity (${gp.entityType})`,
        subtitle: `${gp.gpCommitPercent}% commit`,
        icon: "briefcase",
        accentColor: "#22c55e",
        handles: { top: false, bottom: false, left: true, right: false },
      },
    });

    edges.push(makeEdge(fundId, gpId, "right", "left"));
  });

  currentRow++;

  /* ---- ROW 3+: Support entities ---- */
  const supportEntities: {
    show: boolean;
    id: string;
    label: string;
    subtitle: string;
    icon: string;
    accentColor: string;
  }[] = [
    {
      show: config.managementCompany,
      id: "mgmt-co",
      label: "Management Company",
      subtitle: "Advisory fees & operations",
      icon: "building",
      accentColor: "#6366f1",
    },
    {
      show: config.carryVehicle,
      id: "carry-vehicle",
      label: "Carry Vehicle",
      subtitle: `${config.carryPercent}% carried interest`,
      icon: "shield",
      accentColor: "#c9a84c",
    },
    {
      show: config.subscriptionLine,
      id: "sub-line",
      label: "Subscription Line",
      subtitle: "Credit facility",
      icon: "creditCard",
      accentColor: "#ec4899",
    },
  ];

  const visibleSupport = supportEntities.filter((e) => e.show);
  const supportStartX =
    centerX - ((visibleSupport.length - 1) * COL_GAP_X) / 2;
  const supportY = currentRow * ROW_GAP_Y;

  visibleSupport.forEach((entity, idx) => {
    nodes.push({
      id: entity.id,
      type: "fundNode",
      position: { x: supportStartX + idx * COL_GAP_X, y: supportY },
      data: {
        label: entity.label,
        subtitle: entity.subtitle,
        icon: entity.icon,
        accentColor: entity.accentColor,
        handles: { top: true, bottom: false, left: false, right: false },
      },
    });

    edges.push(makeEdge(fundId, entity.id));
  });

  return { nodes, edges };
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value}`;
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export default function StructureDiagram({ config }: StructureDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<DiagramNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const regenerateLayout = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = buildLayout(config);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [config, setNodes, setEdges]);

  useEffect(() => {
    regenerateLayout();
  }, [regenerateLayout]);

  return (
    <div
      className="h-[350px] sm:h-[500px]"
      style={{
        background: "#0a0b0f",
        borderRadius: 12,
        border: "1px solid #1e2030",
        overflow: "hidden",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#3b82f6", strokeWidth: 2 },
        }}
      >
        <Background
          color="#1e2030"
          gap={40}
          size={1}
          style={{ opacity: 0.4 }}
        />
        <Controls
          showInteractive={false}
          style={{
            background: "#12131a",
            border: "1px solid #1e2030",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          className="react-flow-controls-dark"
        />
      </ReactFlow>

      {/* Dark theme overrides for the controls */}
      <style>{`
        .react-flow-controls-dark button {
          background: #12131a !important;
          border: none !important;
          border-bottom: 1px solid #1e2030 !important;
          color: #6b7094 !important;
          width: 28px !important;
          height: 28px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: background 0.15s, color 0.15s !important;
        }
        .react-flow-controls-dark button:hover {
          background: #1a1b24 !important;
          color: #e8e8ed !important;
        }
        .react-flow-controls-dark button:last-child {
          border-bottom: none !important;
        }
        .react-flow-controls-dark button svg {
          fill: currentColor !important;
        }
        .react-flow-controls-dark button path {
          fill: currentColor !important;
        }
        .react-flow__minimap {
          background: #12131a !important;
          border: 1px solid #1e2030 !important;
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
}
