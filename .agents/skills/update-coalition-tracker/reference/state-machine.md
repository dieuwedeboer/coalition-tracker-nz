# State Machine

The Status field on each commitment is an editorial score. This file sets out how to pick a value you can defend.

## Values

| Value | Name | Meaning |
|---|---|---|
| empty or `0` | Not Started | No public action tied to this commitment. |
| `10` | In Progress (default anchor) | First concrete advance: bill introduced, programme launched, policy paper published, budget allocated, consultation opened, review commissioned. |
| `20`–`90` | Intermediate progress | Multiples of 10. You must be able to explain the value. For example, a bill reported back from select committee and awaiting second reading is about `50`. |
| `25`, `33`, `67`, `75` | k-fractions | Used when the commitment splits clearly into k parts. For example, a 3-limb commitment with one limb delivered is `33`. |
| `100` | Delivered | The 100% picture is true now. |
| `-100` | Failed | See *Failure definition*. Needs a source. |

Rules:
- `10` is the default when a commitment is in progress. Use a higher value only when you can explain why, and put that explanation in the report's reasoning and, briefly, in `Notes`.
- k-fractions are worked out fresh on each run. Don't store the breakdown anywhere.
- Decimals are not allowed. The only negative value allowed is `-100`. If a commitment has been partly abandoned, give it a positive fraction for the parts still delivered.

## What 100% means: read the verb

Before you look at the evidence, write down what 100% means for this particular commitment. The commitment's verb usually decides it:

| Commitment verb | 100% means |
|---|---|
| Investigate / review / take advice on / assess | The investigation, advice or assessment has been completed and published, or its completion has been publicly confirmed, for example through an OIA response, a Cabinet paper, or an answer to a written parliamentary question. A policy change does not have to follow. |
| Introduce a bill / support to select committee / pass first reading | That procedural stage has been completed. What happens to the bill after that does not count. |
| Pass / enact / amend an Act / repeal an Act | The amending or repealing Act is **in force**. Royal Assent alone is not enough if commencement comes later. |
| Establish / fund / launch a programme | The programme is operating, for example open to applications or accepting clients. Being funded in a Budget is not enough. |
| Numeric target ("500 new police", "13 RONS") | The number has been reached, according to the agency's own figures or official statistics. |
| Maintain / keep / not progress / not proceed with | Nothing has changed, so the commitment is met. It counts as `100` from the date the Government took office (27/11/2023) or the date of the coalition agreement, unless the Government reverses course. |
| Continuous outcome ("lower inflation", "reduce waiting times") | The stated target has been reached and held, according to official data. Score progress in proportion to how close the measures are to the target. |

## Delivered with changes

Score `100` when the commitment's core aim is in force or operating, even if the Government changed a detail of the wording (ADR 0003). The test for each difference between the wording and what was delivered:

| The difference is… | Score |
|---|---|
| A deliberate, public choice: a different mechanism, a narrower scope, a skipped interim step, or a limb replaced by an alternative | Counts as delivered. `100` if the core aim is in force or operating. |
| A step not yet finished: bill not passed, regulations not drafted, Act not yet in force | Progress. Keep a fraction. |
| A "consider" limb with no record of being considered, when the substantive limbs are delivered | Counts as delivered. Say in `Notes` that no record was found. |
| A substantial limb dropped with nothing in its place | Keep a positive fraction. |
| A reversal of the commitment's aim | See *Failure definition*. |

A `100` scored this way must have `Notes` starting "As at DD/MM/YYYY: Delivered with changes." and naming each change in one short sentence, starting "Change:" (a different choice) or "Compromise:" (a narrower or weaker version). Set `Updated` to the date the last delivered part came into force or began operating.

Example: the Smokefree repeal commitment. All three repeal limbs and the vaping changes are in force; tax was not limited to smoked products, and heated tobacco excise was halved instead. That is `100`, delivered with changes.

## Failure definition

A commitment has **failed** (`-100`) only when one of these is documented by a source:

- The Government, or a minister speaking officially, said the commitment has been dropped, or will not be delivered at all.
- A binary deliverable was replaced by the opposite policy. For example, a promise to repeal X ended with X being kept and extended.
- A one-off, time-bound deliverable can no longer happen. For example, a referendum that had to be held at a particular election was not held.

A commitment has **not** failed when:

- It has been delayed, including "next term". Keep the current Status and add a report note.
- It was replaced by legislation or a programme that delivers the same aim. Score it as progress toward the commitment.
- Some parts have been delivered. Use a positive fraction.
- You can't find evidence either way. Keep the current Status and add a report note.

## Past-due rows

When a row's Status is empty or `0`, its `Due` date has passed, and you find no public action:

- Do not set the Status to `-100`.
- Add a report note: "Due DD/MM/YYYY has passed; no public action found; candidate for -100."
- The user decides whether to change it.
