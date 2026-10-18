# Reasoning Examples

These are worked examples from earlier research runs. The report each one comes from is given in brackets. The facts are as recorded at the time and have not been re-checked since, so use the examples to learn the *reasoning*. Don't cite them as evidence for the current status of a row.

Every example follows the same pattern:
1. Anchor on the current Status.
2. Write down what 100% means for this commitment's verb.
3. Compare the evidence against that.
4. Choose the value, and explain why it isn't the next value up.

## 1. Narrow wording: score the literal deliverable

**Commitment**: "Support to select committee a bill that would enact a binding referendum on a four-year term of parliament." Current Status `20`. [2026-08-15]

**What 100% means**: The commitment is limited to supporting the bill through the select committee stage. It is not a promise to pass the bill or hold a referendum.

**Evidence**: The bill had its first reading on 05/03/2025, and the select committee reported back in August 2025. In February 2026, 1News reported that the minister would not take the bill to second reading this term.

**Decision**: The literal deliverable appears to be met, but an earlier human review held the row at `20`. The run kept `20` and flagged it for review: "do not casually flip to 100 on the narrow wording, and do not flip to -100 because the bill is deferred, not repealed."

**Lesson**: A narrow verb can mean 100 even when the policy as a whole stalls. When the literal reading and an earlier human decision disagree, raise it as a note. Don't override the human decision silently.

## 2. Delayed is not failed

**Commitment**: "Repeal the Canterbury Regional Council (Ngāi Tahu Representation) Act 2022." Current Status `10`. [2026-08-15]

**Evidence**: The NZ Herald (21/07/2026) reported that the Local Government Minister conceded the repeal "will have to wait until next term". The Act remains in force.

**Decision**: Keep `10`, plus a note: "Not auto-flipped to -100; delayed, not abandoned. Human call whether to keep 10 or move to -100."

**Lesson**: "Next term" is a delay. `-100` needs the Government to drop the commitment explicitly, or a one-off deliverable that can no longer happen.

## 3. Re-check a prior 100 against a numeric target

**Commitment**: "Commit to training no fewer than 500 new frontline police within the first two years." Current Status `100`. Full re-check mode. [2026-07-09]

**What 100% means**: 500 additional frontline officers by about 27/11/2025.

**Evidence**: In November 2025, 1News reported that the target had been missed and that Treasury projected it would be reached in September 2026. The programme is still funded and recruiting.

**Decision**: `100 → 50`. The target was officially missed, so `100` can't stand. The programme continues, so this is partial progress, not `-100`.

**Lesson**: A numeric target is met only when the number is reached. A funded recruitment programme is not enough. This was the only downgrade among 78 rows at `100`. Downgrades need clear evidence.

## 4. Implementation evidence when there is no press release

**Commitment**: "By or before 2026, assess the impact inflation has had on the average tax rates faced by income earners." Current Status `0`. [2026-08-15]

**What 100% means**: A published official assessment, completed by or before 2026. The commitment does not require any change to tax policy.

**Evidence**: Treasury Analytical Note AN 25/07 covers the assessment. There was no beehive release announcing it as delivery of the commitment.

**Decision**: `0 → 50`, with the Treasury note as the reference. The run stopped short of `100` because the note is a broader paper on the tax base rather than a standalone assessment of this commitment.

**Lesson**: An agency publication is a Tier 1 primary record, even when no minister announced it. An "assess" commitment can reach 100 without any policy change. Score it by whether the assessment exists and how closely it matches the commitment.

## 5. A sector body as a lead, checked against the Budget

**Commitment**: "Ensure Plunket is funded to do their job properly." Current Status empty. [2026-08-15]

**Evidence**: NZNO's journal Kaitiaki (29/05/2026) said Budget 2026 contained no dedicated Plunket funding. No funding announcement from the Government was found.

**Decision**: Leave it empty, plus a note. Under the current `source-tiers.md`, the sector claim is a Tier 3 lead. The next step is to check Vote Health in the Estimates for a Well Child Tamariki Ora or Plunket line, and cite the Estimates rather than NZNO.

**Lesson**: Outside commentary often reveals delivery, or the lack of it, that the Government never announces. Follow the lead to the primary record.

## 6. Rule changes that soften a commitment rather than meet it

**Commitment**: "Remove median wage requirements from Skilled Migrant Category visas." Current Status `67`. [2026-08-15]

**Evidence**: Immigration NZ's operational pages confirmed that the wage-threshold rules would change on 24/08/2026. Median-wage tests are modified, not removed, and new pathways still require 1.0–1.1 times the median wage.

**Decision**: Keep `67`, plus a note that "remove" may not be the right description once the rules take effect.

**Lesson**: An agency's operational pages are the authoritative source for rule changes, which often have no beehive release. Compare the exact verb ("remove") with what the rules actually do ("modify").

## 7. Possible terminology mismatch

**Commitment**: "Investigate the establishment of an 'Essential Worker' workforce planning mechanism…" Current Status empty. [2026-08-15]

**Evidence**: No investigation branded "Essential Worker" was found. Related tools exist: the National Occupation List, the Green List, and the SMC trades pathway.

**Decision**: Leave it empty, plus a note: "Possible terminology mismatch or quiet shelving. Candidate for human review, not an automatic -100."

**Lesson**: Search again using the agency's own vocabulary before concluding that nothing happened. If the link is still uncertain, flag it rather than give credit for related work.

## 8. Updated is when the commitment was delivered, not when it was announced

**Commitment**: "Establish a Regional Infrastructure Fund with $1.2 billion in capital funding over the Parliamentary term." Status `100`. [2026-08-15, delivery date corrections]

**Evidence**: The fund was funded in Budget 2024 on 30/05/2024 and opened to applications on 01/07/2024.

**Decision**: `Updated` changed from `30/05/2024` to `01/07/2024`, the day the fund began operating.

**Lesson**: For `100` rows, `Updated` is the date the 100% picture became true. That is the date something came into force, started operating, or was reached. It is not the date of the Budget, the announcement, or the research run (ADR 0002).

## Reasoning to avoid

- **Treating a list as delivery.** "The treatments are on a Ministry list, so they are delivered." Check that they are funded and accessible.
- **Treating an announcement as delivery.** "The minister announced the fund, so it's 100." Look for the date it started operating.
- **Treating a replacement as failure.** "The Act is being replaced rather than repealed, so it's -100." If the replacement achieves the commitment's aim, score it as progress.
- **Using a debate as evidence.** "The minister told the House it's done." A Hansard speech is a claim. Find the record of the thing being done.
- **Using the run date.** Writing today's date into `Updated` because you looked at the row today.
