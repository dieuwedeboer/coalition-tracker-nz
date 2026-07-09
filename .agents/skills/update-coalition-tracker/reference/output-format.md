# Output Format

The skill writes to two places: `src/data/data.csv` (in place) and `docs/research-runs/YYYY-MM-DD.md` (new file per run).

## The CSV

The CSV is modified in place. The skill:

- Updates `Status` to the new value (or leaves it unchanged).
- Updates `Updated` to the current date **only if the row changed**.
- Updates `References` to the new source URL (required for any `Status > 0` and any `-100`).
- Appends to `Notes` a 1–2 sentence summary of the change or current state.

The git diff of `src/data/data.csv` is the primary audit trail.

## The markdown report

Filename: `docs/research-runs/YYYY-MM-DD.md` (one per run, overwrites if same day).

### Structure

```markdown
# Research run — YYYY-MM-DD

- Reviewed: N rows
  - Excluded (Status=100): N1
  - Excluded (Status=-100): N2
  - Proposed changes: N3
  - Notes / unable to verify: N4
- Resumed from row N5 (only present if a resume happened)
- CSV hash mismatch — fresh run started (only present if the CSV changed since the last run)

## Proposed changes

### Row 42 — "Restore law and order by backing Police to tackle gangs..."
- **Status**: 10 → 50
- **References**: https://www.beehive.govt.nz/release/...
- **Reasoning**: Gang Legislation Amendment Bill passed second reading 2026-06-18. Substantive legislative progress; 100% would require Royal Assent and implementation.

### Row 87 — "Abolish the Resource Management Act"
- **Status**: 0 → -100
- **References**: https://www.rnz.co.nz/...
- **Reasoning**: Government confirmed in Cabinet Paper 2026-04-08 that RMA replacement is the priority, with the original commitment quietly shelved. No further action on abolition since 2024.

## Notes

### Row 19 — "Commit to moderate increases to the minimum wage every year."
- **Note**: 33% retained. The 2024 and 2025 minimum wage increases were implemented, but the 2026 increase has not yet been announced. Awaiting further evidence.

### Row 33 — "Commit to building a four-lane highway alternative for the Brynderwyns..."
- **Note**: Due 2024-12-31 has passed; no public action found. Candidate for -100, awaiting human review.

### Row 107 — "End all Covid-19 vaccine mandates still in operation."
- **Note**: Search returned no relevant results. The commitment text may be a terminology mismatch with the current Cabinet paper language. Awaiting user clarification.
```

### Rules

- **Counts only for excluded rows**. The `Excluded (Status=100)` and `Excluded (Status=-100)` lines are counts only, no per-row listing.
- **No "verified, no change" section**. If a row was reviewed and the AI found no change to propose, it is silent. Its absence from the report is the signal.
- **`Notes` is for flags, not for verified-no-change**. A row appears in `Notes` only if the AI has something to flag (past-due candidate, ambiguous commitment, search failure, etc.).
- **Each entry in `Proposed changes` should be reviewable in 30 seconds**. Reasoning is 2–3 sentences max. Source is a single URL.
- **Confidence is not in the report** — the user can tell from the reasoning whether the AI was sure or hedging.
