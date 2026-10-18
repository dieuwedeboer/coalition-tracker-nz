---
name: update-coalition-tracker
description: |
  Update the coalition commitment tracker with the latest publicly available
  evidence. Use this skill when the user wants to research the current status
  of coalition commitments, refresh the canonical CSV, re-check delivered
  commitments, or run the periodic research loop.
---

# update-coalition-tracker

## When to use

Invoke this skill when the user asks to:

- "Update the coalition tracker"
- "Run the research loop"
- "Research the current status of commitments"
- "Refresh the data"
- "Re-check the delivered commitments" (full re-check mode)
- Or any equivalent request to bring the canonical CSV in line with current public evidence.

The user is the final reviewer. This skill edits the CSV and writes a report; the user reviews the diff and commits.

## Inputs

- `src/data/data.csv`: the canonical commitments dataset (ADR 0001). Read this first.
- `CONTEXT.md`: the domain glossary. Use its terms in the report.
- The current date: used for the report filename and the "as at" date in `Notes`. It is **not** written to `Updated` (ADR 0002).
- The user's intent, inferred from the request. Choose a mode:
  - **Standard** (default): research every row whose Status is not `100` or `-100`.
  - **Full re-check**: research every row, including `100` and `-100`. Use when the user asks to re-check delivered or failed commitments, or when the last full re-check was more than 6 months ago (ask first in that case).
  - **Filtered**: a party, category, or single row named by the user.

## Row numbering

"Row N" means the N-th data row of the CSV, counting from 1 and excluding the header. So Row 1 is CSV line 2. Row numbers change when rows are added or reordered, so every reference to a row in a report must also quote the start of the commitment text.

## Procedure

1. Read `src/data/data.csv` and parse it with a real CSV parser. Quoted fields contain commas.
2. Read `.agents/skills/update-coalition-tracker/state.json` if it exists. See *Resume*.
3. Hash the CSV and store the hash in `state.json`, or compare it with the stored hash.
4. Select the eligible rows for the mode. In standard mode, count rows at `100` and `-100` as excluded without researching them.
5. Research the eligible rows in batches. See *Batching*.
6. Apply each batch's changes to the CSV and atomically write `state.json`.
7. When every eligible row has been processed:
   - Run `node .agents/skills/update-coalition-tracker/scripts/validate.mjs` and fix every error it reports.
   - Run `npm run build` and confirm it succeeds.
   - Write the report to `docs/research-runs/YYYY-MM-DD.md` (see `reference/output-format.md`).
   - Delete `state.json`.

## Per-row protocol

1. **Anchor on the current `Status`.** It is the result of earlier runs and human review. You may disagree with it, but you must justify any change.
2. **Define 100% for this commitment.** Read the commitment's exact wording, including its verb ("investigate", "take advice on", "introduce", "support to select committee", "repeal", "maintain"). The verb decides what full delivery looks like. See `reference/state-machine.md`.
3. **Research.** Follow `reference/source-tiers.md`: start with the primary-record searches. If there is no press release or bill, escalate to implementation evidence. The budget is set out in *Search budget*.
4. **Decide the Status** using `reference/state-machine.md`.
5. **Set `Updated`** to the date of the event that justifies the Status (ADR 0002):
   - `100`: the date the commitment was delivered. That means in force, operational, or open to the public, not the date it was announced or legislated.
   - `-100`: the date the failure became public.
   - In progress: the date of the latest concrete advance cited in `References`.
   - `0`/empty: leave unchanged.
   - Use `DD/MM/YYYY` format. Never write ISO dates into the CSV, because the app parses `DD/MM/YYYY`.
   - If the Status is unchanged but the existing `Updated` is not the date of the event (for example, an earlier research-run date or the 27/11/2023 bulk-import date), correct it. Report the correction under *Date corrections*.
6. **Set `References`** to the single URL that best supports the current Status. It is required for any Status above 0 and for `-100`. Prefer a primary record over news coverage (see the tiers).
7. **Rewrite `Notes`** as a current-state summary of no more than 600 characters. Put the newest evidence first and start with "As at DD/MM/YYYY:". Replace stale figures; don't append to them. Keep earlier context only where it explains the Status. Leave `Notes` unchanged if nothing changed for the row.
8. **Leave the row alone and add a report note instead** when the evidence is ambiguous, two primary records conflict, or the budget runs out. See *Edge cases*.

## Batching

Process the rows in batches of about 10, giving each batch to its own subagent. This is how context is managed. Don't try to "forget" research inside one long context.

- Give each subagent:
  - the batch rows (row number, full row contents);
  - the current date and the mode;
  - instructions to read this file and the four `reference/` files.
- Each subagent returns, for each row, one compact record:
  - `row`, `commitment` (first 80 characters)
  - `action`: `change` | `note` | `none`
  - `status`, `updated`, `references`, `notes`
  - `reasoning` (2–3 sentences)
  - `date_correction` (true if only `Updated` changed).
- The parent agent then:
  - checks that each record's `commitment` matches the CSV row;
  - opens each new `100` and `-100` reference URL to confirm it supports the claim;
  - applies the edits;
  - emits one line per changed row (for example, "Row 42: 10 → 50, bill reported back 18/06/2026");
  - writes `state.json`.
- If subagents are not available, process one row at a time. Keep only that one-line summary per row in your working notes.

## Search budget per row

- Base: 3 searches and 2 page reads.
- Escalation: up to 3 more searches and 2 more page reads when any of these applies:
  - the base searches find no primary record dated since `Updated`;
  - the commitment is about operation or implementation rather than legislation;
  - the evidence points to a delay, a quiet change, or a failure.

If the budget runs out before you reach a confident decision, don't modify the row. Add a report note and continue.

## Edge cases

- **Past-due 0-row.** If a row's Status is empty or `0`, its `Due` date has passed, and no action is found, don't flip it to `-100`. Add a report note. That flip is always the user's decision.
- **Delayed, not abandoned.** If a minister says something will happen "next term" or later, that is not a failure. Keep the current Status and add a report note.
- **Narrow wording.** Score the commitment's literal deliverable. "Support to select committee" is complete once the select committee stage is finished, even if the bill later fails. If the literal reading gives a result the user might dispute, apply it and flag it in the report's reasoning.
- **Ambiguous commitment or possible terminology mismatch.** Add a report note rather than guess.
- **Source conflict.** Primary records beat news. If two primary records conflict, add a report note.
- **Quiet walkaway.** A commitment that was wound back or partly delivered under another name scores a positive fraction. `-100` is only for an explicitly dropped commitment, a binary deliverable replaced by the opposite policy, or a documented failure. See `reference/state-machine.md`.
- **Prior `100` in full re-check mode.** Downgrade only if a primary record, or two independent news outlets, show the 100% picture is not true. One example is a numeric target that was officially missed. If one limb of the commitment is still unfinished but no one disputes the delivery, keep `100` and flag it in the report.
- **The same commitment in more than one agreement.** Some commitments appear as separate rows for different parties, with identical text. Research them once and give every copy the same `Status`, `Updated`, `References` and `Notes`. The validator warns when the copies differ.
- **CSV schema drift.** If a column was added, renamed or removed, the hash will not match. Treat the run as a fresh run.

## Resume

Resume uses `.agents/skills/update-coalition-tracker/state.json`, which is gitignored:

```json
{
  "csv_hash_at_start": "<sha256 of data.csv when the run started>",
  "csv_hash_current": "<sha256 after the last applied batch>",
  "mode": "standard",
  "started": "DD/MM/YYYY",
  "last_processed": { "row_number": 40, "commitment": "<exact text>", "action": "change" },
  "pending_notes": [ { "row": 21, "commitment": "...", "note": "..." } ],
  "pending_changes": [ { "row": 14, "commitment": "...", "from": "0", "to": "50", "references": "...", "reasoning": "..." } ]
}
```

- At the start of a run, read `state.json` if it exists.
- If the current CSV hash matches `csv_hash_current` and the CSV row at `last_processed.row_number` has the same commitment text, this is a **resume**. Continue from the next row and carry over `pending_notes` and `pending_changes`, which feed the report.
- Otherwise the CSV was edited between runs. Start a fresh run, overwrite `state.json`, and record the hash mismatch in the report header.
- Write the file atomically after each batch: write to `state.json.tmp`, then rename it.

## Output

- `src/data/data.csv`, edited in place. Its git diff is the primary audit trail.
- `docs/research-runs/YYYY-MM-DD.md`. The report explains *why* each change was made. See `reference/output-format.md`.

## References

- `reference/state-machine.md`: Status values, the meaning of 100% for each kind of commitment, and the failure definition
- `reference/source-tiers.md`: source tiers, implementation evidence, and the escalation search strategy
- `reference/output-format.md`: the CSV rules and the report format
- `reference/reasoning-examples.md`: worked examples taken from earlier runs
- `scripts/validate.mjs`: the data validator to run before the build
