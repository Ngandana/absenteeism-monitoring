'use strict';

/**
 * fixtures.schema.test.js
 * -----------------------------------------------------------------------
 * Sanity-checks the fixture files themselves against the schema documented
 * in tests/fixtures/README.md. Runs fully offline and passes today (no
 * dependency on any script being implemented) — it exists so a malformed
 * or incomplete fixture is caught immediately, before anyone tries to
 * write logic against it.
 * -----------------------------------------------------------------------
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadFixtures } = require('./helpers/load-fixtures');

const EXPECTED_SCENARIO_COUNT = 8;
const VALID_CLASSIFICATIONS = new Set([
  'Excluded',
  'Approved Leave',
  'Present',
  'Partial Day',
  'Pending Review',
  'Qualifying Absence',
  'Data Error / Sync Pending',
]);

test('exactly 8 fixture files exist, one per acceptance scenario', () => {
  const fixtures = loadFixtures();
  assert.equal(fixtures.length, EXPECTED_SCENARIO_COUNT);
});

test('every fixture has the required top-level shape', () => {
  const fixtures = loadFixtures();
  for (const { file, data } of fixtures) {
    assert.ok(typeof data.scenario === 'string' && data.scenario.length > 0, `${file}: missing "scenario"`);
    assert.ok(typeof data.scenarioRef === 'string' && data.scenarioRef.length > 0, `${file}: missing "scenarioRef"`);
    assert.ok(typeof data.description === 'string' && data.description.length > 0, `${file}: missing "description"`);
    assert.ok(data.input && typeof data.input === 'object', `${file}: missing "input"`);
    assert.ok(data.expected && typeof data.expected === 'object', `${file}: missing "expected"`);
  }
});

test('every Daily Attendance record in "input" has the documented source fields', () => {
  const fixtures = loadFixtures();
  for (const { file, data } of fixtures) {
    for (const record of data.input.dailyAttendance || []) {
      assert.ok(record.recordId, `${file}: record missing recordId`);
      assert.ok(record.internId, `${file}: ${record.recordId} missing internId`);
      assert.ok(record.date, `${file}: ${record.recordId} missing date`);
      assert.ok(record.source && typeof record.source === 'object', `${file}: ${record.recordId} missing source`);
      for (const key of ['scheduledToWork', 'isPublicHolidayOrRestDay', 'leave', 'attendance', 'correction', 'syncStatus']) {
        assert.ok(key in record.source, `${file}: ${record.recordId}.source missing "${key}"`);
      }
    }
  }
});

test('every expected classification is one of the values classification-engine.js documents', () => {
  const fixtures = loadFixtures();
  for (const { file, data } of fixtures) {
    for (const record of data.expected.dailyAttendance || []) {
      if (record.classification == null) continue;
      assert.ok(
        VALID_CLASSIFICATIONS.has(record.classification),
        `${file}: unexpected classification "${record.classification}" for ${record.recordId}`
      );
    }
  }
});

test('every expected Daily Attendance entry matches an input record by recordId', () => {
  const fixtures = loadFixtures();
  for (const { file, data } of fixtures) {
    const inputIds = new Set((data.input.dailyAttendance || []).map((r) => r.recordId));
    for (const record of data.expected.dailyAttendance || []) {
      assert.ok(inputIds.has(record.recordId), `${file}: expected record ${record.recordId} has no matching input record`);
    }
  }
});
