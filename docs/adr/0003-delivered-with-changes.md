# 3. A commitment delivered with changes counts as delivered

Some commitments were delivered, but not exactly as worded. The Government kept the aim and changed a detail: a different mechanism, a narrower scope, a skipped interim step, or one limb swapped for an alternative. Scoring these against the literal wording held them at `67`–`90` indefinitely, which read as "still in progress" when nothing more was coming.

The Smokefree repeal commitment is the first example. Every repeal limb and the vaping changes are in force, but tax was not limited to smoked products (heated tobacco excise was halved instead). It moved from `75` to `100` on 19/10/2026.

A commitment is **delivered with changes**, and scores `100`, when:

- its core aim is in force or operating (the 100% picture in `state-machine.md`, read for the aim rather than every word);
- each difference from the wording is a deliberate, public choice by the Government, not an unfinished step;
- `Notes` says "Delivered with changes" and names each change.

It does not apply when:

- a limb is still pending (a bill not passed, regulations not drafted, an Act not yet in force). That is progress, not a change;
- a limb was dropped with nothing in its place and that limb is a substantial part of the commitment. That stays a positive fraction;
- the change reverses the commitment's aim. That is a candidate for failure.

## Consequences

- `Updated` is the date the last delivered part came into force or began operating (ADR 0002).
- The research skill may apply this rule itself, but it lists every such row under *Notes for review* so the user can disagree.
- Notes containing "Delivered with changes" can be found by searching the CSV.

## Decisions on the first review (19/10/2026)

Issue #2 reviewed 11 more rows. Dieuwe approved all of them as delivered with changes, which settles these cases:

- A "consider" limb with no public record of being considered does not stop a `100` if the substantive limbs are delivered (rows 63 and 194). Notes must say it was not found.
- A narrower or opt-in version of the deliverable counts (rows 78, 143 and 182), as does amending an Act when the commitment said "rewrite" (row 128).
- Row 148 (council housing incentives) is an exception: it scores `100` from the Budget 2026 allocation, although first payments are not made until 01/04/2027. Don't treat this as a general rule that Budget funding is enough.
