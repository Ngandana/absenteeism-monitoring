'use strict';

/**
 * airtable-client.js
 * -----------------------------------------------------------------------
 * Lightweight wrapper around the Airtable Web API (list/get/create/update
 * records). Used by scripts and, later, Airtable Automations' "Run a
 * script" actions once each is out of placeholder status. Uses Node's
 * built-in fetch — no HTTP dependency added.
 *
 * Auth: reads AIRTABLE_API_KEY and AIRTABLE_BASE_ID from process.env
 * (loaded from config/.env via lib/env.js — see config/.env.example).
 * Never log the resolved apiKey/baseId or the Authorization header.
 *
 * Table IDs: pass the constants from lib/airtable-tables.js, not display
 * names — see that file's header comment for why.
 *
 * Write guardrail: Interns, Daily Attendance, Alert Cases, Sync and Error
 * Log, and System Configuration are still being built out / hold the
 * live sync-and-email on/off switches (see
 * docs/04-airtable-api-reference.md, "Standing Guardrails", and
 * docs/03-open-decisions-log.md). createRecord/updateRecord refuse to
 * write to any of these tables unless the caller explicitly passes
 * { allowRestricted: true } — a deliberate, visible override, not a
 * default. Lift a table off this list only when its phase actually
 * starts.
 * -----------------------------------------------------------------------
 */

const { loadEnv } = require('./env');
const { TABLES } = require('./airtable-tables');

loadEnv();

const API_ROOT = 'https://api.airtable.com/v0';

const WRITE_RESTRICTED_TABLE_IDS = new Set([
  TABLES.INTERNS,
  TABLES.DAILY_ATTENDANCE,
  TABLES.ALERT_CASES,
  TABLES.SYNC_AND_ERROR_LOG,
  TABLES.SYSTEM_CONFIGURATION,
]);

/**
 * @param {{apiKey?: string, baseId?: string}} [options] Override the
 *   environment-sourced credentials (mainly useful for tests).
 */
function createAirtableClient(options = {}) {
  const apiKey = options.apiKey || process.env.AIRTABLE_API_KEY;
  const baseId = options.baseId || process.env.AIRTABLE_BASE_ID;

  if (!apiKey) {
    throw new Error('Airtable client: AIRTABLE_API_KEY is not set. Add it to config/.env (see config/.env.example).');
  }
  if (!baseId) {
    throw new Error('Airtable client: AIRTABLE_BASE_ID is not set. Add it to config/.env (see config/.env.example).');
  }

  function assertWritable(tableId, allowRestricted) {
    if (WRITE_RESTRICTED_TABLE_IDS.has(tableId) && !allowRestricted) {
      throw new Error(
        `Airtable client: writes to table ${tableId} are restricted at this phase of the build ` +
        `(see docs/03-open-decisions-log.md and docs/04-airtable-api-reference.md, "Standing Guardrails"). ` +
        `Pass { allowRestricted: true } to override deliberately once that phase is ready.`
      );
    }
  }

  async function request(method, tableId, subPath = '', { query, body } = {}) {
    const url = new URL(`${API_ROOT}/${baseId}/${tableId}${subPath}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, v));
        } else if (typeof value === 'object') {
          for (const [subKey, subValue] of Object.entries(value)) {
            url.searchParams.set(subKey, subValue);
          }
        } else {
          url.searchParams.set(key, value);
        }
      }
    }

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      const message = (json && json.error && (json.error.message || json.error.type)) || res.statusText;
      const err = new Error(`Airtable API error (${res.status}) on ${method} ${tableId}${subPath}: ${message}`);
      err.status = res.status;
      err.body = json;
      throw err;
    }
    return json;
  }

  return {
    /**
     * List every record in a table, following pagination automatically.
     * @param {string} tableId
     * @param {{fields?: string[], filterByFormula?: string, maxRecords?: number, pageSize?: number, sort?: {field: string, direction?: 'asc'|'desc'}[], view?: string}} [opts]
     */
    async listRecords(tableId, opts = {}) {
      const { fields, filterByFormula, maxRecords, pageSize, sort, view } = opts;
      const sortParams = {};
      if (sort) {
        sort.forEach((s, i) => {
          sortParams[`sort[${i}][field]`] = s.field;
          sortParams[`sort[${i}][direction]`] = s.direction || 'asc';
        });
      }

      const records = [];
      let offset;
      do {
        const page = await request('GET', tableId, '', {
          query: { fields, filterByFormula, maxRecords, pageSize, view, offset, ...sortParams },
        });
        records.push(...(page.records || []));
        offset = page.offset;
      } while (offset);

      return records;
    },

    /** Get a single record by its Airtable record ID (e.g. "recXXXXXXXXXXXXXX"). */
    async getRecord(tableId, recordId) {
      return request('GET', tableId, `/${recordId}`);
    },

    /**
     * Create one record. Refused for write-restricted tables — see the
     * module header — unless { allowRestricted: true } is passed.
     */
    async createRecord(tableId, fields, { allowRestricted = false, typecast = false } = {}) {
      assertWritable(tableId, allowRestricted);
      return request('POST', tableId, '', { body: { fields, typecast } });
    },

    /**
     * Update one record (PATCH semantics — merges the given fields,
     * leaves others untouched). Refused for write-restricted tables
     * unless { allowRestricted: true } is passed.
     */
    async updateRecord(tableId, recordId, fields, { allowRestricted = false, typecast = false } = {}) {
      assertWritable(tableId, allowRestricted);
      return request('PATCH', tableId, `/${recordId}`, { body: { fields, typecast } });
    },
  };
}

module.exports = { createAirtableClient, WRITE_RESTRICTED_TABLE_IDS };
