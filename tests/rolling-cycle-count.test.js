'use strict';

/**
 * rolling-cycle-count.test.js
 * -----------------------------------------------------------------------
 * Exercises scripts/rolling-cycle-count.js's rolling-window counting
 * against fixtures 05 (threshold reached) and 06 (correction after
 * alert), entirely offline.
 *
 * scripts/rolling-cycle-count.js is currently a placeholder. Once real
 * logic is written, the recommended pattern is to export a pure function:
 *
 *   module.exports.updateMonitoringCycle = function (cycle, classifiedRecords, activeRule) {
 *     // cycle: prior Monitoring Cycles record (see tests/fixtures/README.md)
 *     // classifiedRecords: this intern's Daily Attendance records with
 *     //                     classification + countsTowardThreshold already set
 *     // activeRule: the Absence Rules record in force
 *     // returns: { runningCount, thresholdReached, qualifyingDates }
 *   };
 *
 * Until that export exists, this test is skipped rather than failed.
 * -----------------------------------------------------------------------
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadFixture } = require('./helpers/load-fixtures');

const SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'rolling-cycle-count.js');

let engine = null;
try {
  engine = require(SCRIPT_PATH);
} catch {
  engine = null;
}

const implemented = !!(engine && typeof engine.updateMonitoringCycle === 'function');
const skip = !implemented && 'rolling-cycle-count.js has no updateMonitoringCycle() export yet — still a Phase 1 placeholder';

test('rolling-cycle-count reaches the threshold on the 4th qualifying absence', { skip }, () => {
  const fixture = loadFixture('05-threshold-reached-first-time.json');
  const result = engine.updateMonitoringCycle(
    fixture.input.monitoringCycle,
    fixture.input.dailyAttendance,
    fixture.context.activeRule
  );

  assert.equal(result.runningCount, fixture.expected.monitoringCycle.runningCount);
  assert.equal(result.thresholdReached, fixture.expected.monitoringCycle.thresholdReached);
});

test('rolling-cycle-count recalculates downward after a correction', { skip }, () => {
  const fixture = loadFixture('06-correction-after-alert.json');

  // The window total depends on every day in it, not just the one that was
  // corrected — combine the freshly-reclassified record (expected output of
  // classification-engine.js) with the intern's other, unaffected days.
  const correctedRecord = { ...fixture.input.dailyAttendance[0], ...fixture.expected.dailyAttendance[0] };
  const windowRecords = [correctedRecord, ...fixture.input.otherCycleRecords];

  const result = engine.updateMonitoringCycle(
    fixture.input.monitoringCycle,
    windowRecords,
    fixture.context.activeRule
  );

  assert.equal(result.runningCount, fixture.expected.monitoringCycle.runningCount);
  assert.equal(result.thresholdReached, fixture.expected.monitoringCycle.thresholdReached);
});
