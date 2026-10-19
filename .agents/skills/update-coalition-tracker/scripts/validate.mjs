import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(resolve('package.json'));
const Papa = require('papaparse');

const path = process.argv[2] ?? 'src/data/data.csv';
const allowed = new Set(['', '0', '10', '20', '25', '30', '33', '40', '50', '60', '67', '70', '75', '80', '90', '100', '-1']);
const expected = ['Category', 'Commitment', 'Party', 'Status', 'Updated', 'Due', 'References', 'Tags', 'LobbyFor', 'LobbyAgainst', 'Notes'];
const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const earliest = new Date(2023, 9, 14);
const today = new Date();

const isValidDate = (value) => {
  const match = datePattern.exec(value);
  if (!match) return false;
  const [, d, m, y] = match.map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

const toDate = (value) => {
  const [d, m, y] = value.split('/').map(Number);
  return new Date(y, m - 1, d);
};

const { data, errors: parseErrors, meta } = Papa.parse(readFileSync(path, 'utf8'), { header: true, skipEmptyLines: true });
const errors = parseErrors.map((e) => `Parse error at row ${e.row}: ${e.message}`);
const warnings = [];

if (meta.fields.join(',') !== expected.join(',')) {
  errors.push(`Header mismatch: expected ${expected.join(',')}, got ${meta.fields.join(',')}`);
}

const seen = new Map();
data.forEach((row, index) => {
  const label = `Row ${index + 1} ("${(row.Commitment ?? '').slice(0, 60)}")`;
  const status = (row.Status ?? '').trim();
  const references = (row.References ?? '').trim();

  if (!row.Commitment?.trim()) errors.push(`${label}: empty Commitment`);
  const twin = seen.get(row.Commitment);
  if (twin && twin.party === row.Party) errors.push(`${label}: duplicate of row ${twin.index}`);
  if (twin && twin.party !== row.Party && (twin.status !== status || twin.updated !== row.Updated)) {
    warnings.push(`${label}: same commitment as row ${twin.index} (${twin.party}) but Status/Updated differ (${status} ${row.Updated} vs ${twin.status} ${twin.updated})`);
  }
  if (!twin) seen.set(row.Commitment, { index: index + 1, party: row.Party, status, updated: row.Updated });

  if (!allowed.has(status)) errors.push(`${label}: Status "${status}" is not an allowed value`);

  if ((Number(status) > 0 || status === '-1') && !/^https?:\/\/\S+$/.test(references)) {
    errors.push(`${label}: Status ${status} requires a single URL in References`);
  }

  for (const field of ['Updated', 'Due']) {
    const value = (row[field] ?? '').trim();
    if (!value) continue;
    if (!isValidDate(value)) {
      errors.push(`${label}: ${field} "${value}" is not a valid DD/MM/YYYY date`);
      continue;
    }
    if (field === 'Updated') {
      const date = toDate(value);
      if (date > today) errors.push(`${label}: Updated ${value} is in the future`);
      if (date < earliest) errors.push(`${label}: Updated ${value} is before the 2023 election`);
    }
  }

  if (status === '100' && !(row.Updated ?? '').trim()) errors.push(`${label}: Status 100 requires an Updated delivery date`);
  if ((row.Notes ?? '').length > 600) warnings.push(`${label}: Notes is ${row.Notes.length} characters (limit 600 for new edits)`);
});

warnings.forEach((w) => console.warn(`warning: ${w}`));
errors.forEach((e) => console.error(`error: ${e}`));
console.log(`${data.length} rows checked: ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
