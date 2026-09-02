# Intern Absenteeism Monitoring System

**System Build and Delivery Plan** | Solo Developer Version | Pillar 5 Group

## 1. Purpose

This document explains, in plain language, how the Intern Absenteeism Monitoring System will be designed, built, and delivered by one developer. It follows the approved Project Requirements Document (PRD v1.1) and the Airtable Table Build Instructions already reviewed by Pillar 5. Use this as your working guide from first table to production go-live.

## 2. What This System Does

Jibble already records intern schedules, clock-ins, holidays, and approved leave. This system reads that information into Airtable every day, works out which days count as a real absence (ignoring approved leave, holidays, and rest days), and emails management only when an intern crosses an agreed threshold. No message is ever sent to the intern automatically. A human always reviews the case and decides what happens next.

## 3. How the Pieces Fit Together

| Layer | Tool | Job |
|---|---|---|
| Source of truth | Jibble | Stores schedules, clock-in and clock-out events, holidays, and leave requests/approvals. |
| Rules and monitoring | Airtable | Stores daily records, applies the classification rules, tracks 30-day cycles, creates cases, and sends alerts. |
| Builder and maintainer | You | Designs the Airtable base, writes the scripts, sets up automations, tests the system, and owns fixes. |
| Decision makers | Miss Candice, Miss Gabby, Admin rep | Receive alert emails, review evidence, and decide whether to act. |

## 4. Build Approach

Because one person is building this, work happens one phase at a time instead of several people working in parallel. The Airtable Build Instructions already enforce this discipline at table level (finish one table completely before starting the next). The same rule applies at project level: do not start scripting automations before the base structure is fully built and checked, and do not start the pilot before testing has passed.

## 5. Delivery Phases

| Phase | What Happens | Main Output | Est. Time |
|---|---|---|---|
| 0. Policy sign-off | CEO/HR confirm the absence rule, thresholds, and recipients (see Requirements doc, Open Questions). Not your build task, but nothing after this can start without it. | Approved rule set | 2-3 days |
| 1. Airtable structure | Build all 9 tables, fields, links, single-select options, and formulas exactly as specified. Add only the static records (recipients, rules, policies, config). Leave attendance data empty. | Approved Airtable base | 3-4 days |
| 2. Jibble API proof of concept | Confirm API credentials work, pull a small sample of real schedule/attendance/leave data, and store it as automation secrets (never in a plain field). | Working sample sync | 3-5 days |
| 3. Classification engine | Write the script that applies the daily decision rules (scheduled, holiday, approved leave, valid attendance, pending, or qualifying absence) and writes the result to Daily Attendance. | Automated daily classification | 4-6 days |
| 4. Rolling-cycle and alerts | Build the logic that counts qualifying absences inside each 30-day cycle, creates one Alert Case per new threshold reached, and sends one management email per case. | Working alert pipeline | 4-6 days |
| 5. Testing | Run the acceptance test scenarios from the Requirements doc using sample or historical data, and fix anything that fails. | Signed-off test results | 3-5 days |
| 6. Pilot | Run the live system on a small group of interns with daily oversight. Watch the Sync and Error Log closely. | Pilot evidence report | 10-15 days |
| 7. Production decision | Present pilot results to the CEO/sponsor. Resolve any open issues before wider rollout. | Go/no-go decision | 1-2 days |

These are working estimates for one developer at normal focus. Phases 3 and 4 can overlap slightly once the structure is stable, but do not start Phase 6 (pilot) until Phase 5 (testing) has fully passed.

## 6. What You Need From Others

These items are outside your build work but block your progress if missing:

- Signed-off answer to the threshold discrepancy (see Requirements doc, section 9).
- Jibble data audit: correct schedules, holiday calendars, and manager assignments for every monitored intern, done by HR/managers before Phase 2.
- Jibble API credentials, issued to a role or shared owner rather than one person's individual login.
- Confirmation that Miss Candice, Miss Gabby, and the nominated Admin person are the final alert recipients.

## 7. Go-Live Checklist

- All acceptance tests pass on sample data.
- Jibble schedules and leave data audited for the pilot group.
- No unresolved high-risk data quality issue remains.
- Managers understand their role in leave approval, corrections, and alert review.
- Daily Sync and Alert Emails switched on only after the above are confirmed.
- CEO or delegated sponsor signs off on production use.

## 8. Your Role Throughout

You are the technical owner for the full life of this project: builder, tester, and the person who gets notified if a sync fails. Keep the Sync and Error Log table as your first daily check once Phase 2 is live, since a missed sync failure is the main way a wrong absence could slip through.
