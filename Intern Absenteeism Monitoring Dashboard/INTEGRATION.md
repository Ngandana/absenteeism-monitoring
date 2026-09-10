# Intern Absenteeism Monitoring — developer handoff

## What's in the package

```
Absenteeism Monitoring.dc.html   the whole dashboard (markup + logic in one file)
support.js                       runtime that renders the component — required, don't edit
_ds/modernist-.../               design system: styles.css + _ds_bundle.js (tokens, .btn, .table, .field)
github.md                        record of which repo docs each screen was built from
INTEGRATION.md                   this file
```

Open `Absenteeism Monitoring.dc.html` directly in a browser — no build step, no npm install.
Serve the folder over HTTP (`npx serve .` or VS Code Live Server) so the `_ds/` paths resolve.

## Where the data lives

All sample data sits at the top of the `<script data-dc-script>` block, as plain arrays:

| Constant | Feeds | Shape |
|---|---|---|
| `THRESHOLDS` | alert level derivation | `[{ level, min }]` — currently 10 / 7 / 5 / 2, highest first |
| `CASES` | Alert cases list, Case detail, Overview counts | `{ id, name, dept, manager, status, opened, cycle, dates[], history[] }` |
| `CYCLES` | Overview trend chart | `[{ label, value }]` |
| `EXCEPTIONS` | Data quality table | `{ id, name, date, issue, state }` — state is `Pending Review` or `Data Error` |
| `SYNC_LOG` | Sync log table | `{ run, source, records, result, detail, ok, retry }` |

`level`, `rule` and `count` are **derived**, not stored — `merged()` counts `dates[].counts === true`
and runs it through `THRESHOLDS`. Change the thresholds in one place and every screen follows.

## Wiring your backend

Replace the constants with a fetch in the logic class:

```js
componentDidMount() {
  fetch('/api/cases')
    .then(r => r.json())
    .then(cases => this.setState({ cases }));
}
```

Then read `this.state.cases` instead of the `CASES` constant in `renderVals()`.
Four endpoints cover the whole UI:

- `GET /api/cases` → `CASES` shape
- `GET /api/cycles` → `CYCLES` shape
- `GET /api/exceptions` and `GET /api/sync-log`
- `PATCH /api/cases/:id` → `{ status, action, notes }`

The two write paths are already stubbed with a 900ms delay and real loading state:

- `submit()` — saves the case decision. Swap the `setTimeout` for your `PATCH`; keep the
  `saving` state so the button spinner and `aria-busy` still fire.
- `resolveException(id)` — the retry / mark-reviewed action on Data Quality.

Both write into local `state.edits` / `state.resolved` so the UI updates optimistically.
On a failed request, set an error message into state rather than throwing — nothing
in this UI should fail silently, since managers act on what it shows.

## Rules the UI assumes

- A day counts toward a case only when `counts: true`. Approved leave, public holidays and
  Pending Review days are held out and shown as "Excluded" in the evidence table.
- The alert level is a function of the count alone. There is no manual level override.
- **Nothing in this UI contacts an intern.** Saving a decision writes a record; any
  discussion, consultation or formal step is arranged by a person off-system. Keep that
  true on the backend — no notification hooks on the case-update endpoint.
- The 4-day threshold in the spec conflicts with the 2/5/7/10 model; this build uses
  2/5/7/10 and flags it as pending sign-off on the Overview screen.

## Accessibility to preserve

Focus rings (2px accent, `:focus-visible`), 44px minimum targets, `aria-label` on every
control, `aria-live` on the filter count and save confirmation, alert level encoded as a
1–4 filled-mark scale **plus** a text label so it never depends on color, and
`prefers-reduced-motion` handling in the helmet styles. If you re-template any of this
into your own framework, carry those across.
