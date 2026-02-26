"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wrench,
  BookOpen,
  DollarSign,
  Library,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/builder", label: "Builder", icon: Wrench },
  { href: "/playbook", label: "Playbook", icon: BookOpen },
  { href: "/expenses", label: "Expenses", icon: DollarSign },
  { href: "/resources", label: "Resources", icon: Library },
  { href: "/case-study/distressed-real-estate", label: "Case Study", icon: FileText },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] flex items-center justify-between h-14 px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <span className="text-accent font-bold text-sm">FF</span>
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:inline">
            Fund Formation OS
          </span>
        </Link>

        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[44px] flex-shrink-0",
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-card border border-border rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden md:inline">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="hidden lg:inline opacity-60">Informational only</span>
        </div>
      </div>
    </nav>
  );
}
