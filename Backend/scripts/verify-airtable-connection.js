#!/usr/bin/env node
'use strict';

/**
 * verify-airtable-connection.js
 * -----------------------------------------------------------------------
 * Read-only connectivity check for Phase 2a. Confirms AIRTABLE_API_KEY /
 * AIRTABLE_BASE_ID (from config/.env — see config/.env.example) actually
 * authenticate against the real base, and that the field names the API
 * returns match docs/04-airtable-api-reference.md exactly.
 *
 * Reads ONLY: Alert Recipients, Leave Policies, Absence Rules — the three
 * pre-existing, already-populated tables. It never calls createRecord or
 * updateRecord, and does not touch Interns, Daily Attendance, Alert
 * Cases, Sync and Error Log, or System Configuration (whose Daily Sync
 * Enabled / Alert Emails Enabled switches must stay OFF at this phase).
 *
 * Prints, per table: record count, and every field name seen in the
 * returned records, diffed against the reference doc's field list.
 *
 * Usage: node scripts/verify-airtable-connection.js
 * -----------------------------------------------------------------------
 */

const { createAirtableClient } = require('../lib/airtable-client');
const { TABLES } = require('../lib/airtable-tables');

// Field names as listed in docs/04-airtable-api-reference.md, "Field
// Reference" section, with "(primary)"/"(link)" annotations stripped —
// those describe the field, they are not part of its name.
const EXPECTED_FIELDS = {
  [TABLES.ALERT_RECIPIENTS]: [
    'Recipient Name', 'Role', 'Email', 'Active', 'Receive Absenteeism Alerts',
    'Receive Leave Alerts', 'Receive System Error Alerts', 'Department',
    'Notes', 'Absence Rules', 'Alert Cases',
  ],
  [TABLES.LEAVE_POLICIES]: [
    'Policy Name', 'Leave Type', 'Active', 'Entitlement Days',
    'Entitlement Period', 'Request Notice Days', 'Medical Certificate Rule',
    'Effective From', 'Effective To', 'Policy Description', 'Last Modified',
  ],
  [TABLES.ABSENCE_RULES]: [
    'Rule Name', 'Rule Category', 'Active', 'Threshold',
    'Monitoring Period Days', 'Alert Level', 'Alert Message',
    'Effective From', 'Effective To', 'Applies To', 'Alert Recipients',
    'Default Case Owner', 'Rule Version', 'Rule Description', 'Created By',
    'Last Modified', 'Interns', 'Alert Cases', 'System Configuration',
  ],
};

const TABLES_TO_CHECK = [
  { label: 'Alert Recipients', id: TABLES.ALERT_RECIPIENTS },
  { label: 'Leave Policies', id: TABLES.LEAVE_POLICIES },
  { label: 'Absence Rules', id: TABLES.ABSENCE_RULES },
];

function diffFields(apiFieldNames, expectedFieldNames) {
  const apiSet = new Set(apiFieldNames);
  const expectedSet = new Set(expectedFieldNames);
  return {
    unexpectedInApi: [...apiSet].filter((f) => !expectedSet.has(f)).sort(),
    // A field documented but never seen in the API response is not
    // necessarily wrong — Airtable omits a field from `fields` entirely
    // when every record has it empty. Reported as "not yet seen", not a
    // hard mismatch.
    notYetSeenFromApi: [...expectedSet].filter((f) => !apiSet.has(f)).sort(),
  };
}

async function main() {
  const client = createAirtableClient();

  console.log('Pillar 5 Absenteeism Monitoring — Airtable connectivity check');
  console.log('='.repeat(64));

  let anyFailed = false;
  let anyUnexpectedField = false;

  for (const { label, id } of TABLES_TO_CHECK) {
    console.log(`\n${label}  (${id})`);
    console.log('-'.repeat(64));
    try {
      const records = await client.listRecords(id);
      const fieldNames = new Set();
      for (const record of records) {
        for (const key of Object.keys(record.fields || {})) fieldNames.add(key);
      }
      const sortedFieldNames = [...fieldNames].sort();

      console.log(`  Records returned: ${records.length}`);
      console.log(`  Fields seen in API response (${sortedFieldNames.length}):`);
      for (const name of sortedFieldNames) console.log(`    - ${name}`);

      const expected = EXPECTED_FIELDS[id] || [];
      const { unexpectedInApi, notYetSeenFromApi } = diffFields(sortedFieldNames, expected);

      if (unexpectedInApi.length > 0) {
        anyUnexpectedField = true;
        console.log(`  ⚠ In API response but NOT in docs/04-airtable-api-reference.md (${unexpectedInApi.length}):`);
        for (const name of unexpectedInApi) console.log(`    - ${name}`);
      }
      if (notYetSeenFromApi.length > 0) {
        console.log(`  ℹ In reference doc but not seen in this response (${notYetSeenFromApi.length}) — likely just empty on every record, not necessarily a mismatch:`);
        for (const name of notYetSeenFromApi) console.log(`    - ${name}`);
      }
      if (unexpectedInApi.length === 0 && notYetSeenFromApi.length === 0) {
        console.log('  ✔ Field names match the reference doc exactly.');
      }
    } catch (err) {
      anyFailed = true;
      console.log(`  FAILED: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(64));
  if (anyFailed) {
    console.log('Connectivity check completed WITH ERRORS — see FAILED lines above.');
  } else if (anyUnexpectedField) {
    console.log('Connectivity check completed — API reachable, but see ⚠ field name mismatches above.');
  } else {
    console.log('Connectivity check completed successfully — API reachable, all field names match.');
  }
  process.exitCode = anyFailed ? 1 : 0;
}

main().catch((err) => {
  console.error('Unexpected failure:', err.message);
  process.exitCode = 1;
});
