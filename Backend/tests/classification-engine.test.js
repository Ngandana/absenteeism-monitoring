'use strict';

/**
 * classification-engine.test.js
 * -----------------------------------------------------------------------
 * Exercises scripts/classification-engine.js against every fixture's
 * dailyAttendance records, entirely offline.
 *
 * scripts/classification-engine.js is currently a placeholder (see its
 * header comment) — it just throws. Airtable Automation "Run a script"
 * actions don't use Node's module system at all, so once real logic is
 * written there, the recommended pattern is to also export a pure,
 * dependency-free function alongside whatever Airtable-specific glue the
 * script needs:
 *
 *   module.exports.classifyDailyRecord = function (record, context) {
 *     // record: one Daily Attendance record's `source` fields (see
 *     //         tests/fixtures/README.md)
 *     // context: { finalisationWindowPassed, activeRule, ... }
 *     // returns: { classification, countsTowardThreshold }
 *   };
 *
 * The Airtable script body can require/inline that same function. Until
 * it exists, this whole test is skipped rather than failed, so `npm test`
 * stays green through pre-Phase-3 prep and turns itself on automatically
 * the moment the export appears.
 * -----------------------------------------------------------------------
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadFixtures } = require('./helpers/load-fixtures');

const SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'classification-engine.js');

let engine = null;
try {
  engine = require(SCRIPT_PATH);
} catch {
  engine = null;
}

const implemented = !!(engine && typeof engine.classifyDailyRecord === 'function');

test('classification-engine.classifyDailyRecord matches expected output for every fixture', { skip: !implemented && 'classification-engine.js has no classifyDailyRecord() export yet — still a Phase 1 placeholder' }, () => {
  const fixtures = loadFixtures();
  for (const { file, data } of fixtures) {
    const expectedById = new Map((data.expected.dailyAttendance || []).map((r) => [r.recordId, r]));
    for (const record of data.input.dailyAttendance || []) {
      const expected = expectedById.get(record.recordId);
      if (!expected) continue;

      const result = engine.classifyDailyRecord(record.source, data.context || {});

      assert.equal(result.classification, expected.classification, `${file}: classification mismatch for ${record.recordId}`);
      assert.equal(result.countsTowardThreshold, expected.countsTowardThreshold, `${file}: countsTowardThreshold mismatch for ${record.recordId}`);
    }
  }
});
