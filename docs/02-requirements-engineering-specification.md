# Intern Absenteeism Monitoring System

**Requirements Engineering Specification** | Pillar 5 Group

## 1. Purpose

This document sets out what the system must do, what it must not do, the tools it will be built with, and how it will be tested. It is written to guide a single developer through the build and to give management a clear reference for what was agreed.

## 2. Scope

### 2.1 In Scope

- Active interns only.
- Reading Jibble schedules, attendance, holidays, and leave data.
- Airtable sync, classification, rolling-period counting, case records, management emails, and dashboards.

### 2.2 Out of Scope

- Automatic emails or messages to interns.
- Disciplinary or payroll decisions.
- Replacing Jibble as the attendance system.
- External integration middleware (not needed for the MVP).
- Predictive risk scoring.

## 3. Tech Stack

| Layer | Tool / Technology | Why |
|---|---|---|
| Attendance source of truth | Jibble (existing tool) | Already used by Pillar 5 for schedules, clock events, holidays, and leave. Has a REST API. |
| Database and rules engine | Airtable (paid plan, already in use) | Handles relational data, scheduled automations, and dashboards without extra infrastructure. |
| Integration logic | Airtable Automations + "Run a script" action (JavaScript, Airtable Scripting API) | Native to Airtable; no external server needed to call the Jibble API and apply rules. |
| Notifications | Airtable "Send email" automation action | Keeps alerts inside the same platform that holds the evidence (direct case link included). |
| Credential storage | Airtable Automation secrets / input variables | Keeps the Jibble API key out of plain fields and visible reports. |
| API testing (proof of concept only) | Postman or curl | Used briefly in Phase 2 to confirm Jibble endpoints and data shape before scripting. |
| External middleware | None required for MVP | Confirmed viable using only Jibble and Airtable; revisit only if a plan limit is hit. |

## 4. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Run a scheduled daily sync from Jibble to Airtable. | Must |
| FR-02 | Retrieve schedule, attendance, holiday, and leave data for each monitored intern. | Must |
| FR-03 | Create or update exactly one Daily Attendance record per intern per date. | Must |
| FR-04 | Apply the approved classification order and exclude valid non-working or leave days. | Must |
| FR-05 | Hold pending leave and unresolved corrections outside the absence count until resolved. | Must |
| FR-06 | Allow the threshold and rolling period to be changed without changing code. | Must |
| FR-07 | Support the agreed absence rule (see Open Questions, section 9). | Must |
| FR-08 | Create one Alert Case each time a threshold is newly reached. | Must |
| FR-09 | Prevent duplicate cases and duplicate emails for the same breach. | Must |
| FR-10 | Email only the configured management recipients. | Must |
| FR-11 | Include intern, department, rule, count, qualifying dates, and case link in every alert email. | Must |
| FR-12 | Allow authorised users to acknowledge, assign, comment on, dismiss, and close a case. | Must |
| FR-13 | Recalculate affected counts when attendance or leave data is corrected. | Must |
| FR-14 | Provide dashboards for open cases, exceptions, trends, and data quality issues. | Should |
| FR-15 | Log sync failures and support a controlled retry process. | Must |

## 5. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Reliability | Daily processing succeeds on at least 98% of pilot workdays, excluding confirmed vendor outages. |
| Accuracy | The same source data and rule version always produce the same result. |
| Timeliness | Previous-day records and eligible alerts are ready within the agreed morning window. |
| Auditability | Changes to rules, classifications, and cases keep a record of user, date, and reason. |
| Maintainability | Threshold, period, and recipients are editable without changing scripts. |
| Security and privacy | Role-based access; interns have no access to the base; no medical detail stored in alert emails; API key stored as a secret, never a plain field. |

## 6. Data Model Summary

Nine tables, built in this order:

| Table | Purpose |
|---|---|
| 1. Alert Recipients | Who receives which type of alert, and whether they are active. |
| 2. Leave Policies | Reference leave rules (annual, sick, family responsibility) used for context, not attendance logic. |
| 3. Absence Rules | Threshold, monitoring period, alert level, and message for each rule. |
| 4. Interns | One record per monitored intern, linked to Jibble via a stable Person ID. |
| 5. Monitoring Cycles | The rolling 30-day windows used to count qualifying absences. |
| 6. Daily Attendance | One record per intern per date; holds the daily classification and whether it counts. |
| 7. Alert Cases | One record per threshold breach; holds evidence, status, and email log. |
| 8. Sync and Error Log | Every sync run, its result, and any failure that needs a retry. |
| 9. System Configuration | Timezone, cycle length, finalisation hour, and on/off switches for sync and email. |

## 7. Business Rules

### 7.1 Daily Classification Order

Each intern-day is checked in this order, and the first match decides the outcome:

| Check | Outcome |
|---|---|
| Scheduled to work? | If no, exclude the day. |
| Public holiday or rest day? | If yes, exclude the day. |
| Approved leave in Jibble? | If yes, classify as Approved Leave and exclude. |
| Valid attendance recorded? | If yes, classify as Present or Partial Day. |
| Leave pending or correction unresolved? | If yes, classify as Pending Review; do not count yet. |
| None of the above? | Classify as Qualifying Absence and count against the active rule. |

### 7.2 Alert Thresholds

Alerts are management-only. No automatic message is ever sent to an intern.

> **Note:** The exact threshold model is not yet finalised — see the open question in section 9 below.

## 8. Acceptance Test Scenarios

| Scenario | Expected Result |
|---|---|
| Approved leave, no clock-in | Classified as Approved Leave; does not count. |
| Rest day or public holiday | Excluded; does not count. |
| Pending leave request | Classified as Pending Review; does not count until resolved. |
| Valid workday, no attendance, no exclusion | Classified as Qualifying Absence after the finalisation window. |
| Threshold reached for the first time | Exactly one Alert Case and one management email created. |
| Correction made after an alert was sent | Case evidence and count update; no duplicate alert sent. |
| Jibble sync fails or is incomplete | Records marked Data Error / Sync Pending; excluded from counts until resolved. |
| Daily sync runs twice by accident | No duplicate daily records, cases, or emails. |

## 9. Open Questions and Decisions Needed Before Build

These must be confirmed before Phase 3 (classification engine) starts:

- **Threshold conflict:** the PRD states a single rule of 4 qualifying absence days in a rolling 30-day period, while the Airtable Build Instructions define four alert levels at 2, 5, 7, and 10 days. Confirm which model (or combination) is the real requirement before the Absence Rules table is finalised.
- Whether partial days or leave taken with notice count toward the threshold.
- The exact daily finalisation window (what time each morning the previous day is assessed).
- Final confirmation of the case owner for each department, if this differs from the three named alert recipients.

## 10. Risks

| Risk | Level | Main Control |
|---|---|---|
| Incorrect Jibble schedules or holiday calendars | High | Data audit before the pilot; manager ownership of corrections. |
| Leave approved outside Jibble | High | No off-system approval accepted at finalisation time. |
| API or automation failure | Medium | Error log, retry process, and fail-safe exclusion (never assume absence). |
| Single point of technical ownership | Medium | Document credentials, scripts, and recovery steps as you build, not after. |
| Threshold rule misunderstood | Medium | Resolve the Open Question above before scripting the rules engine. |
