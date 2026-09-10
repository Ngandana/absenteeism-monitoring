import { useEffect, useMemo, useState } from 'react'
import { Divider, Field, Select, TextInput } from '../components/ui'
import { fetchReferenceTable } from '../lib/api'
import type { ReferenceRecord, ReferenceTableKey } from '../lib/types'

const TABLES: { key: ReferenceTableKey; label: string }[] = [
  { key: 'alert-recipients', label: 'Alert Recipients' },
  { key: 'leave-policies', label: 'Leave Policies' },
  { key: 'absence-rules', label: 'Absence Rules' },
]

type Loaded = { table: string; records: ReferenceRecord[] }

export function ReferenceData() {
  const [loaded, setLoaded] = useState<Loaded[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [tableFilter, setTableFilter] = useState('All tables')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const results = await Promise.all(
          TABLES.map(async (t) => {
            const res = await fetchReferenceTable(t.key)
            return { table: t.label, records: res.records }
          }),
        )
        if (!cancelled) setLoaded(results)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const allRecords = useMemo(
    () => loaded.flatMap((l) => l.records.map((r) => ({ ...r, table: l.table }))),
    [loaded],
  )

  const q = query.trim().toLowerCase()
  const filtered = allRecords.filter((r) => {
    if (tableFilter !== 'All tables' && r.table !== tableFilter) return false
    if (!q) return true
    const hay = (r.primary + ' ' + Object.values(r.fields).map((v) => (Array.isArray(v) ? v.join(' ') : String(v))).join(' ')).toLowerCase()
    return hay.includes(q)
  })

  return (
    <section aria-labelledby="rf-h" className="animate-[dcfade_220ms_ease_both]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 id="rf-h" className="m-0 text-[clamp(26px,4vw,38px)] tracking-tight">
          Reference data
        </h1>
        <p aria-live="polite" className="m-0 text-sm text-neutral-700">
          {filtered.length} of {allRecords.length} records
        </p>
      </div>
      <p className="mt-2 max-w-[70ch] text-[15px] text-neutral-800">
        Live from the Pillar 5 Airtable base — Alert Recipients, Leave Policies, and Absence Rules — fetched from the backend on load, which is the
        only place the Airtable key is used.
      </p>
      <Divider className="my-4" />

      {error && (
        <p className="mb-5 border-2 border-accent-700 bg-accent-200 p-[18px] text-sm font-semibold text-accent-800">
          Couldn't reach the backend: {error}. Is it running (`npm start` in Backend/)?
        </p>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 border-2 border-divider bg-neutral-100 p-[18px] sm:grid-cols-2">
        <Field label="Search" htmlFor="rf-search">
          <TextInput
            id="rf-search"
            type="search"
            placeholder="Name, email, rule, threshold…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Field>
        <Field label="Table" htmlFor="rf-table">
          <Select id="rf-table" value={tableFilter} onChange={(e) => setTableFilter(e.target.value)}>
            {['All tables', ...TABLES.map((t) => t.label)].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
      </div>

      {loading && <p className="text-sm text-neutral-700">Loading…</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="border-2 border-dashed border-neutral-400 p-6 text-[15px] text-neutral-700">
          No records match. Clear the search or table filter to widen the results.
        </p>
      )}

      <div className="flex flex-col gap-3.5">
        {filtered.map((r) => (
          <div key={r.table + ':' + r.id} className="border-2 border-divider bg-bg p-[18px]">
            <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[17px] font-extrabold">{r.primary}</span>
              <span className="border-[1.5px] border-neutral-700 px-[9px] py-0.5 text-xs font-bold tracking-[0.06em] uppercase">{r.table}</span>
            </div>
            <dl className="m-0 grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
              {Object.entries(r.fields)
                .filter(([k]) => k !== 'Recipient Name' && k !== 'Policy Name' && k !== 'Rule Name')
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] tracking-[0.08em] text-neutral-700 uppercase">{k}</dt>
                    <dd className="mt-0.5 mb-0 text-sm break-words">
                      {Array.isArray(v) ? v.join(', ') : v && typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
