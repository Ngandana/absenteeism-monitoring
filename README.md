# Intern Absenteeism Monitoring System

Built for **Pillar 5 Group**.

## What This System Does

Jibble already records intern schedules, clock-ins, holidays, and approved leave. This system reads that information into Airtable every day, works out which days count as a real absence (ignoring approved leave, holidays, and rest days), and emails management only when an intern crosses an agreed threshold.

No message is ever sent to an intern automatically — alerts are management-only, and a human always reviews each case before deciding what happens next.

See [docs/01-system-build-and-delivery-plan.md](docs/01-system-build-and-delivery-plan.md) and [docs/02-requirements-engineering-specification.md](docs/02-requirements-engineering-specification.md) for the full plan and requirements, and [docs/03-open-decisions-log.md](docs/03-open-decisions-log.md) for what's still blocking before certain phases can start.

## Tech Stack

| Layer | Tool / Technology |
|---|---|
| Attendance source of truth | [Jibble](https://www.jibble.io/) (REST API) |
| Database and rules engine | Airtable |
| Integration logic (production) | Airtable Automations — "Run a script" action (JavaScript, Airtable Scripting API) |
| Backend API (this repo's `Backend/`) | Node.js + Express — wraps the Airtable REST API for the frontend, and will host the classification/rolling-cycle/alert scripts once they're implemented |
| Frontend (this repo's `Frontend/`) | React + TypeScript + Vite + Tailwind CSS — built from the Claude Design canvas in `Intern Absenteeism Monitoring Dashboard/` |
| Notifications (production) | Airtable "Send email" automation action |
| Credential storage | `Backend/config/.env` locally (git-ignored); Airtable Automation secrets in production |

`Backend/` and `Frontend/` are a separate, ordinary full-stack app (used for development, review, and the live dashboard) that talks to the *same* Airtable base the production Airtable Automations will run against. It does not replace the Automations-based production design in the docs above — see [docs/01-system-build-and-delivery-plan.md](docs/01-system-build-and-delivery-plan.md) for that.

## Project Status

Structure, docs, and a working backend + frontend are in place. Real data flows for **Alert Recipients**, **Leave Policies**, and **Absence Rules** (the only Airtable tables with live records so far). **Interns, Daily Attendance, Alert Cases, and Sync and Error Log are still empty** in the live base, so the dashboard's Overview / Alert Cases / Data Quality screens run on sample data (clearly marked `sample: true` in every API response) until Phase 3/4 land. No Jibble integration exists yet.

## Repository Structure

```
docs/                                   Reference documents (build plan, requirements spec, API reference, decisions log)
Backend/                                Node.js/Express API — see Backend/README.md
  lib/                                  Airtable REST client (list/get/create/update), env loader
  scripts/                              Placeholder Airtable-automation scripts (Phase 3/4) + verify-airtable-connection.js
  data/sample-data.js                   Sample Alert Cases / Cycles / Exceptions / Sync log (until those tables are live)
  server.js                             Express app: /api/reference/* (real), /api/cases|cycles|exceptions|sync-log (sample)
  config/.env.example                   Credential variable names only
  tests/                                Offline test suite (node:test) + fixtures for the 8 acceptance scenarios
Frontend/                               React + TypeScript + Vite + Tailwind app — see Frontend/README.md
  src/pages/                            Overview, Alert cases, Case detail, Reference data, Data quality
  src/components/                       Design-system components (ported from the Claude Design canvas)
Intern Absenteeism Monitoring Dashboard/  Original Claude Design canvas source (design reference — Frontend/ is the maintained app)
```

## Running It Locally

```
cd Backend && npm install && npm start     # http://localhost:4000
cd Frontend && npm install && npm run dev  # http://localhost:5173
```

Both need their own `.env` (copy from each folder's `.env.example`) — the Airtable key lives only in `Backend/config/.env` and is never sent to the frontend.

## Delivery Phases

- [ ] 0. Policy sign-off — CEO/HR confirm the absence rule, thresholds, and recipients
- [x] 1. Airtable structure — 9 tables built; Alert Recipients, Leave Policies, and Absence Rules populated
- [ ] 2. Jibble API proof of concept — confirm credentials, pull a sample of real data
- [ ] 3. Classification engine — script the daily decision rules
- [ ] 4. Rolling-cycle and alerts — count qualifying absences per 30-day cycle, create cases, send alerts
- [ ] 5. Testing — run acceptance test scenarios against sample/historical data
- [ ] 6. Pilot — run live on a small group of interns with daily oversight
- [ ] 7. Production decision — present pilot results, go/no-go sign-off

Full detail, estimates, and dependencies for each phase are in the [Build and Delivery Plan](docs/01-system-build-and-delivery-plan.md).
