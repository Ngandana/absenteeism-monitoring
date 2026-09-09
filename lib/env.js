'use strict';

/**
 * env.js
 * -----------------------------------------------------------------------
 * Minimal, dependency-free .env loader. Airtable and Jibble credentials
 * must never be hard-coded or pasted into chat/commits — this reads them
 * from a local, git-ignored .env file (see config/.env.example for the
 * expected variable names) into process.env at runtime.
 *
 * Looks for, in order (first file wins per variable; a variable already
 * set in the real environment is never overwritten):
 *   1. config/.env
 *   2. .env  (project root)
 *
 * This intentionally does not log or return the parsed values — callers
 * read what they need straight from process.env.
 * -----------------------------------------------------------------------
 */

const fs = require('node:fs');
const path = require('node:path');

const CANDIDATE_PATHS = [
  path.join(__dirname, '..', 'config', '.env'),
  path.join(__dirname, '..', '.env'),
];

function parseEnvFile(content) {
  const result = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

let loaded = false;

/** Idempotent: safe to call from every module that needs env vars. */
function loadEnv() {
  if (loaded) return;
  loaded = true;
  for (const filePath of CANDIDATE_PATHS) {
    if (!fs.existsSync(filePath)) continue;
    const parsed = parseEnvFile(fs.readFileSync(filePath, 'utf8'));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

module.exports = { loadEnv, CANDIDATE_PATHS };
