/**
 * daily-sync.js
 * -----------------------------------------------------------------------
 * Airtable Automation script: "Run a script" action.
 *
 * PURPOSE
 *   Runs on a daily schedule (Phase 2 / FR-01, FR-02). Pulls the previous
 *   day's schedule, clock-in/clock-out, holiday, and leave data from
 *   Jibble for every active, monitored intern, and writes it into the
 *   Daily Attendance table as raw source data (one record per intern per
 *   date — FR-03). This script does NOT decide whether a day counts as an
 *   absence; that is the Classification Engine's job (see
 *   classification-engine.js). It only fetches and stores the raw facts,
 *   and logs the outcome of the run.
 *
 * TRIGGER
 *   Scheduled automation, once per day, shortly after the agreed daily
 *   finalisation window (see docs/02-requirements-engineering-specification.md,
 *   section 9 — exact time still an open question).
 *
 * INPUTS
 *   - Jibble REST API (schedules, attendance/clock events, holidays,
 *     leave requests/approvals), authenticated with a Jibble API key
 *     stored as an Airtable Automation secret / input variable — never
 *     as a plain field. See config/.env.example for the expected
 *     variable name.
 *   - Airtable "Interns" table: list of active, monitored interns and
 *     their stable Jibble Person ID.
 *   - Airtable "System Configuration" table: timezone, sync on/off
 *     switch, and any other run-time settings.
 *
 * OUTPUTS
 *   - Airtable "Daily Attendance" table: one record created or updated
 *     per intern per date, holding the raw synced data (FR-03). Must be
 *     idempotent — running twice for the same day must not create
 *     duplicate records (see acceptance scenario "Daily sync runs twice
 *     by accident").
 *   - Airtable "Sync and Error Log" table: one entry per run recording
 *     result (success/partial/failure), record counts, and any errors,
 *     to support the retry process (FR-15).
 *
 * NOT YET IMPLEMENTED
 *   This is a structure-only placeholder for Phase 1. No live Jibble or
 *   Airtable integration logic exists yet — that begins in Phase 2
 *   (Jibble API proof of concept) per the Build and Delivery Plan.
 * -----------------------------------------------------------------------
 */

throw new Error("daily-sync.js is a placeholder — not implemented yet (Phase 1: structure only).");
