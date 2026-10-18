# Output Format

Each run writes to two places:

- `src/data/data.csv`, edited in place;
- `docs/research-runs/YYYY-MM-DD.md`, a new report for the run.

## The CSV

Edit the CSV in place. Write it back with RFC 4180 quoting (quote any field that contains a comma, a quote or a newline), and keep the existing column order and line endings.

| Column | Rule |
|---|---|
| `Status` | Use a value allowed by `state-machine.md`. Leave the cell empty for "not started" rows that are already empty. |
| `Updated` | The date of the event that justifies the Status: the delivery date for `100` rows (ADR 0002). Use `DD/MM/YYYY`. |
| `References` | One URL. Required for any Status above 0 and for `-100`. |
| `Notes` | A current-state summary of no more than 600 characters, starting "As at DD/MM/YYYY:". Replace stale content instead of appending to it. |

Leave all other columns unchanged.

After editing, run `node .agents/skills/update-coalition-tracker/scripts/validate.mjs`. It must report no errors.

## The report

Filename: `docs/research-runs/YYYY-MM-DD.md`. There is one report per run, and a second run on the same day overwrites it.

### Structure

The bracketed values are placeholders. Every row heading quotes the start of the commitment text, because row numbers change over time.

```markdown
# Research run: YYYY-MM-DD

- Mode: standard | full re-check | filtered (<filter>)
- Rows in CSV: <total>
- Researched: <eligible rows actually researched>
  - Excluded (Status=100): <n>    ← standard mode only
  - Excluded (Status=-100): <n>   ← standard mode only
  - Status changes: <n>
  - Date corrections: <n>
  - Notes for review: <n>
- Resumed from row <n>            ← only if this run resumed
- CSV hash mismatch: fresh run    ← only if the CSV changed since the last run
- Validator: passed; build: passed

## Status changes

### Row <n>: "<first ~80 characters of commitment>"
- **Status**: <old> → <new>
- **Updated**: <old> → <new>
- **References**: <url>
- **Reasoning**: <2–3 sentences: what 100% means here, what the evidence shows, why this value and not the next one up>

## Date corrections

### Row <n>: "<commitment>"
- **Updated**: <old> → <new>
- **References**: <url>
- **Reasoning**: <one sentence: what happened on the new date>

## Notes for review

### Row <n>: "<commitment>"
- **Note**: <what is unresolved and what decision the user needs to make>
```

### Rules

- **"Researched" is the number of rows you actually researched in this run.** "Rows in CSV" is the size of the whole dataset. Don't mix the two.
- **Excluded rows are counts only.** Don't list them row by row.
- **A row you verified with no change does not appear in the report.** Leaving it out is the signal.
- **Notes for review are for flags only.** Typical flags are:
  - a past-due candidate for `-100`;
  - an ambiguous commitment or a terminology mismatch;
  - conflicting primary records;
  - a budget that ran out;
  - a narrow-wording call the user may dispute;
  - a prior `100` with one limb still unfinished.
- **Each entry should take about 30 seconds to review.** Reasoning is 2–3 sentences, with one URL.
- **Don't add confidence scores.** Hedged reasoning shows uncertainty on its own.
