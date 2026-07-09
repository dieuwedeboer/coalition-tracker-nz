---
name: update-coalition-tracker
description: |
  Update the coalition commitment tracker with the latest publicly available
  evidence. Use this skill when the user wants to research the current status
  of coalition commitments, refresh the canonical CSV, or run the periodic
  research loop.
---

# update-coalition-tracker

## When to use

Invoke this skill when the user asks to:

- "Update the coalition tracker"
- "Run the research loop"
- "Research the current status of commitments"
- "Refresh the data"
- Or any equivalent request to bring the canonical CSV in line with current public evidence.

The user is the final reviewer. This skill proposes changes; the user commits.

## Inputs

- `src/data/data.csv` — the canonical commitments dataset. Read this first.
- The current date — used for the `Updated` field on changed rows and the markdown report filename.
- The user's intent — full run, party filter, single-row check, etc. Infer from the request.

## Procedure

1. Read `src/data/data.csv`. Parse each row.
2. Read `.agent/skills/update-coalition-tracker/state.json` (if it exists) to determine whether this is a fresh run or a resume. See the *Resume* section.
3. Hash the CSV. Store in `state.json` (or compare to existing `state.json`).
4. For each row from the resume point (or row 1 if fresh):
   - If `Status` is `100` or `-100`, skip. Increment the `100` or `-100` exclusion count.
   - Otherwise, run per-row research (see below).
5. After all eligible rows are processed, write the markdown report to `docs/research-runs/YYYY-MM-DD.md` and delete `state.json`.

## Per-row protocol

For each eligible row:

1. **Anchor on the current `Status`** — it's the result of prior iteration; the AI may agree or disagree, but must justify any change in the `Notes` field.
2. **Define "100%" for this commitment** — what would full delivery look like? Royal Assent for a bill, full implementation for a policy, the binary event for a repeal, etc. Work backwards from this when picking intermediate values.
3. **Search authoritative sources** for evidence of progress since the `Updated` date (or since coalition formation, if `Updated` is empty). Budget: 2–3 web searches, 1–2 page reads. See `reference/source-tiers.md` for the tier rules.
4. **Decide the new status** using the state machine in `reference/state-machine.md`:
   - `""` (empty) or `0` — no public action tied to this commitment.
   - `10` — first public action (bill introduced, programme launched, policy paper published, budget allocated, consultation opened).
   - `20`–`90` in 10-multiples — intermediate progress (e.g., legislative halfway, partial implementation). The AI must be able to defend the value.
   - `25`, `33`, `67`, `75` — k-fractions, used when the commitment has a clear k-step structure (e.g., 3 of 4 phases complete = `75`).
   - `100` — fully delivered. The 100% picture is now true.
   - `-100` — failed, abandoned, replaced, or expired past the `Due` date. Requires a source documenting the failure.
5. **Edit the row in place** in `src/data/data.csv`:
   - Update `Status` to the new value (omit if `""`).
   - Set `Updated` to the current date (only if the row actually changed; do not bump for "no change" rows).
   - Set `References` to the new source URL (required for any `Status > 0` and any `-100`).
   - Append to `Notes` a 1–2 sentence summary of the change or current state.
6. **Atomic-write `state.json`** with the new `last_processed` entry. The `commitment` field should match the current row's text exactly, so the state can be validated on resume.
7. **Discard the row's research from your context**. Move to the next row.

## Context management

The procedure must process many rows in sequence. To avoid context bloat:

- After editing a row, emit a one-line summary (e.g., "Row 42: 10 → 50 — bill passed second reading 2026-06-18").
- Do not retain search results, page content, or intermediate reasoning for prior rows.
- If a fact is critical for a later row, encode it in the row's `Notes` field before moving on.

## Search budget per row

- 2–3 web searches
- 1–2 page reads
- 1 synthesis call (the final status decision)

If the budget is exhausted before a confident decision:

- Do not modify the row in the CSV.
- Emit a `Note:` in the markdown report for that row (see `reference/output-format.md`).
- Update `state.json` with `action: "noted"` and move on.

## Edge cases

- **Past-due `0`-row**: If a row's `Status` is `""`/`0` and its `Due` date is in the past, do not auto-flip to `-100`. Surface as a `Note:` in the report for human review. The flip to `-100` is always a human decision.
- **Ambiguous commitment**: If the commitment text is unclear or could be interpreted multiple ways, emit a `Note:` rather than guess. The user can clarify in a follow-up run.
- **Source tier conflict**: If a Tier 1 source disagrees with a Tier 2 source, defer to Tier 1. If two Tier 1 sources disagree, surface a `Note:`.
- **Quiet walkaway**: A commitment that was "wound back" or partially delivered under a different name is typically a positive fraction (e.g., `33` if 1 of 3 sub-deliverables delivered) rather than `-100`. The `-100` is for binary deliverables that didn't happen, or for explicit abandonment. See `reference/state-machine.md` for the failure definition.
- **CSV schema drift**: If a column is added/renamed/removed since the last run, the CSV hash will not match `state.json`. Treat as a fresh run and proceed.

## Resume

The skill supports resume via `.agent/skills/update-coalition-tracker/state.json`:

- At run start, read `state.json` if it exists.
- If `csv_hash_at_start` matches the current CSV hash, this is a **resume** — start from `last_processed.row_number + 1`.
- If the hash doesn't match, the CSV was edited between runs — treat as a fresh run, log a warning in the markdown report, and overwrite `state.json` with the new hash.
- The state file is atomic-written (write to `.tmp`, rename) after each row.
- The state file is deleted when the run completes successfully.

If a partial run is interrupted, the next invocation resumes from the last atomic write. Manual edits to the CSV between runs (which would change the hash) cause a fresh run — the user should expect to re-review from row 1 in that case.

## Output

After processing all eligible rows, write `docs/research-runs/YYYY-MM-DD.md`. See `reference/output-format.md` for the full spec. The report contains:

- Header with counts: rows reviewed, excluded (Status=100), excluded (Status=-100), proposed changes, notes/unable to verify.
- A `## Proposed changes` section with one entry per modified row.
- A `## Notes` section with one entry per row that the AI flagged but did not modify (past-due, ambiguous, search failures, etc.).

The git diff of `src/data/data.csv` is the primary audit trail. The markdown report is the secondary trail — it explains *why* the changes were made, which a CSV diff alone cannot show.

## References

- `reference/state-machine.md` — Status values, variance rules, failure definition
- `reference/source-tiers.md` — Authoritative source list (beehive, parliament, news, etc.)
- `reference/output-format.md` — Markdown report format
- `reference/reasoning-examples.md` — Worked examples of good vs. bad reasoning
