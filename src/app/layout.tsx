import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "Fund Formation OS — Structure • Documents • Economics • Compliance",
  description:
    "A one-stop, banker-grade platform for fund structuring, formation playbooks, budgets, and resources. Built for investment bankers and fund formation lawyers.",
  openGraph: {
    title: "Fund Formation OS",
    description: "Structure • Documents • Economics • Compliance • LP Workflow",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        <Navigation />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
