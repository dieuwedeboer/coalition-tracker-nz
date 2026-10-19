# Coalition Tracker NZ

Tracks delivery of coalition government commitments against publicly available evidence. The Luxon coalition (National, ACT, NZ First) was formed after the 2023 New Zealand general election.

## Language

**Coalition**:
The Luxon-era governing coalition of National, ACT, and NZ First, formed after the 2023 New Zealand general election.
_Avoid_: Government (broader; includes ministries and public service)

**Commitment**:
A specific promise extracted from the formal coalition agreements between the three coalition parties. Each commitment is a discrete, checkable deliverable, attributed to one or more parties.
_Avoid_: Promise, pledge (used colloquially in the README and the upstream Google Sheet, but "commitment" is the canonical term in the dataset)

**Status**:
A numeric editorial score indicating how much concrete public action has been taken toward delivering a commitment. Score is 0-100, with negative values indicating failure or abandonment. Empty string means not yet started. Allowed values: `0`/empty, `10` (default in-progress anchor), any 10-multiple in [10, 100] when the AI can defend the value, k-fractions `25`/`33`/`67`/`75` when the commitment has a clear k-step structure, and `-100` (the only negative value) for failure. No decimals. Notes must justify any non-anchor value.
_Avoid_: Progress (implies a continuous journey rather than an editorial judgement)

**Status group**:
The UI's grouping of Status values for filtering and charts: Delivered (`100`), Well Advanced (`50`–`90`, including `67` and `75`), Early Progress (`10`–`40`, including `25` and `33`), Not Started (`0`/empty), and Failed (`-100`). A presentation grouping only; the CSV stores the numeric Status.
_Avoid_: In progress as a single bucket (hides how far along a commitment is)

**Delivered with changes**:
A commitment whose core aim is in force or operating, where the Government deliberately changed a detail of the wording (mechanism, scope, an interim step, or one limb swapped for an alternative). It scores `100`, and `Notes` must say "Delivered with changes" and name each change (ADR 0003). A limb that is still pending is progress, not a change.
_Avoid_: Partially delivered (implies more is still to come)

**Failure**:
A commitment is "failed" when it was explicitly dropped, a binary deliverable was replaced with the opposite policy, or a time-bound one-off deliverable can no longer happen. Delay (including "next term") is not failure, and a past-due row with no action is only a candidate for failure: the flip to `-100` is a human decision. All failures are marked Status `-100`. A failure row must cite a source in `References` documenting the failure or abandonment.
_Avoid_: Partial failure (a commitment that delivered some of its sub-parts is a positive fraction, not a negative score)

**Updated**:
The date of the event that justifies a commitment's current Status, in `DD/MM/YYYY` format: the delivery date for `100`, the date the failure became public for `-100`, and the date of the latest concrete advance for in-progress rows. It is not the date a row was edited or researched (ADR 0002).
_Avoid_: Last modified, last checked

**Concrete advance**:
A specific public action — bill introduced, policy paper published, programme launched, budget allocated — that has demonstrably moved a commitment forward. Distinct from rhetoric (re-stating the commitment, expressing intent). Only public evidence counts; internal decisions count only when disclosed in Hansard, OIA releases, or other public records.
_Avoid_: Step (too generic), update (collides with the `Updated` field), announcement (often rhetorical)

**Reference**:
A source — typically a URL — supporting the current Status of a commitment. Stored in the `References` field. A Reference is required for: any Status value above 0 (i.e. evidence of concrete advance), and any `-100` value (evidence of failure or abandonment). For Status `0`/`""`, the field is allowed to be empty.
_Avoid_: Citation (academic connotation), source (overloaded with code meaning)

**Source tier**:
The authority ranking of a source, used by the AI research loop to weight evidence. Tier 1 (primary records) is government and parliamentary records (beehive.govt.nz, parliament.nz bill pages and written question answers, legislation.govt.nz including secondary legislation, the Gazette) plus implementation evidence from implementing agencies, Budget documents, official statistics, independent officers of Parliament, and OIA responses — these alone can confirm "Delivered" or "Failed". Tier 2 (independent reporting) is NZ general, specialist and sector news — it corroborates, and two independent outlets reporting the same fact can support a verdict. Tier 3 (claims and leads) is parties, lobby and sector bodies, Wikipedia, and Hansard debate speeches — it supports "in progress" claims and points to primary records, never a verdict. The full list is in the research skill's `reference/source-tiers.md`.
_Avoid_: Reliable source (vague), credible source (subjective)

**Past-due**:
A commitment whose `Due` date has passed. The AI research loop does not auto-flip past-due `0`-rows to `-100`; it surfaces them as notes in the report for human review. The flip to `-100` is always a human decision.
_Avoid_: Overdue (collides with the UI's "overdue" badge for `Due` dates)
