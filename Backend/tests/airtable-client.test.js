'use strict';

/**
 * airtable-client.test.js
 * -----------------------------------------------------------------------
 * Offline checks for lib/airtable-client.js's write-restriction guardrail
 * (see that file's header comment). Passes real fake credentials via the
 * options argument so it never touches config/.env or the network — this
 * only tests the guardrail logic, not real API calls.
 * -----------------------------------------------------------------------
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { createAirtableClient } = require('../lib/airtable-client');
const { TABLES } = require('../lib/airtable-tables');

const client = createAirtableClient({ apiKey: 'fake_test_key', baseId: 'appFakeTestBase' });

test('createRecord refuses write-restricted tables by default', async () => {
  await assert.rejects(
    () => client.createRecord(TABLES.SYSTEM_CONFIGURATION, { 'Daily Sync Enabled': true }),
    /writes to table .* are restricted/
  );
});

test('updateRecord refuses write-restricted tables by default', async () => {
  await assert.rejects(
    () => client.updateRecord(TABLES.DAILY_ATTENDANCE, 'recFake', { 'Daily Status': 'Present' }),
    /writes to table .* are restricted/
  );
});

test('restricted tables cover Interns, Daily Attendance, Alert Cases, Sync and Error Log, System Configuration', () => {
  const { WRITE_RESTRICTED_TABLE_IDS } = require('../lib/airtable-client');
  assert.ok(WRITE_RESTRICTED_TABLE_IDS.has(TABLES.INTERNS));
  assert.ok(WRITE_RESTRICTED_TABLE_IDS.has(TABLES.DAILY_ATTENDANCE));
  assert.ok(WRITE_RESTRICTED_TABLE_IDS.has(TABLES.ALERT_CASES));
  assert.ok(WRITE_RESTRICTED_TABLE_IDS.has(TABLES.SYNC_AND_ERROR_LOG));
  assert.ok(WRITE_RESTRICTED_TABLE_IDS.has(TABLES.SYSTEM_CONFIGURATION));
  assert.ok(!WRITE_RESTRICTED_TABLE_IDS.has(TABLES.ALERT_RECIPIENTS));
  assert.ok(!WRITE_RESTRICTED_TABLE_IDS.has(TABLES.LEAVE_POLICIES));
  assert.ok(!WRITE_RESTRICTED_TABLE_IDS.has(TABLES.ABSENCE_RULES));
});

test('createAirtableClient throws a clear error when credentials are missing', () => {
  const originalKey = process.env.AIRTABLE_API_KEY;
  const originalBase = process.env.AIRTABLE_BASE_ID;
  delete process.env.AIRTABLE_API_KEY;
  delete process.env.AIRTABLE_BASE_ID;
  try {
    assert.throws(() => createAirtableClient(), /AIRTABLE_API_KEY is not set/);
  } finally {
    if (originalKey !== undefined) process.env.AIRTABLE_API_KEY = originalKey;
    if (originalBase !== undefined) process.env.AIRTABLE_BASE_ID = originalBase;
  }
});
