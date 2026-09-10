# Frontend

React + TypeScript + Vite + Tailwind CSS app for the Intern Absenteeism Monitoring System, built from the Claude Design canvas in `../Intern Absenteeism Monitoring Dashboard/` (design tokens — Archivo font, the "Modernist" color system — carried over into `src/index.css`'s `@theme` block).

## Setup

```
npm install
cp .env.example .env   # points at the Backend API, defaults to http://localhost:4000
npm run dev             # http://localhost:5173
```

Requires the [Backend](../Backend/) to be running — this app never talks to Airtable directly (that would mean shipping the Airtable key in browser-visible code); it calls the Backend's REST API instead.

## Structure

```
src/
  App.tsx           Screen state, data fetching, layout shell (header/nav/footer)
  components/
    Nav.tsx          Top navigation tabs
    ui.tsx           Design-system primitives: Button, Field, Select, Card, MarkScale, LevelBadge, StatTile...
  pages/
    Overview.tsx      Open-cases-by-level tiles, department/cycle charts, priority list
    AlertCases.tsx    Filterable case table
    CaseDetail.tsx    Evidence, history, and the review-decision form
    ReferenceData.tsx Search over the real Alert Recipients / Leave Policies / Absence Rules data
    DataQuality.tsx   Exceptions table + sync log
  lib/
    api.ts            fetch wrapper for the Backend API
    types.ts           Shared TypeScript types matching the Backend's response shapes
```

## Notes

- Alert Cases / Cycles / Data Quality run on **sample data** the Backend serves (see `Backend/data/sample-data.js`) — the underlying Airtable tables are still empty. Reference Data is real.
- `npm run build` type-checks (`tsc -b`) then builds with Vite; `npm run lint` runs oxlint.
