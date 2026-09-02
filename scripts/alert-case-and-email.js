/**
 * alert-case-and-email.js
 * -----------------------------------------------------------------------
 * Airtable Automation script: "Run a script" action, paired with an
 * Airtable "Send email" automation action.
 *
 * PURPOSE
 *   Runs after rolling-cycle-count.js signals that an intern has newly
 *   reached an absence threshold (Phase 4, second half / FR-08, FR-09,
 *   FR-10, FR-11). Creates exactly one Alert Case record per new
 *   threshold breach, and triggers exactly one management email per
 *   case. Management-only: no automatic message is ever sent to the
 *   intern (Requirements doc, section 7.2). A human always reviews the
 *   case afterwards (FR-12) — this script does not decide outcomes, only
 *   raises the case and notifies.
 *
 * TRIGGER
 *   Fires when rolling-cycle-count.js marks a new threshold breach for
 *   an intern (e.g. triggered on a record/field change in the
 *   Monitoring Cycles or Daily Attendance table).
 *
 * INPUTS
 *   - Signal from rolling-cycle-count.js: intern, rule/threshold level
 *     reached, and the qualifying dates that make up the count.
 *   - Airtable "Interns" table: intern and department details.
 *   - Airtable "Absence Rules" table: rule name, threshold, and message
 *     text for the level reached.
 *   - Airtable "Alert Recipients" table: who receives which type of
 *     alert, and whether they are currently active.
 *   - Airtable "Alert Cases" table: existing cases, to check for an
 *     open/duplicate case for the same breach before creating a new one.
 *
 * OUTPUTS
 *   - Airtable "Alert Cases" table: one new case record per new
 *     threshold breach, holding intern, department, rule, count,
 *     qualifying dates, status, and an email log (FR-11). Supports
 *     later acknowledge / assign / comment / dismiss / close actions
 *     (FR-12).
 *   - Triggers the linked "Send email" automation action to the
 *     configured active recipients only (FR-10), containing intern,
 *     department, rule, count, qualifying dates, and a direct case link
 *     (FR-11). Must not send a duplicate email for a breach already
 *     alerted (FR-09) — a correction afterwards updates case evidence,
 *     it does not resend the alert (see acceptance scenario
 *     "Correction made after an alert was sent").
 *
 * NOT YET IMPLEMENTED
 *   This is a structure-only placeholder for Phase 1. No case-creation
 *   or email logic exists yet — that begins in Phase 4, and only after
 *   the threshold/rule open question (Requirements doc, section 9) is
 *   resolved and alert recipients are confirmed (Build and Delivery
 *   Plan, section 6).
 * -----------------------------------------------------------------------
 */

throw new Error("alert-case-and-email.js is a placeholder — not implemented yet (Phase 1: structure only).");
