# Test Fixtures

Offline sample data for the 8 acceptance test scenarios in
[docs/02-requirements-engineering-specification.md, section 8](../../docs/02-requirements-engineering-specification.md#8-acceptance-test-scenarios).
No Jibble or Airtable connection is required to use these — they exist so the
classification, rolling-cycle, alert, and sync logic can each be developed and
checked against a known-good expected result before either system is wired up.

## Files

| File | Acceptance scenario |
|---|---|
| `01-approved-leave-no-clockin.json` | Approved leave, no clock-in |
| `02-rest-day-public-holiday.json` | Rest day or public holiday |
| `03-pending-leave-request.json` | Pending leave request |
| `04-qualifying-absence.json` | Valid workday, no attendance, no exclusion |
| `05-threshold-reached-first-time.json` | Threshold reached for the first time |
| `06-correction-after-alert.json` | Correction made after an alert was sent |
| `07-jibble-sync-failure.json` | Jibble sync fails or is incomplete |
| `08-duplicate-sync-run.json` | Daily sync runs twice by accident |

## Schema

Every fixture is one JSON object with the same top-level shape:

```jsonc
{
  "scenario": "Short name matching the spec's Scenario column",
  "scenarioRef": "docs/02-requirements-engineering-specification.md, section 8",
  "description": "The spec's Expected Result text, verbatim",
  "context": {
    // Anything the engine needs besides the record itself: whether the daily
    // finalisation window has passed, the active Absence Rule, prior state, etc.
    // Present only when the scenario depends on it.
  },
  "input": {
    // State BEFORE the script(s) under test run.
    "dailyAttendance": [ /* one or more Daily Attendance records, see below */ ],
    "otherCycleRecords": [ /* optional: other already-classified records in the
      same intern's current window, needed by rolling-cycle-count.js to
      recompute a window total when only one day in it changed (scenario 6) —
      each is { recordId, internId, date, classification, countsTowardThreshold } */ ],
    "monitoringCycle": { /* optional: prior rolling-cycle state, scenarios 5/6 */ },
    "alertCase": { /* optional: an already-existing case, scenario 6 */ },
    "syncRuns": [ /* optional: raw sync attempts, scenarios 7/8 */ ]
  },
  "expected": {
    // State AFTER the script(s) under test run, to assert against.
    "dailyAttendance": [ /* same shape as input, with classification filled in */ ],
    "monitoringCycle": { /* optional */ },
    "alertCase": { /* optional, or null if none should be created */ },
    "syncLog": { /* optional */ },
    "notes": "Plain-language summary of what must be true"
  }
}
```

### Daily Attendance record

Field names follow the Daily Attendance table as described in the header
comments of `scripts/classification-engine.js` and `scripts/daily-sync.js`
(FR-03, FR-04, section 7.1's classification order):

```jsonc
{
  "recordId": "rec_<intern>_<date>",
  "internId": "int_001",
  "internName": "Sample name, for readability only",
  "date": "YYYY-MM-DD",
  "source": {
    "scheduledToWork": true,
    "isPublicHolidayOrRestDay": false,
    "leave": { "status": "none | pending | approved | denied", "leaveType": null, "requestId": null },
    "attendance": { "recorded": false, "clockIn": null, "clockOut": null },
    "correction": { "unresolved": false, "note": null },
    "syncStatus": "ok | error | incomplete"
  },
  // Everything below is null in "input" (not yet computed) and filled in "expected":
  "classification": "Excluded | Approved Leave | Present | Partial Day | Pending Review | Qualifying Absence | Data Error / Sync Pending",
  "countsTowardThreshold": true
}
```

This mirrors the 6-step classification order in
[docs/02-requirements-engineering-specification.md, section 7.1](../../docs/02-requirements-engineering-specification.md#71-daily-classification-order).

## Important caveat

Scenario 5 (threshold reached) and the `Absence Rules` values used across
these fixtures assume a **placeholder** rule — 4 qualifying absence days in a
rolling 30-day period — purely so the fixtures have a concrete number to
compute against. The real threshold model is still unresolved; see
[docs/03-open-decisions-log.md](../../docs/03-open-decisions-log.md). Once
that decision lands, revisit these fixtures if the model changes (e.g. to
multiple alert levels).

## How these get used

See `tests/*.test.js`. Each test file loads the relevant fixtures and, once
the corresponding script exports a pure, dependency-free function for its
core logic, asserts its output against `expected`. Until that export exists,
the tests skip themselves rather than fail — see the comment at the top of
each test file for the exact export name expected.
