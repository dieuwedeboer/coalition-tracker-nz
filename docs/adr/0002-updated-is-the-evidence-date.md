# 2. `Updated` records when the Status became true, not when the row was edited

ADR 0001 described `Updated` as the date of the last actual change to a row. In practice, research runs wrote their own run date into it. That made the Delivery Timeline chart plot check-off dates (24/06/2026, 09/07/2026, the 05/12/2023 bulk import) instead of the dates commitments were delivered. The 2026-08-15 run corrected 53 completed rows by hand.

`Updated` now holds the date of the event that justifies the current Status:

- `100`: the delivery date, meaning the date the commitment came into force, began operating, or reached its target. It is not the date of the announcement, the Budget, or Royal Assent with a later commencement.
- `-1`: the date the failure or abandonment became public.
- In progress: the date of the latest concrete advance cited in `References`.
- Empty or `0`: unchanged.

The format is `DD/MM/YYYY`. papaparse's `dynamicTyping` turns ISO strings into values the UI does not parse, and the app splits on `/`.

## Consequences

- The research skill never writes the run date into the CSV. The run date lives in the report filename and in the "As at" prefix of `Notes`.
- When a row is reviewed and its `Updated` is a run or import date rather than an event date, the research skill corrects it and reports it under *Date corrections*. Many in-progress rows still carry run dates and will be corrected as they are reviewed.
- The "Data last updated" chip in `App.tsx` shows the most recent `Updated` value, which now means the latest recorded progress rather than when the data was last refreshed. Its label should be changed to match.
- This supersedes the "last actual change" wording in ADR 0001.
