'use strict';

/**
 * load-fixtures.js
 * -----------------------------------------------------------------------
 * Shared helper for the offline test suite. Reads every *.json file in
 * tests/fixtures/ (see tests/fixtures/README.md for the schema) and
 * returns them as { file, data } objects, sorted by filename so scenario
 * order stays predictable (01-... through 08-...).
 * -----------------------------------------------------------------------
 */

const fs = require('node:fs');
const path = require('node:path');

const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures');

function loadFixtures() {
  return fs
    .readdirSync(FIXTURES_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((file) => ({
      file,
      data: JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, file), 'utf8')),
    }));
}

/** Load a single fixture by its filename (e.g. '04-qualifying-absence.json'). */
function loadFixture(file) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, file), 'utf8'));
}

module.exports = { FIXTURES_DIR, loadFixtures, loadFixture };
