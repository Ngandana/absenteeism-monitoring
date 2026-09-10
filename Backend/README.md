# Backend

Node.js + Express API for the Intern Absenteeism Monitoring System.

## Setup

```
npm install
cp config/.env.example config/.env   # fill in AIRTABLE_API_KEY and AIRTABLE_BASE_ID
npm start                            # http://localhost:4000
```

`npm run dev` runs the same thing with `node --watch` for auto-restart.

## What's here

- `server.js` — the Express app and all routes.
- `lib/` — `airtable-client.js` (list/get/create/update against the Airtable REST API, with a write-restriction guardrail on tables that aren't live yet), `airtable-tables.js` (table ID constants), `env.js` (loads `config/.env`).
- `scripts/` — one placeholder file per future Airtable Automation (classification engine, rolling-cycle count, alert case + email, daily sync) plus `verify-airtable-connection.js`, a read-only connectivity check.
- `data/sample-data.js` — sample Alert Cases / Cycles / Exceptions / Sync log data, transcribed from the original Claude Design canvas. Replace with real Airtable reads once Interns/Daily Attendance/Alert Cases/Sync and Error Log have live data.
- `tests/` — offline `node:test` suite and fixtures for the 8 acceptance scenarios (see `tests/fixtures/README.md`).

## API

| Route | Data | Notes |
|---|---|---|
| `GET /api/reference/:table` | **Real**, live from Airtable | `:table` is `alert-recipients`, `leave-policies`, or `absence-rules` |
| `GET /api/cases`, `GET /api/cases/:id` | Sample | `PATCH /api/cases/:id` writes to an in-memory store only — lost on restart |
| `GET /api/cycles` | Sample | |
| `GET /api/exceptions` | Sample | `PATCH /api/exceptions/:id/resolve` — in-memory only |
| `GET /api/sync-log` | Sample | |
| `GET /api/health` | — | |

The Airtable API key is used **only** in this backend, read from `config/.env` — it is never sent to the frontend or exposed in any response.
