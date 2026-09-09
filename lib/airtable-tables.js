'use strict';

/**
 * airtable-tables.js
 * -----------------------------------------------------------------------
 * Table ID constants for the Pillar 5 Absenteeism Monitoring Airtable
 * base, taken from docs/04-airtable-api-reference.md. Code should always
 * address a table by its ID, never its display name — renaming a table in
 * the Airtable UI does not change its ID, so IDs keep working across
 * renames while name-based lookups would silently break.
 * -----------------------------------------------------------------------
 */

const BASE_ID_ENV_VAR = 'AIRTABLE_BASE_ID';

const TABLES = {
  ALERT_RECIPIENTS: 'tblIPNHs0saw8M2QX',
  LEAVE_POLICIES: 'tblS1URoY5yu3kzPj',
  ABSENCE_RULES: 'tbl6EmXu7bNdMaz00',
  INTERNS: 'tblYTxdtvv5b0Q9Ks',
  MONITORING_CYCLES: 'tbl8leNKzkWsydMKm',
  DAILY_ATTENDANCE: 'tblHH8jtvSD0EljH2',
  ALERT_CASES: 'tbllyt2z4ING35LHs',
  SYNC_AND_ERROR_LOG: 'tblbGCL3D2eeKs2np',
  SYSTEM_CONFIGURATION: 'tbl1KXRB5CA1NwOou',
};

module.exports = { BASE_ID_ENV_VAR, TABLES };
