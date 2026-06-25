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

**Failure**:
A commitment is "failed" when its deliverable is no longer being pursued, was explicitly dropped, was replaced with an opposite policy, or expired past its due date with no action. All failures are marked Status `-100`. A failure row must cite a source in `References` documenting the failure or abandonment.
_Avoid_: Partial failure (a commitment that delivered some of its sub-parts is a positive fraction, not a negative score)

**Concrete advance**:
A specific public action — bill introduced, policy paper published, programme launched, budget allocated — that has demonstrably moved a commitment forward. Distinct from rhetoric (re-stating the commitment, expressing intent). Only public evidence counts; internal decisions count only when disclosed in Hansard, OIA releases, or other public records.
_Avoid_: Step (too generic), update (collides with the `Updated` field), announcement (often rhetorical)

**Reference**:
A source — typically a URL — supporting the current Status of a commitment. Stored in the `References` field. A Reference is required for: any Status value above 0 (i.e. evidence of concrete advance), and any `-100` value (evidence of failure or abandonment). For Status `0`/`""`, the field is allowed to be empty.
_Avoid_: Citation (academic connotation), source (overloaded with code meaning)

**Source tier**:
The authority ranking of a source, used by the AI research loop to weight evidence. Tier 1 (ground truth) is beehive.govt.nz releases, parliament.nz (Hansard, bill pages), and legislation.govt.nz — these alone can confirm "Delivered" or "Failed". Tier 2 (corroboration) is mainstream NZ news (RNZ, NZ Herald, Stuff, Newsroom, 1News) — used to corroborate Tier 1, not to deliver verdicts alone. Tier 3 (weak) is party websites, social media, lobby-group statements — supports "in progress" claims, never a delivery verdict.
_Avoid_: Reliable source (vague), credible source (subjective)

**Past-due**:
A commitment whose `Due` date has passed. The AI research loop does not auto-flip past-due `0`-rows to `-100`; it surfaces them as notes in the report for human review. The flip to `-100` is always a human decision.
_Avoid_: Overdue (collides with the UI's "overdue" badge for `Due` dates)
