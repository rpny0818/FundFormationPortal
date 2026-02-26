"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { resources } from "@/data/defaults";
import {
  Search,
  ExternalLink,
  FileText,
  Globe,
  BookOpen,
  Filter,
} from "lucide-react";

const allTags = Array.from(new Set(resources.flatMap((r) => r.tags))).sort();

const typeIcons = {
  PDF: FileText,
  Portal: Globe,
  Guide: BookOpen,
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.summary.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.some((tag) => r.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [search, activeTags]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-3xl font-bold mb-2">
              Resources Library
            </h1>
            <p className="text-sm text-muted max-w-2xl">
              Curated PDFs, model documents, regulatory portals, and industry
              guidance for fund formation professionals.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources by title, topic, or tag…"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
            />
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  activeTags.includes(tag)
                    ? "bg-accent text-white"
                    : "bg-card border border-border text-muted hover:text-foreground hover:border-border-hover"
                }`}
              >
                {tag}
              </button>
            ))}
            {activeTags.length > 0 && (
              <button
                onClick={() => setActiveTags([])}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium text-danger hover:text-danger/80 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-3"
        >
          <div className="text-xs text-muted mb-4">
            {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
          </div>

          {filtered.map((resource) => {
            const TypeIcon = typeIcons[resource.type] || FileText;
            return (
              <motion.div key={resource.id} variants={fadeUp}>
                <div className="group p-5 rounded-xl bg-card border border-border hover:border-border-hover hover:bg-card-hover transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-background border border-border shrink-0">
                      <TypeIcon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">
                          {resource.title}
                        </h3>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                            resource.type === "PDF"
                              ? "bg-red-500/10 text-red-400"
                              : resource.type === "Portal"
                              ? "bg-accent/10 text-accent"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed mb-3">
                        {resource.summary}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {resource.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded bg-background border border-border text-[9px] text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-[11px] font-medium hover:bg-accent/20 transition-colors shrink-0"
                        >
                          Open
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted text-sm">
              No resources match your search criteria.
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 mt-10">
        <div className="max-w-[1200px] mx-auto text-xs text-muted text-center">
          Informational only. Not legal or investment advice.
        </div>
      </footer>
    </div>
  );
}
