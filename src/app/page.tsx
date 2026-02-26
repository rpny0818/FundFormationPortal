"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Wrench,
  BookOpen,
  DollarSign,
  Library,
  FileText,
  ArrowRight,
  Building2,
  Scale,
  TrendingUp,
  Shield,
  Users,
  Globe,
} from "lucide-react";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

const features = [
  {
    icon: Wrench,
    title: "Fund Builder",
    desc: "Interactive structure designer with real-time diagrams, economics, and compliance checklists",
    href: "/builder",
    color: "text-accent",
  },
  {
    icon: BookOpen,
    title: "Formation Playbook",
    desc: "Phase-by-phase guide from strategy to capital deployment with deliverables and key decisions",
    href: "/playbook",
    color: "text-emerald-400",
  },
  {
    icon: DollarSign,
    title: "Budget & Expenses",
    desc: "Formation cost modeling across Lean, Standard, and Institutional scenarios with exports",
    href: "/expenses",
    color: "text-gold",
  },
  {
    icon: Library,
    title: "Resources Library",
    desc: "Curated PDFs, model documents, and regulatory portals for fund formation professionals",
    href: "/resources",
    color: "text-purple-400",
  },
  {
    icon: FileText,
    title: "Case Study",
    desc: "Pre-configured distressed real estate fund — $2B target with full structure and economics",
    href: "/case-study/distressed-real-estate",
    color: "text-orange-400",
  },
];

const capabilities = [
  { icon: Building2, label: "Master-Feeder Structures" },
  { icon: Scale, label: "Waterfall Economics" },
  { icon: TrendingUp, label: "Capital Call Pacing" },
  { icon: Shield, label: "Compliance Frameworks" },
  { icon: Users, label: "LP Screening & Onboarding" },
  { icon: Globe, label: "Multi-Jurisdiction Support" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[600px] bg-accent/5 rounded-full blur-[120px]" />

        <div className="relative max-w-[1200px] mx-auto px-6 pt-32 pb-24 lg:pt-40 lg:pb-32">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow" />
                Boutique Advisory Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
            >
              Fund Formation
              <br />
              <span className="text-accent">OS</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-4 leading-relaxed"
            >
              Structure &bull; Documents &bull; Economics &bull; Compliance &bull; LP Workflow
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-sm text-muted/70 max-w-xl mx-auto mb-12"
            >
              A one-stop platform for structuring funds, managing formation workflows,
              modeling economics, and coordinating LP onboarding — built for investment
              bankers and fund formation counsel.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold text-sm animate-subtle-pulse hover:bg-accent/90 transition-colors"
              >
                Open Builder
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/playbook"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-border text-foreground font-medium text-sm hover:bg-card-hover hover:border-border-hover transition-colors"
              >
                View Playbook
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-card border border-border text-foreground font-medium text-sm hover:bg-card-hover hover:border-border-hover transition-colors"
              >
                Browse Resources
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <Link
                href="/case-study/distressed-real-estate"
                className="inline-flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                View Live Case Study: $2B Distressed Real Estate Fund
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {capabilities.map((cap) => (
              <motion.div
                key={cap.label}
                variants={fadeUp}
                className="flex items-center gap-2 text-xs text-muted"
              >
                <cap.icon className="w-3.5 h-3.5 text-accent/60" />
                {cap.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="font-serif text-3xl font-bold mb-3">
              Everything You Need
            </h2>
            <p className="text-muted text-sm max-w-lg mx-auto">
              From initial structuring through capital deployment — every tool a
              formation team requires, in one integrated platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat) => (
              <motion.div key={feat.title} variants={fadeUp}>
                <Link
                  href={feat.href}
                  className="group block p-7 rounded-xl bg-card border border-border hover:border-border-hover hover:bg-card-hover transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 h-full"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2.5 rounded-lg bg-card border border-border group-hover:border-border-hover transition-colors ${feat.color}`}
                    >
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1.5 group-hover:text-accent transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-muted leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Live Demo Card */}
            <motion.div variants={fadeUp}>
              <Link
                href="/case-study/distressed-real-estate"
                className="group block p-7 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-300 h-full"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1.5 text-accent">
                      Live Demo
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      Explore a fully configured $2B distressed real estate fund
                      with Premier Capital as GP
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted text-center sm:text-left">
          <span>Fund Formation OS — Boutique Advisory Platform</span>
          <span>Informational only. Not legal or investment advice.</span>
        </div>
      </footer>
    </div>
  );
}
