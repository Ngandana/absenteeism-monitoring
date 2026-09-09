# Open Decisions Log

A running log of every open question that blocks a phase of this project, separate
from [docs/02-requirements-engineering-specification.md](02-requirements-engineering-specification.md)
so the spec itself doesn't need editing every time something is confirmed or
overridden. **Check this file before starting any phase that depends on a
pending decision** — see the "Blocks" column below and the Build and Delivery
Plan's phase list.

Status values:

- **Open** — not yet confirmed; the dependent phase must not start.
- **Answered** — confirmed by the named person/date; the answer is now binding.
- **Superseded** — an earlier Answered entry that a later decision has replaced;
  kept for history rather than deleted.

## Log

| # | Decision Needed | Status | Date | Confirmed By | Blocks | Notes |
|---|---|---|---|---|---|---|
| 1 | Threshold model: PRD's single rule of 4 qualifying absence days in a rolling 30-day period, vs. the Airtable Build Instructions' four alert levels at 2, 5, 7, and 10 days — which is the real requirement (or what combination)? | Open | — | — | Phase 3 (Classification engine), Phase 1 (Absence Rules table can't be finalised) | Source: Requirements doc, section 9, bullet 1. |
| 2 | Whether partial days or leave taken with notice count toward the threshold. | Open | — | — | Phase 3 (Classification engine) | Source: Requirements doc, section 9, bullet 2. |
| 3 | The exact daily finalisation window (what time each morning the previous day is assessed). | Open | — | — | Phase 3 (Classification engine), Phase 2 (sync scheduling) | Source: Requirements doc, section 9, bullet 3. |
| 4 | Final confirmation of the case owner for each department, if this differs from the three named alert recipients (Miss Candice, Miss Gabby, Admin rep). | Open | — | — | Phase 4 (Alerts), Phase 1 (Alert Recipients table) | Source: Requirements doc, section 9, bullet 4; Build and Delivery Plan, section 6. |

## How to update this log

1. When a decision is confirmed, change its Status to **Answered**, fill in the
   Date and Confirmed By columns, and add the answer itself to the Notes
   column (or link to wherever it was recorded, e.g. an email or meeting note).
2. Never delete a row. If a later decision changes an earlier Answered one,
   mark the earlier row **Superseded** and add a new row for the new decision,
   cross-referencing the row number it supersedes.
3. New open questions discovered during later phases get appended here with
   the next number in sequence, not folded into the requirements spec.
