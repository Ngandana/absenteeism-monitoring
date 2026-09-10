'use strict';

/**
 * daily-sync.test.js
 * -----------------------------------------------------------------------
 * Exercises scripts/daily-sync.js's fail-safe and idempotency behaviour
 * against fixtures 07 (sync failure) and 08 (duplicate sync run),
 * entirely offline.
 *
 * scripts/daily-sync.js is currently a placeholder. Once real logic is
 * written, the recommended pattern is to export pure functions:
 *
 *   module.exports.markSyncFailure = function (record, syncRun) {
 *     // returns the Daily Attendance record with classification set to
 *     // "Data Error / Sync Pending" and countsTowardThreshold false
 *   };
 *
 *   module.exports.dedupeSyncRuns = function (syncRuns, existingRecordId) {
 *     // returns { effectiveDailyAttendanceRecords, duplicatesSuppressed }
 *   };
 *
 * Until those exports exist, this test is skipped rather than failed.
 * -----------------------------------------------------------------------
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadFixture } = require('./helpers/load-fixtures');

const SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'daily-sync.js');

let engine = null;
try {
  engine = require(SCRIPT_PATH);
} catch {
  engine = null;
}

const implemented = !!(engine && typeof engine.markSyncFailure === 'function' && typeof engine.dedupeSyncRuns === 'function');
const skip = !implemented && 'daily-sync.js has no markSyncFailure()/dedupeSyncRuns() exports yet — still a Phase 1 placeholder';

test('a failed sync marks the record Data Error / Sync Pending and excludes it', { skip }, () => {
  const fixture = loadFixture('07-jibble-sync-failure.json');
  const record = fixture.input.dailyAttendance[0];
  const syncRun = fixture.input.syncRuns[0];

  const result = engine.markSyncFailure(record.source, syncRun);

  assert.equal(result.classification, fixture.expected.dailyAttendance[0].classification);
  assert.equal(result.countsTowardThreshold, fixture.expected.dailyAttendance[0].countsTowardThreshold);
});

test('a duplicate sync run produces exactly one effective Daily Attendance record', { skip }, () => {
  const fixture = loadFixture('08-duplicate-sync-run.json');
  const record = fixture.input.dailyAttendance[0];

  const result = engine.dedupeSyncRuns(fixture.input.syncRuns, record.recordId);

  assert.equal(result.effectiveDailyAttendanceRecords, fixture.expected.syncLog.effectiveDailyAttendanceRecords);
  assert.equal(result.duplicatesSuppressed, fixture.expected.syncLog.duplicatesSuppressed);
});
