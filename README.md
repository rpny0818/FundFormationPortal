# Fund Formation OS

A one-stop, banker-grade + lawyer-grade platform for fund structuring, formation playbooks, budgets, and resources.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel (Recommended)

The fastest way to deploy and share:

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Click Deploy - no configuration needed
4. Share the generated URL with colleagues

Alternatively, deploy via CLI:

```bash
npx vercel
```

## Architecture

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero and feature tiles |
| `/builder` | Interactive fund structure builder with React Flow diagrams |
| `/playbook` | 5-phase formation playbook with timeline |
| `/expenses` | Budget modeling with Lean/Standard/Institutional scenarios |
| `/resources` | Curated PDFs, model documents, and regulatory portals |
| `/case-study/distressed-real-estate` | Pre-configured $2B distressed RE fund case study |

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Diagrams:** React Flow (@xyflow/react)
- **Charts:** Recharts
- **Icons:** Lucide React
- **State:** React hooks + localStorage persistence

## Features

- **Fund Builder** - Interactive left/right split-pane with 7 input tabs (Basics, Investors, Structure, Economics, Compliance, Docs, Timeline) and real-time output panels
- **Structure Diagram** - Dynamic React Flow diagram that updates based on master-feeder configuration, feeders, GPs, blockers, and support entities
- **Formation Playbook** - 5-phase timeline from strategy through capital deployment
- **Expense Modeling** - Line-item budget with 3 scenarios, pie/bar charts, CSV/JSON export
- **Resources Library** - Searchable, filterable collection of ILPA, SEC, and offshore guides
- **Case Study** - Pre-loaded distressed real estate fund with deployment model charts

## Editing Defaults

- Fund defaults: `src/data/defaults.ts` -> `defaultFundConfig`
- Case study config: `src/data/defaults.ts` -> `caseStudyConfig`
- Expense line items: `src/data/defaults.ts` -> `defaultExpenses`
- Resource links: `src/data/defaults.ts` -> `resources`
- Playbook phases: `src/data/defaults.ts` -> `playbookPhases`

## Export

- **Expenses:** CSV and JSON export buttons on the expenses page
- **Print/PDF:** Use browser print (Cmd+P / Ctrl+P) for any page

## No Login Required

This is a fully static, shareable portal. No authentication, no database, no server-side state. All configuration is stored in the browser's localStorage.

---

*Informational only. Not legal or investment advice.*
