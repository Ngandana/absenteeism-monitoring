# Pillar 5 Absenteeism Monitoring — Airtable Backend Integration Reference

This document has everything the backend (built in VS Code / Claude Code) needs to connect to the Airtable base via the Airtable Web API. It does **not** include any secret credential — see "Getting Your API Credentials" for how to generate that yourself, directly in Airtable, so it never has to pass through a chat conversation.

## Base Info

- **Base ID:** `app8q2ZwnPwroj6pF`
- **Base name:** Pillar 5 Absenteeism Monitoring
- **API root:** `https://api.airtable.com/v0/app8q2ZwnPwroj6pF/<tableIdOrName>`

## Tables & Table IDs

| # | Table Name | Table ID | Records |
|---|---|---|---|
| 1 | Alert Recipients | `tblIPNHs0saw8M2QX` | 3 |
| 2 | Leave Policies | `tblS1URoY5yu3kzPj` | 4 |
| 3 | Absence Rules | `tbl6EmXu7bNdMaz00` | 4 |
| 4 | Interns | `tblYTxdtvv5b0Q9Ks` | 0 |
| 5 | Monitoring Cycles | `tbl8leNKzkWsydMKm` | 0 |
| 6 | Daily Attendance | `tblHH8jtvSD0EljH2` | 0 |
| 7 | Alert Cases | `tbllyt2z4ING35LHs` | 0 |
| 8 | Sync and Error Log | `tblbGCL3D2eeKs2np` | 0 |
| 9 | System Configuration | `tbl1KXRB5CA1NwOou` | 1 |

*(A temporary "Build Spec Reference" table also exists — scratch space used while building this base, not part of the data model. It will be deleted once confirmed.)*

## Field Reference

### 1. Alert Recipients (pre-existing — field types below are read from the grid, not independently verified field-by-field)
Recipient Name (primary), Role, Email, Active, Receive Absenteeism Alerts, Receive Leave Alerts, Receive System Error Alerts, Department, Notes, Absence Rules (link), Alert Cases (link)

### 2. Leave Policies (pre-existing)
Policy Name (primary), Leave Type, Active, Entitlement Days, Entitlement Period, Request Notice Days, Medical Certificate Rule, Effective From, Effective To, Policy Description, Last Modified

### 3. Absence Rules (pre-existing)
Rule Name (primary), Rule Category, Active, Threshold, Monitoring Period Days, Alert Level, Alert Message, Effective From, Effective To, Applies To, Alert Recipients (link), Default Case Owner, Rule Version, Rule Description, Created By, Last Modified, Interns (link), Alert Cases (link), System Configuration (link)

### 4. Interns (pre-existing)
Intern Name (primary), Jibble Person ID, Intern ID, Department, Manager Name, Manager Email, Intern Email, Active Status, Monitoring Rule, Start Date, End Date, Last Synced, Daily Attendance (link), Alert Cases (link), System Configuration (link)

### 5. Monitoring Cycles
- **Cycle Name** — Formula (primary): `"CYCLE-" & RIGHT("000" & {Cycle Number}, 3) & " | " & DATETIME_FORMAT({Cycle Start Date}, "DD MMM YYYY")`
- Cycle Number — Autonumber
- Cycle Start Date — Date
- Cycle End Date — Date
- Active Cycle — Checkbox
- Cycle Length Days — Number
- Daily Attendance Records — Link to Daily Attendance
- Qualifying Absences — Rollup
- Alert Cases — Link to Alert Cases
- Cycle Status — Single select (Upcoming, Active, Closed)
- Notes — Long text

### 6. Daily Attendance
- **Attendance Record** — Formula (primary): `{Intern} & " - " & DATETIME_FORMAT({Attendance Date}, "YYYY-MM-DD")`
- Intern — Link to Interns
- Jibble Person ID — Lookup from Interns
- Attendance Date — Date
- Scheduled to Work — Checkbox
- Scheduled Start / Scheduled End — Date with time
- Clock-In Time / Clock-Out Time — Date with time
- Attendance Recorded — Checkbox
- Public Holiday — Checkbox
- Rest Day — Checkbox
- Leave Status — Single select
- Leave Type, Medical Certificate Submitted, Certificate Status, Correction Pending, Daily Status, Qualifying Absence, 30-Day Cycle, Data Quality Status, Source Updated At, Synced At
- **Daily Record Key** — Formula
- Linked Alert Cases — Link (auto reverse-link from Alert Cases)

### 7. Alert Cases
- **Case Reference** — Formula (primary): `"ABS-" & RIGHT("0000" & {Case ID}, 4)`
- Case ID — Autonumber
- Intern — Link to Interns
- Department, Manager — Lookup from Interns
- Monitoring Cycle — Link to Monitoring Cycles
- Rule Triggered — Link to Absence Rules
- Alert Level — Lookup from Rule Triggered
- Qualifying Absence Count — Number
- Qualifying Attendance Records — Link to Daily Attendance
- Qualifying Absence Dates — Rollup
- Cycle Start Date / Cycle End Date — Lookup from Monitoring Cycle
- Case Status — Single select (New, Under Review, Action Required, Dismissed, Closed)
- Case Owner — User
- Management Comments — Long text
- Action Decision — Single select (No Action, Continue Monitoring, Management Discussion, Schedule Consultation, Formal Action Review, Other)
- Email Sent — Checkbox
- Email Sent At — Date with time
- Alert Recipients — Link to Alert Recipients
- **Case Key** — Formula: `{Intern} & "-" & {Monitoring Cycle} & "-" & {Rule Triggered}`
- Created Time — Created time
- Closed Date — Date

### 8. Sync and Error Log
- **Sync Reference** — Formula (primary): `"SYNC-" & RIGHT("00000" & {Sync ID}, 5)`
- Sync ID — Autonumber
- Sync Started At / Sync Completed At — Date with time
- Source Period Start / Source Period End — Date
- Data Type — Multiple select (Employees, Attendance, Leave, Schedules, Holidays, Medical Certificates)
- Sync Status — Single select (Success, Partial Success, Failed, Retrying)
- Records Retrieved / Records Created / Records Updated / Records Failed — Number
- Error Type — Single select (API, Authentication, Data, Script, Automation Limit, Unknown)
- Error Details — Long text
- Retry Required — Checkbox
- Retry Count — Number
- Technical Owner — User
- Resolved — Checkbox
- Resolution Notes — Long text

### 9. System Configuration
- **Configuration Name** — Single line text (primary)
- System Notes — Long text
- Technical Owner — User
- Active — Checkbox
- Time Zone — Single select (Africa/Johannesburg, UTC, Europe/London, America/New_York, Asia/Dubai)
- Cycle Length Days — Number
- First Cycle Start Date — Date
- Finalisation Hour — Number
- **Daily Sync Enabled — Checkbox (currently OFF)**
- **Alert Emails Enabled — Checkbox (currently OFF)**
- Pilot Mode — Checkbox (currently ON)
- Pilot Interns — Link to Interns
- Default Absence Rules — Link to Absence Rules
- Last Successful Sync — Date with time
- API Status — Single select (Testing, Connected, Disconnected, Error) — currently "Testing"

One record exists: **Pillar 5 Absenteeism Monitoring** — Active ✓, Africa/Johannesburg, 30-day cycle, Daily Sync OFF, Alert Emails OFF, Pilot Mode ON, API Status "Testing".

## Getting Your API Credentials (do this yourself, not through an AI chat)

Airtable's REST API needs two things: the **Base ID** above, and a **Personal Access Token (PAT)** that authenticates as you. A PAT is a secret — treat it like a password. Generate it yourself directly in Airtable so it never has to be typed, pasted, or displayed anywhere else:

1. Go to **airtable.com/create/tokens** (while logged into the account that owns this base).
2. Click **Create new token**.
3. Name it something like `pillar5-absenteeism-backend`.
4. Under **Scopes**, add at minimum:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
   (add `data.recordComments:read`/`write` only if the backend needs comments)
5. Under **Access**, add only this base: **Pillar 5 Absenteeism Monitoring**.
6. Click **Create token**. Airtable shows the token **once** — copy it immediately.
7. In the backend project, paste it into a `.env` file (never commit this file to git):
   ```
   AIRTABLE_API_KEY=pat_xxxxxxxxxxxxxxxxx
   AIRTABLE_BASE_ID=app8q2ZwnPwroj6pF
   ```
8. The backend reads `AIRTABLE_API_KEY` from the environment and sends it as a Bearer token:
   ```
   Authorization: Bearer pat_xxxxxxxxxxxxxxxxx
   ```

Doing it this way means the token is generated by you, seen only by you, and lives only in your own `.env` file — nothing about it ever needs to travel through a chat log.

## Standing Guardrails (carried over from the base build)

- No API key or credential has been stored anywhere inside the Airtable base itself.
- No Airtable Automations exist in this base, and Jibble has not been connected.
- Daily Sync Enabled and Alert Emails Enabled are OFF on the System Configuration record — flip these only when the backend integration is tested and ready to go live.
