# State Machine

The Status field on each commitment is an editorial score. The skill uses this state machine to pick a defensible value.

## Values

| Value | Name | Meaning |
|---|---|---|
| `""` or `0` | Not Started | No public action tied to this commitment. |
| `10` | In Progress (default anchor) | First public action: bill introduced, programme launched, policy paper published, budget allocated, consultation opened. |
| `20`–`90` | Intermediate Progress | 10-multiples. The AI must be able to defend the value (e.g., "bill passed second reading, third reading scheduled for Q4" = `50`–`75`). |
| `25`, `33`, `67`, `75` | k-fractions | Used when the commitment has a clear k-step structure. Example: a 3-phase rollout with 1 phase complete = `33`. |
| `100` | Delivered | The 100% picture is now true. |
| `-100` | Failed | Explicitly dropped, replaced, or expired past `Due` with no action. Requires a source. |

## Variance rules

- The default anchor for "in progress" is `10`. Use it unless the AI can defend a more specific value.
- 10-multiples (`20`–`90`) are allowed when the AI can articulate why. The justification goes in `Notes`.
- k-fractions (`25`, `33`, `67`, `75`) are allowed when the commitment has a clear k-step structure. The decomposition is dynamic — the AI does not persist it.
- Decimal values are not allowed.
- Negative values other than `-100` are not allowed. Partial abandonment is expressed as a positive fraction, not a negative score.

## Work backwards from 100%

For each commitment, the AI should first answer: **what would 100% look like for *this specific* commitment?**

- For a bill commitment ("Pass the Regulatory Standards Act"), 100% is Royal Assent.
- For a policy commitment ("Cut health waiting times"), 100% is the policy fully implemented and the targets met.
- For a repeal commitment ("Abolish the Māori Health Authority"), 100% is the authority abolished.
- For a continuous commitment ("Reduce inflation"), 100% is the target reached and sustained.

The AI then picks the state by reading the evidence against this 100% picture. This is why per-commitment typing is not required: the AI infers what 100% means from the commitment's text.

## Failure definition

A commitment is **failed** (`Status = -100`) when:

- The deliverable is no longer being pursued.
- The commitment was explicitly dropped.
- The commitment was replaced with an opposite policy.
- The `Due` date has passed with no public action AND the deliverable is clearly binary (e.g., "repeal X by date Y").

A commitment is **not** failed (`Status = 0` or a positive fraction) when:

- The deliverable is continuous and *some* progress has been made (e.g., "reform X" with 30% implementation = `30`).
- The commitment is binary but has been quietly wound back (use a positive fraction if some sub-deliverables still exist; otherwise `-100`).
- The AI cannot find evidence either way (default to the current Status; surface a `Note:` for human review).

A `-100` row must cite a source in `References` documenting the failure or abandonment. Without a source, the AI does not propose `-100` — it surfaces a `Note:` instead.

## Past-due 0-rows

When a row's `Status` is `""`/`0` and its `Due` date is in the past:

- The AI does not auto-flip to `-100`.
- The AI surfaces a `Note:` in the report: "Row N: due YYYY-MM-DD, no public action found; candidate for -100."
- The user reviews the note and decides whether to flip in a follow-up run (or in the CSV directly).
