# Source Tiers

Authoritative sources for commitment research, in priority order. The AI uses these tiers to weight evidence when deciding a new Status.

## Tier 1 — Ground truth

Sources that can confirm "Delivered" or "Failed" on their own.

- **beehive.govt.nz** — NZ Government press releases. The primary source for policy announcements, Cabinet decisions, programme launches, and ministerial statements.
- **parliament.nz** — Hansard debates, select committee reports, bill progress. Use for legislative commitments to track bill stages (introduction, first/second/third reading, Royal Assent).
- **legislation.govt.nz** — Bills and Acts. The authoritative source for whether a bill has become law.
- **environment.govt.nz**, **health.govt.nz**, **mbie.govt.nz**, etc. — Ministry/department sites. Useful for implementation details.

**Rule**: A Tier 1 source alone can confirm `100` (Delivered) or `-100` (Failed). The AI should prefer Tier 1 sources whenever available.

## Tier 2 — Corroboration

Mainstream NZ news. Used to corroborate Tier 1, not to deliver verdicts alone.

- **rnz.co.nz** — Radio New Zealand
- **nzherald.co.nz** — NZ Herald
- **stuff.co.nz** — Stuff
- **newsroom.co.nz** — Newsroom
- **1news.co.nz** — TVNZ 1News
- **newstalkzb.co.nz** — Newstalk ZB

**Rule**: Tier 2 can support a `100` claim *if* a Tier 1 source corroborates. Tier 2 alone is not sufficient for `100`. Tier 2 is sufficient for `10`–`50` claims about progress.

## Tier 3 — Weak

Party and lobby-group sources. Used only for "in progress" claims, never for delivery verdicts.

- Party websites and press releases (national.org.nz, act.org.nz, nzfirst.nz)
- Party social media (verified party accounts only)
- Lobby-group statements (Family First, Hobson's Pledge, etc.)

**Rule**: Tier 3 supports `10` claims about "we are working on this" or "we have announced this". Tier 3 alone is not sufficient for any status change from 0/10 to a higher value.

## Edge cases

- **Hansard on a Tuesday** — Hansard debates often contain the first public disclosure of policy positions. Treat Hansard as Tier 1 even though it's parliament.nz (not a press release).
- **Beehive tweets** — Beehive press releases are sometimes shared on social media first. Cross-check the beehive.govt.nz site; the website is canonical.
- **OIA releases** — OIA documents count as Tier 1 for what they disclose (e.g., a Cabinet paper is Tier 1 evidence of internal decisions).
- **Newsroom.co.nz investigations** — Investigative reporting is Tier 2, not Tier 1. Even strong investigations are corroboration, not ground truth.

## Search strategy

Per row, the AI should aim for:

1. One search to check for new public action since `Updated` (e.g., site:beehive.govt.nz "[key term]" after:YYYY-MM-DD).
2. One search for the commitment's specific deliverable (e.g., a bill name on parliament.nz).
3. One search for general news coverage if the above two are sparse.
4. Read 1–2 of the top hits, prioritising Tier 1 sources.

If the commitment is in a portfolio with a relevant ministry (e.g., Health commitments → health.govt.nz, Te Whatu Ora), one of the searches can target the ministry directly.
