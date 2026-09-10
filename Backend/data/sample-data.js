'use strict';

/**
 * sample-data.js
 * -----------------------------------------------------------------------
 * Sample data for Alert Cases, Monitoring Cycles, Data Quality exceptions,
 * and the Sync log — transcribed from the Claude Design canvas
 * (`Intern Absenteeism Monitoring Dashboard/Absenteeism Monitoring.dc.html`)
 * so the API and the original design agree on shape and content.
 *
 * This is SAMPLE data, not real records — the live Airtable tables behind
 * these (Interns, Daily Attendance, Alert Cases, Sync and Error Log) are
 * still empty (see docs/04-airtable-api-reference.md) and write-restricted
 * at this phase (see lib/airtable-client.js). Replace this module with
 * real reads once Phase 3/4 (classification engine, rolling-cycle and
 * alerts) are built and those tables have live data.
 *
 * Reference data (Alert Recipients, Leave Policies, Absence Rules) is
 * real and does NOT live here — see routes/reference.js.
 * -----------------------------------------------------------------------
 */

const LEVELS = ['Early Warning', 'Concern', 'Consultation', 'Red Flag'];
const STATUSES = ['New', 'Under Review', 'Action Required', 'Dismissed', 'Closed'];
const ACTIONS = ['No Action', 'Continue Monitoring', 'Management Discussion', 'Schedule Consultation', 'Formal Action Review', 'Other'];

// Mirrors the Absence Rules already built in the live Airtable base (see
// docs/03-open-decisions-log.md, decision #5) — Early Warning/2, Concern/5,
// Consultation/7, Red Flag/10, all Active, all 30-day monitoring period.
const THRESHOLDS = [
  { level: 'Red Flag', min: 10 },
  { level: 'Consultation', min: 7 },
  { level: 'Concern', min: 5 },
  { level: 'Early Warning', min: 2 },
];

const CASES = [
  { id: 'P5-1084', name: 'Aisha Mbeki', dept: 'Design Studio', manager: 'Miss Gabby', status: 'New', opened: '31 Aug 2026', cycle: '2 Aug – 31 Aug 2026',
    dates: [ { date: 'Mon 3 Aug 2026', type: 'Unexcused absence', source: 'JB-88421', counts: true }, { date: 'Mon 17 Aug 2026', type: 'Unexcused absence', source: 'JB-89014', counts: true }, { date: 'Tue 25 Aug 2026', type: 'Late arrival > 4h', source: 'JB-89550', counts: true }, { date: 'Thu 27 Aug 2026', type: 'Approved sick leave', source: 'JB-89601', counts: false } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '31 Aug 2026, 06:10' } ] },
  { id: 'P5-1081', name: 'Thabo Nkosi', dept: 'Operations', manager: 'Miss Candice', status: 'Action Required', opened: '29 Aug 2026', cycle: '31 Jul – 29 Aug 2026',
    dates: [ { date: 'Fri 31 Jul 2026', type: 'Unexcused absence', source: 'JB-87990', counts: true }, { date: 'Mon 3 Aug 2026', type: 'Unexcused absence', source: 'JB-88130', counts: true }, { date: 'Thu 6 Aug 2026', type: 'Unexcused absence', source: 'JB-88301', counts: true }, { date: 'Mon 10 Aug 2026', type: 'Unexcused absence', source: 'JB-88503', counts: true }, { date: 'Wed 12 Aug 2026', type: 'Unexcused absence', source: 'JB-88702', counts: true }, { date: 'Fri 14 Aug 2026', type: 'Approved family responsibility leave', source: 'JB-88880', counts: false }, { date: 'Mon 17 Aug 2026', type: 'Unexcused absence', source: 'JB-89020', counts: true }, { date: 'Wed 19 Aug 2026', type: 'Unexcused absence', source: 'JB-89188', counts: true }, { date: 'Fri 21 Aug 2026', type: 'Unexcused absence', source: 'JB-89310', counts: true }, { date: 'Mon 24 Aug 2026', type: 'Unexcused absence', source: 'JB-89477', counts: true }, { date: 'Wed 26 Aug 2026', type: 'Unexcused absence', source: 'JB-89592', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '29 Aug 2026, 06:08' }, { what: 'Status set to Action Required', who: 'Miss Candice', when: '29 Aug 2026, 11:24' }, { what: 'Evidence reviewed against Jibble export', who: 'Admin rep (N. Dlamini)', when: '30 Aug 2026, 09:02' } ] },
  { id: 'P5-1083', name: 'Yusuf Patel', dept: 'Technology', manager: 'Miss Gabby', status: 'New', opened: '30 Aug 2026', cycle: '1 Aug – 30 Aug 2026',
    dates: [ { date: 'Tue 11 Aug 2026', type: 'Unexcused absence', source: 'JB-88610', counts: true }, { date: 'Wed 26 Aug 2026', type: 'Unexcused absence', source: 'JB-89588', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '30 Aug 2026, 06:07' } ] },
  { id: 'P5-1082', name: 'Anele Jantjies', dept: 'Operations', manager: 'Miss Candice', status: 'Under Review', opened: '29 Aug 2026', cycle: '31 Jul – 29 Aug 2026',
    dates: [ { date: 'Mon 3 Aug 2026', type: 'Unexcused absence', source: 'JB-88124', counts: true }, { date: 'Fri 14 Aug 2026', type: 'Unexcused absence', source: 'JB-88875', counts: true }, { date: 'Wed 26 Aug 2026', type: 'Unexcused absence', source: 'JB-89590', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '29 Aug 2026, 06:08' }, { what: 'Status set to Under Review', who: 'Miss Candice', when: '29 Aug 2026, 15:02' } ] },
  { id: 'P5-1079', name: 'Bongi Zulu', dept: 'Client Services', manager: 'Miss Candice', status: 'Under Review', opened: '28 Aug 2026', cycle: '30 Jul – 28 Aug 2026',
    dates: [ { date: 'Thu 6 Aug 2026', type: 'Unexcused absence', source: 'JB-88298', counts: true }, { date: 'Tue 25 Aug 2026', type: 'Late arrival > 4h', source: 'JB-89556', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '28 Aug 2026, 06:06' }, { what: 'Status set to Under Review', who: 'Miss Gabby', when: '28 Aug 2026, 10:18' } ] },
  { id: 'P5-1078', name: 'Lerato Sithole', dept: 'Client Services', manager: 'Miss Gabby', status: 'Under Review', opened: '27 Aug 2026', cycle: '29 Jul – 27 Aug 2026',
    dates: [ { date: 'Thu 6 Aug 2026', type: 'Unexcused absence', source: 'JB-88290', counts: true }, { date: 'Thu 20 Aug 2026', type: 'Unexcused absence', source: 'JB-89240', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '27 Aug 2026, 06:07' }, { what: 'Status set to Under Review', who: 'Miss Gabby', when: '27 Aug 2026, 14:40' } ] },
  { id: 'P5-1075', name: 'Sipho Radebe', dept: 'Finance', manager: 'Miss Candice', status: 'Under Review', opened: '24 Aug 2026', cycle: '26 Jul – 24 Aug 2026',
    dates: [ { date: 'Tue 28 Jul 2026', type: 'Unexcused absence', source: 'JB-87720', counts: true }, { date: 'Wed 5 Aug 2026', type: 'Unexcused absence', source: 'JB-88210', counts: true }, { date: 'Fri 14 Aug 2026', type: 'Unexcused absence', source: 'JB-88870', counts: true }, { date: 'Fri 21 Aug 2026', type: 'Late arrival > 4h', source: 'JB-89302', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '24 Aug 2026, 06:09' }, { what: 'Status set to Under Review', who: 'Miss Candice', when: '25 Aug 2026, 08:55' } ] },
  { id: 'P5-1071', name: 'Naledi Khumalo', dept: 'Design Studio', manager: 'Miss Gabby', status: 'New', opened: '22 Aug 2026', cycle: '24 Jul – 22 Aug 2026',
    dates: [ { date: 'Mon 27 Jul 2026', type: 'Unexcused absence', source: 'JB-87680', counts: true }, { date: 'Mon 18 Aug 2026', type: 'Unexcused absence', source: 'JB-89100', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '22 Aug 2026, 06:06' } ] },
  { id: 'P5-1066', name: 'Kabelo Mahlangu', dept: 'Operations', manager: 'Miss Candice', status: 'Action Required', opened: '18 Aug 2026', cycle: '20 Jul – 18 Aug 2026',
    dates: [ { date: 'Wed 22 Jul 2026', type: 'Unexcused absence', source: 'JB-87410', counts: true }, { date: 'Tue 28 Jul 2026', type: 'Unexcused absence', source: 'JB-87740', counts: true }, { date: 'Thu 6 Aug 2026', type: 'Unexcused absence', source: 'JB-88295', counts: true }, { date: 'Wed 12 Aug 2026', type: 'Unexcused absence', source: 'JB-88710', counts: true }, { date: 'Mon 17 Aug 2026', type: 'Unexcused absence', source: 'JB-89022', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '18 Aug 2026, 06:11' }, { what: 'Status set to Action Required', who: 'Miss Candice', when: '19 Aug 2026, 10:12' } ] },
  { id: 'P5-1060', name: 'Zanele Botha', dept: 'Client Services', manager: 'Miss Gabby', status: 'Under Review', opened: '14 Aug 2026', cycle: '16 Jul – 14 Aug 2026',
    dates: [ { date: 'Thu 16 Jul 2026', type: 'Unexcused absence', source: 'JB-87050', counts: true }, { date: 'Mon 20 Jul 2026', type: 'Unexcused absence', source: 'JB-87322', counts: true }, { date: 'Thu 23 Jul 2026', type: 'Unexcused absence', source: 'JB-87480', counts: true }, { date: 'Tue 28 Jul 2026', type: 'Unexcused absence', source: 'JB-87735', counts: true }, { date: 'Mon 3 Aug 2026', type: 'Unexcused absence', source: 'JB-88118', counts: true }, { date: 'Wed 5 Aug 2026', type: 'Public holiday', source: 'JB-88205', counts: false }, { date: 'Tue 11 Aug 2026', type: 'Unexcused absence', source: 'JB-88602', counts: true }, { date: 'Thu 13 Aug 2026', type: 'Unexcused absence', source: 'JB-88790', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '14 Aug 2026, 06:05' }, { what: 'Status set to Under Review', who: 'Miss Gabby', when: '14 Aug 2026, 16:31' } ] },
  { id: 'P5-1052', name: 'Farai Moyo', dept: 'Technology', manager: 'Miss Candice', status: 'Closed', opened: '9 Aug 2026', cycle: '11 Jul – 9 Aug 2026',
    dates: [ { date: 'Mon 13 Jul 2026', type: 'Unexcused absence', source: 'JB-86780', counts: true }, { date: 'Tue 21 Jul 2026', type: 'Unexcused absence', source: 'JB-87360', counts: true }, { date: 'Wed 5 Aug 2026', type: 'Unexcused absence', source: 'JB-88220', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '9 Aug 2026, 06:09' }, { what: 'Management discussion held; decision recorded', who: 'Miss Candice', when: '12 Aug 2026, 09:45' }, { what: 'Case closed', who: 'Miss Candice', when: '12 Aug 2026, 09:47' } ] },
  { id: 'P5-1049', name: 'Ruth Adeyemi', dept: 'Technology', manager: 'Miss Gabby', status: 'Dismissed', opened: '6 Aug 2026', cycle: '8 Jul – 6 Aug 2026',
    dates: [ { date: 'Thu 16 Jul 2026', type: 'Unexcused absence', source: 'JB-87055', counts: true }, { date: 'Mon 3 Aug 2026', type: 'Unexcused absence', source: 'JB-88120', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '6 Aug 2026, 06:07' }, { what: 'Dismissed — both dates covered by retroactive leave approval', who: 'Admin rep (N. Dlamini)', when: '7 Aug 2026, 08:20' } ] },
  { id: 'P5-1044', name: 'Mpho Dube', dept: 'Finance', manager: 'Miss Candice', status: 'Action Required', opened: '3 Aug 2026', cycle: '5 Jul – 3 Aug 2026',
    dates: [ { date: 'Tue 7 Jul 2026', type: 'Unexcused absence', source: 'JB-86420', counts: true }, { date: 'Mon 13 Jul 2026', type: 'Unexcused absence', source: 'JB-86790', counts: true }, { date: 'Fri 24 Jul 2026', type: 'Unexcused absence', source: 'JB-87510', counts: true }, { date: 'Fri 31 Jul 2026', type: 'Late arrival > 4h', source: 'JB-87995', counts: true } ],
    history: [ { what: 'Case opened automatically by rule engine', who: 'System', when: '3 Aug 2026, 06:10' }, { what: 'Status set to Action Required', who: 'Miss Candice', when: '4 Aug 2026, 13:05' } ] },
];

const CYCLES = [
  { label: 'Mar–Apr', value: 14 }, { label: 'Apr–May', value: 19 }, { label: 'May–Jun', value: 16 },
  { label: 'Jun–Jul', value: 22 }, { label: 'Jul–Aug', value: 26 }, { label: 'Aug–Sep', value: 21 },
];

const EXCEPTIONS = [
  { id: 'AT-rec9182', name: 'Kabelo Mahlangu', date: '26 Aug 2026', issue: 'Clock-in without matching clock-out', state: 'Pending Review' },
  { id: 'AT-rec9174', name: 'Unmatched intern ID (JB-4471)', date: '25 Aug 2026', issue: 'No Airtable intern record for Jibble ID', state: 'Data Error' },
  { id: 'AT-rec9160', name: 'Lerato Sithole', date: '23 Aug 2026', issue: 'Absence type field empty', state: 'Pending Review' },
  { id: 'AT-rec9143', name: 'Sipho Radebe', date: '21 Aug 2026', issue: 'Duplicate record from re-run', state: 'Data Error' },
  { id: 'AT-rec9128', name: 'Naledi Khumalo', date: '19 Aug 2026', issue: 'Leave approval received after classification', state: 'Pending Review' },
];

const SYNC_LOG = [
  { run: '2 Sep 2026, 06:05', source: 'Jibble → Airtable', records: 412, result: 'Completed with warnings', detail: '2 records could not be classified', ok: true, retry: 'Not required' },
  { run: '1 Sep 2026, 06:05', source: 'Jibble → Airtable', records: 408, result: 'Completed', detail: 'No exceptions', ok: true, retry: '—' },
  { run: '31 Aug 2026, 06:05', source: 'Jibble → Airtable', records: 0, result: 'Failed', detail: 'API rate limit (429) at page 3 of 5', ok: false, retry: 'Retried 06:35 — succeeded' },
  { run: '30 Aug 2026, 06:05', source: 'Jibble → Airtable', records: 399, result: 'Completed', detail: 'No exceptions', ok: true, retry: '—' },
  { run: '29 Aug 2026, 06:05', source: 'Jibble → Airtable', records: 401, result: 'Completed with warnings', detail: '1 duplicate record quarantined', ok: true, retry: 'Not required' },
];

function levelFor(count) {
  const hit = THRESHOLDS.find((t) => count >= t.min);
  return hit ? hit.level : 'Early Warning';
}

/** A case decorated with its derived count/level/rule — mirrors the design canvas's merged(). */
function decorateCase(c, edits) {
  const e = (edits && edits[c.id]) || {};
  const count = c.dates.filter((d) => d.counts).length;
  const rule = (THRESHOLDS.find((t) => count >= t.min) || THRESHOLDS[3]).min + ' qualifying absences in 30 days';
  return Object.assign({}, c, { count, level: levelFor(count), rule }, e);
}

module.exports = { LEVELS, STATUSES, ACTIONS, THRESHOLDS, CASES, CYCLES, EXCEPTIONS, SYNC_LOG, levelFor, decorateCase };
