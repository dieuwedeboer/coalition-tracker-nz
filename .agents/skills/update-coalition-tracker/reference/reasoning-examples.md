# Reasoning Examples

Worked examples to calibrate the AI's editorial judgement. The pattern across all examples: the AI anchors on the current Status, defines what 100% would look like for *this specific* commitment, then reads the evidence against that picture.

## Example 1 — Bill progresses to second reading

**Commitment**: "Introduce legislation to ban gang patches, stop gang members gathering in public, and stop known gang offenders from communicating with one another."

**Current Status**: 10 (In Progress). `Updated`: 2024-03-07. `Due`: 2024-03-08.

**AI research**: Searches parliament.nz for the gang legislation bill. Finds it has progressed to second reading on 2026-05-12. No Royal Assent yet. The 100% picture is "all three elements of the commitment have been enacted into law".

**Decision**: 50 (Substantially advanced). The bill is in flight; one of three parliamentary stages complete (introduction → select committee → second reading). Not yet at 100% because Royal Assent has not occurred.

**Notes**: "Gang legislation bill passed second reading 2026-05-12; awaiting third reading. Status 50 reflects substantial legislative progress, not completion."

## Example 2 — Repeal that quietly didn't happen

**Commitment**: "Abolish the Resource Management Act 1991."

**Current Status**: 0 (Not Started). `Updated`: 2023-11-27. `Due`: empty.

**AI research**: Searches beehive.govt.nz and parliament.nz for "RMA repeal". Finds that the government has instead pursued a series of RMA *amendments* (the "RMA Amendment Bill" of 2024, the "RMA Reform Bill" of 2025) rather than a full repeal. A Cabinet Paper from 2026-04-08 confirms that full repeal is no longer the policy; the government is now focused on replacement legislation.

**Decision**: -100 (Failed). The deliverable is binary (repeal or not), and the policy is now explicitly replacement, not repeal. A source exists (the Cabinet Paper) documenting the pivot.

**Notes**: "Full RMA repeal quietly shelved; government pursuing RMA replacement legislation instead (Cabinet Paper 2026-04-08). Status -100 reflects the policy pivot away from repeal."

## Example 3 — Continuous commitment with partial delivery

**Commitment**: "Build infrastructure with 13 new Roads of National Significance and four major public transport upgrades."

**Current Status**: 10 (In Progress). `Updated`: 2023-12-05. `Due`: 2024-03-08.

**AI research**: Searches for progress on the 13 RONS. Finds 4 RONS are under construction, 5 are in planning/consultation, and 4 have not started. The 100% picture is "all 13 RONS and 4 PT upgrades complete and operational".

**Decision**: 33 (3 of 9 major projects complete... actually 4 of 13 RONS plus planning on others). Hmm — 4 of 13 is roughly 30%, so `30` (10-multiple) is defensible. The k-fraction approach (1/3, 1/4) doesn't fit cleanly because the k=13 (or k=17 including PT upgrades) doesn't yield clean fractions. The AI picks `30`.

**Notes**: "4 of 13 RONS under construction, 5 in planning, 4 not started. 30% reflects the construction-stage progress on the 4 underway RONS."

## Example 4 — Past-due 0-row

**Commitment**: "Investigate the threshold at which local lines companies can invest in generation assets."

**Current Status**: empty (Not Started). `Updated`: 2023-11-27. `Due`: empty.

**AI research**: Searches beehive.govt.nz and parliament.nz for "lines companies generation threshold". No relevant results.

**Decision**: 0 retained. Do not auto-flip to -100. Surface as a `Note:` in the report. The flip to -100 is a human decision.

**Notes** (in the report, not in the CSV): "Row 33: no public action found for 'lines companies generation threshold'. Commitment may have been quietly shelved or may be a terminology mismatch. Awaiting user clarification before proposing -100."

## Example 5 — No change despite fresh search

**Commitment**: "Maintain the superannuation age at 65."

**Current Status**: empty (Not Started). `Updated`: 2023-11-27. `Due`: empty.

**AI research**: Searches for "superannuation age New Zealand 65". Finds no government action to change the superannuation age. The 100% picture is binary: "the superannuation age remains 65". It does — so 100% is technically true, but the Status is `""`/`0` because the original status reflected that the commitment was a "do not change" promise, not a "make a change" promise. The AI recognises that the original intent is preserved and the current Status reflects the *current state* (which is "no change needed, no public action required").

**Decision**: 0 retained. Do not modify the CSV. Do not add a `Note:` (the row is healthy — "no change" is the expected state).

## Example 6 — Bad reasoning to avoid

**Commitment**: "Cut health waiting times by training more doctors, nurses, and midwives, and giving Kiwis access to 13 more cancer treatments."

**Current Status**: 100 (Delivered). `Updated`: 2024-06-24. `Due`: empty.

**Bad AI reasoning**: "The 13 cancer treatments are listed in a Ministry of Health document, and training places have been announced. Status retained at 100." — but the AI didn't actually verify that the treatments are *funded and accessible*, only that they're *listed*. That's a "Tier 3 leak" — the AI has conflated a list with delivery.

**Better**: "The 13 cancer treatments are funded and accessible per the 2024-06-24 beehive release. Training places have been announced but most are not yet in service. The 100% for this commitment requires both: (a) treatments accessible, (b) training pipeline expanded. (a) is true; (b) is in progress. However, the current Status is 100 and the user's prior reasoning (per the 2024-06-24 update) appears to have weighted (a) as sufficient. The AI retains 100 but flags in Notes that training pipeline is still expanding."

This shows the anchor principle: the AI doesn't casually override a prior `100` just because it found a sub-element still in progress. It surfaces the tension in `Notes` for the user to adjudicate.
