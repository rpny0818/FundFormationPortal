"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { defaultExpenses } from "@/data/defaults";
import { ScenarioType, ExpenseItem } from "@/data/types";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  Download,
  PieChart as PieChartIcon,
  BarChart3,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#c9a84c",
  "#8b5cf6",
  "#ef4444",
  "#f97316",
  "#06b6d4",
  "#ec4899",
];

const scenarios: ScenarioType[] = ["Lean", "Standard", "Institutional"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(defaultExpenses);
  const [scenario, setScenario] = useState<ScenarioType>("Standard");

  const getAmount = (item: ExpenseItem) => {
    if (scenario === "Lean") return item.lean;
    if (scenario === "Institutional") return item.institutional;
    return item.standard;
  };

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + getAmount(e), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expenses, scenario]
  );

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    expenses.forEach((e) => {
      cats[e.category] = (cats[e.category] || 0) + getAmount(e);
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, scenario]);

  const barData = useMemo(() => {
    return expenses.map((e) => ({
      name: e.description.length > 20 ? e.description.substring(0, 18) + "…" : e.description,
      amount: getAmount(e),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, scenario]);

  const monthlyBurn = useMemo(() => Math.round(total / 12), [total]);

  const addExpense = () => {
    setExpenses((prev) => [
      ...prev,
      {
        id: `e-${Date.now()}`,
        category: "Other",
        description: "New line item",
        lean: 0,
        standard: 0,
        institutional: 0,
      },
    ]);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExpense = (id: string, field: string, value: string | number) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const exportCSV = () => {
    const header = "Category,Description,Lean,Standard,Institutional\n";
    const rows = expenses
      .map(
        (e) =>
          `"${e.category}","${e.description}",${e.lean},${e.standard},${e.institutional}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fund-formation-expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ scenario, expenses, total }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fund-formation-expenses.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1400px] mx-auto px-8 py-16">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-serif text-4xl font-bold mb-4">
                Budget & Expenses
              </h1>
              <p className="text-base text-muted max-w-3xl leading-relaxed">
                Model formation costs across Lean, Standard, and Institutional
                scenarios. All figures are estimates for planning purposes.
              </p>
            </motion.div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium hover:bg-card-hover hover:border-border-hover transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
              <button
                onClick={exportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium hover:bg-card-hover hover:border-border-hover transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-14">
        {/* Scenario Toggle + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-10">
          {/* Scenario Selector */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
              Scenario
            </h3>
            <div className="flex flex-col gap-2">
              {scenarios.map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    scenario === s
                      ? "bg-accent text-white"
                      : "bg-background border border-border text-muted hover:text-foreground hover:border-border-hover"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gold" />
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                Total Formation Cost
              </h3>
            </div>
            <p className="text-3xl font-bold text-gold font-serif">
              {formatCurrency(total)}
            </p>
            <p className="text-xs text-muted mt-1">{scenario} scenario</p>
          </div>

          {/* Monthly Burn */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                Monthly Burn Est.
              </h3>
            </div>
            <p className="text-3xl font-bold text-accent font-serif">
              {formatCurrency(monthlyBurn)}
            </p>
            <p className="text-xs text-muted mt-1">Annualized over 12 months</p>
          </div>

          {/* Line Items Count */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                Line Items
              </h3>
            </div>
            <p className="text-3xl font-bold text-emerald-400 font-serif">
              {expenses.length}
            </p>
            <p className="text-xs text-muted mt-1">
              {categoryData.length} categories
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">Cost by Category</h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#12131a",
                      border: "1px solid #1e2030",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: unknown) => formatCurrency(value as number)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {categoryData.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-1.5 text-[10px] text-muted">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {cat.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold">Cost by Line Item</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2030" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => formatCurrency(v, true)}
                    tick={{ fill: "#6b7094", fontSize: 10 }}
                    axisLine={{ stroke: "#1e2030" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fill: "#6b7094", fontSize: 9 }}
                    axisLine={{ stroke: "#1e2030" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#12131a",
                      border: "1px solid #1e2030",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value: unknown) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Expense Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-card border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold">Line Items</h3>
            <button
              onClick={addExpense}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-muted uppercase tracking-wider">
                    Lean
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-muted uppercase tracking-wider">
                    Standard
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-muted uppercase tracking-wider">
                    Institutional
                  </th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/50 hover:bg-card-hover transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <input
                        value={item.category}
                        onChange={(e) =>
                          updateExpense(item.id, "category", e.target.value)
                        }
                        className="bg-transparent border-none text-xs w-full focus:outline-none focus:text-accent"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        value={item.description}
                        onChange={(e) =>
                          updateExpense(item.id, "description", e.target.value)
                        }
                        className="bg-transparent border-none text-xs w-full focus:outline-none focus:text-accent"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <input
                        type="number"
                        value={item.lean}
                        onChange={(e) =>
                          updateExpense(item.id, "lean", Number(e.target.value))
                        }
                        className={`bg-transparent border-none text-xs w-24 text-right focus:outline-none focus:text-accent ${
                          scenario === "Lean" ? "text-gold font-semibold" : "text-muted"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <input
                        type="number"
                        value={item.standard}
                        onChange={(e) =>
                          updateExpense(
                            item.id,
                            "standard",
                            Number(e.target.value)
                          )
                        }
                        className={`bg-transparent border-none text-xs w-24 text-right focus:outline-none focus:text-accent ${
                          scenario === "Standard"
                            ? "text-gold font-semibold"
                            : "text-muted"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <input
                        type="number"
                        value={item.institutional}
                        onChange={(e) =>
                          updateExpense(
                            item.id,
                            "institutional",
                            Number(e.target.value)
                          )
                        }
                        className={`bg-transparent border-none text-xs w-24 text-right focus:outline-none focus:text-accent ${
                          scenario === "Institutional"
                            ? "text-gold font-semibold"
                            : "text-muted"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => removeExpense(item.id)}
                        className="p-1 rounded hover:bg-danger/10 text-muted hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-background/50 font-semibold">
                  <td className="px-4 py-3" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-gold">
                    {formatCurrency(
                      expenses.reduce((s, e) => s + e.lean, 0)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gold">
                    {formatCurrency(
                      expenses.reduce((s, e) => s + e.standard, 0)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gold">
                    {formatCurrency(
                      expenses.reduce((s, e) => s + e.institutional, 0)
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
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
