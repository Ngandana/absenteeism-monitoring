'use strict';

/**
 * alert-case-and-email.test.js
 * -----------------------------------------------------------------------
 * Exercises scripts/alert-case-and-email.js's case-creation and
 * duplicate-prevention logic against fixtures 05 (first breach) and 06
 * (correction after alert — no duplicate email), entirely offline.
 *
 * scripts/alert-case-and-email.js is currently a placeholder. Once real
 * logic is written, the recommended pattern is to export a pure function:
 *
 *   module.exports.evaluateAlertCase = function (existingCase, cycleResult, internId, activeRule) {
 *     // existingCase: an existing Alert Case for this breach, or null
 *     // cycleResult: output of rolling-cycle-count's updateMonitoringCycle
 *     // returns: { case: {...}, shouldSendEmail: boolean }
 *   };
 *
 * Until that export exists, this test is skipped rather than failed.
 * -----------------------------------------------------------------------
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadFixture } = require('./helpers/load-fixtures');

const SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'alert-case-and-email.js');

let engine = null;
try {
  engine = require(SCRIPT_PATH);
} catch {
  engine = null;
}

const implemented = !!(engine && typeof engine.evaluateAlertCase === 'function');
const skip = !implemented && 'alert-case-and-email.js has no evaluateAlertCase() export yet — still a Phase 1 placeholder';

test('creates exactly one case and sends exactly one email on first breach', { skip }, () => {
  const fixture = loadFixture('05-threshold-reached-first-time.json');
  const result = engine.evaluateAlertCase(fixture.input.alertCase, {
    runningCount: fixture.expected.monitoringCycle.runningCount,
    thresholdReached: fixture.expected.monitoringCycle.thresholdReached,
    qualifyingDates: fixture.expected.alertCase.qualifyingDates,
  }, fixture.input.dailyAttendance[0].internId, fixture.context.activeRule);

  assert.equal(result.case.count, fixture.expected.alertCase.count);
  assert.equal(result.case.status, fixture.expected.alertCase.status);
  assert.equal(result.shouldSendEmail, true);
});

test('updates an existing case after a correction without sending a duplicate email', { skip }, () => {
  const fixture = loadFixture('06-correction-after-alert.json');
  const result = engine.evaluateAlertCase(fixture.input.alertCase, {
    runningCount: fixture.expected.monitoringCycle.runningCount,
    thresholdReached: fixture.expected.monitoringCycle.thresholdReached,
    qualifyingDates: fixture.expected.alertCase.qualifyingDates,
  }, fixture.input.dailyAttendance[0].internId, fixture.context.activeRule);

  assert.equal(result.case.count, fixture.expected.alertCase.count);
  assert.deepEqual(result.case.qualifyingDates, fixture.expected.alertCase.qualifyingDates);
  assert.equal(result.shouldSendEmail, false);
});
