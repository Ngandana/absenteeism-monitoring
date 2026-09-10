'use strict';

/**
 * server.js
 * -----------------------------------------------------------------------
 * REST API for the Intern Absenteeism Monitoring frontend. Two kinds of
 * routes, clearly separated because they have different guarantees:
 *
 *   /api/reference/*   REAL data, read live from Airtable (Alert
 *                       Recipients, Leave Policies, Absence Rules — the
 *                       only tables with real records right now). This is
 *                       the ONLY place the Airtable API key is used —
 *                       never in the frontend, never in a client-visible
 *                       response.
 *
 *   /api/cases, /api/cycles, /api/exceptions, /api/sync-log
 *                       SAMPLE data (see data/sample-data.js), because
 *                       Interns, Daily Attendance, Alert Cases, and Sync
 *                       and Error Log are still empty in the live base —
 *                       see docs/04-airtable-api-reference.md and
 *                       docs/03-open-decisions-log.md. Swap these for
 *                       real Airtable reads once Phase 3/4 land and those
 *                       tables have live data; the response SHAPES here
 *                       are what the frontend already expects, so that
 *                       swap should not require frontend changes.
 *
 * PATCH endpoints write to an in-memory store only (lost on restart) —
 * Alert Cases isn't a real, write-enabled table yet either. See
 * lib/airtable-client.js's write-restriction guardrail for why.
 *
 * Run: node server.js (defaults to port 4000; set PORT to override).
 * -----------------------------------------------------------------------
 */

const express = require('express');
const cors = require('cors');

const { createAirtableClient } = require('./lib/airtable-client');
const { TABLES } = require('./lib/airtable-tables');
const { CASES, CYCLES, EXCEPTIONS, SYNC_LOG, decorateCase } = require('./data/sample-data');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

// In-memory only — see module header. Keyed by case id / exception id.
const caseEdits = {};
const resolvedExceptions = {};

// ---------------------------------------------------------------------
// Reference data — real, live Airtable reads.
// ---------------------------------------------------------------------

const REFERENCE_TABLES = {
  'alert-recipients': { tableId: TABLES.ALERT_RECIPIENTS, primaryField: 'Recipient Name' },
  'leave-policies': { tableId: TABLES.LEAVE_POLICIES, primaryField: 'Policy Name' },
  'absence-rules': { tableId: TABLES.ABSENCE_RULES, primaryField: 'Rule Name' },
};

let airtableClient = null;
function getAirtableClient() {
  if (!airtableClient) airtableClient = createAirtableClient();
  return airtableClient;
}

app.get('/api/reference/:table', async (req, res) => {
  const entry = REFERENCE_TABLES[req.params.table];
  if (!entry) {
    res.status(404).json({ error: `Unknown reference table "${req.params.table}". Valid: ${Object.keys(REFERENCE_TABLES).join(', ')}` });
    return;
  }
  try {
    const client = getAirtableClient();
    const records = await client.listRecords(entry.tableId);
    res.json({
      table: req.params.table,
      count: records.length,
      records: records.map((r) => ({ id: r.id, primary: r.fields[entry.primaryField] || '(untitled)', fields: r.fields })),
    });
  } catch (err) {
    res.status(502).json({ error: 'Airtable request failed', message: err.message });
  }
});

app.get('/api/reference', (req, res) => {
  res.json({ tables: Object.keys(REFERENCE_TABLES) });
});

// ---------------------------------------------------------------------
// Sample data — Alert Cases, Cycles, Data Quality, Sync log.
// ---------------------------------------------------------------------

app.get('/api/cases', (req, res) => {
  res.json({ sample: true, cases: CASES.map((c) => decorateCase(c, caseEdits)) });
});

app.get('/api/cases/:id', (req, res) => {
  const base = CASES.find((c) => c.id === req.params.id);
  if (!base) {
    res.status(404).json({ error: `No case ${req.params.id}` });
    return;
  }
  res.json({ sample: true, case: decorateCase(base, caseEdits) });
});

app.patch('/api/cases/:id', (req, res) => {
  const base = CASES.find((c) => c.id === req.params.id);
  if (!base) {
    res.status(404).json({ error: `No case ${req.params.id}` });
    return;
  }
  const { status, action, notes } = req.body || {};
  caseEdits[req.params.id] = Object.assign({}, caseEdits[req.params.id], {
    ...(status !== undefined ? { status } : {}),
    ...(action !== undefined ? { action } : {}),
    ...(notes !== undefined ? { notes } : {}),
  });
  res.json({ sample: true, persisted: false, note: 'In-memory only — Alert Cases is not a live, writable table yet.', case: decorateCase(base, caseEdits) });
});

app.get('/api/cycles', (req, res) => {
  res.json({ sample: true, cycles: CYCLES });
});

app.get('/api/exceptions', (req, res) => {
  const exceptions = EXCEPTIONS.map((e) => Object.assign({}, e, { resolved: !!resolvedExceptions[e.id] }));
  res.json({ sample: true, exceptions });
});

app.patch('/api/exceptions/:id/resolve', (req, res) => {
  const exists = EXCEPTIONS.some((e) => e.id === req.params.id);
  if (!exists) {
    res.status(404).json({ error: `No exception ${req.params.id}` });
    return;
  }
  resolvedExceptions[req.params.id] = true;
  res.json({ sample: true, persisted: false, id: req.params.id, resolved: true });
});

app.get('/api/sync-log', (req, res) => {
  res.json({ sample: true, runs: SYNC_LOG });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'absenteeism-monitoring-backend' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
