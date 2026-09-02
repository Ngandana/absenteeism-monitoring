# Intern Absenteeism Monitoring System

Built for **Pillar 5 Group**.

## What This System Does

Jibble already records intern schedules, clock-ins, holidays, and approved leave. This system reads that information into Airtable every day, works out which days count as a real absence (ignoring approved leave, holidays, and rest days), and emails management only when an intern crosses an agreed threshold.

No message is ever sent to an intern automatically — alerts are management-only, and a human always reviews each case before deciding what happens next.

See [docs/01-system-build-and-delivery-plan.md](docs/01-system-build-and-delivery-plan.md) and [docs/02-requirements-engineering-specification.md](docs/02-requirements-engineering-specification.md) for the full plan and requirements.

## Tech Stack

| Layer | Tool / Technology |
|---|---|
| Attendance source of truth | [Jibble](https://www.jibble.io/) (REST API) |
| Database and rules engine | Airtable |
| Integration logic | Airtable Automations — "Run a script" action (JavaScript, Airtable Scripting API) |
| Notifications | Airtable "Send email" automation action |
| Credential storage | Airtable Automation secrets / input variables |

No external server or middleware is used — everything runs natively inside Airtable Automations.

## Project Status

**Phase 1 complete: structure and docs only, no live integration.**

The repository structure, reference documentation, and placeholder automation scripts are in place. No Jibble or Airtable API calls exist yet, and no real credentials are stored anywhere in this repo.

## Repository Structure

```
docs/      Reference documents (build plan, requirements spec) as clean markdown
scripts/   One placeholder .js file per Airtable automation (no working code yet)
config/    .env.example — placeholder credential variable names only
```

## Delivery Phases

- [ ] 0. Policy sign-off — CEO/HR confirm the absence rule, thresholds, and recipients
- [ ] 1. Airtable structure — build all 9 tables, fields, links, and formulas
- [ ] 2. Jibble API proof of concept — confirm credentials, pull a sample of real data
- [ ] 3. Classification engine — script the daily decision rules
- [ ] 4. Rolling-cycle and alerts — count qualifying absences per 30-day cycle, create cases, send alerts
- [ ] 5. Testing — run acceptance test scenarios against sample/historical data
- [ ] 6. Pilot — run live on a small group of interns with daily oversight
- [ ] 7. Production decision — present pilot results, go/no-go sign-off

Full detail, estimates, and dependencies for each phase are in the [Build and Delivery Plan](docs/01-system-build-and-delivery-plan.md).
