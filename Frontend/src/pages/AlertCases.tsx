import { useMemo, useState } from 'react'
import { Button, Divider, Field, LevelBadge, Select, StatusBadge } from '../components/ui'
import type { CaseRecord, CaseStatus } from '../lib/types'

const STATUSES: CaseStatus[] = ['New', 'Under Review', 'Action Required', 'Dismissed', 'Closed']
const LEVEL_OPTIONS = ['Early Warning', 'Concern', 'Consultation', 'Red Flag']

export function AlertCases({
  cases,
  initialLevel,
  onOpenCase,
}: {
  cases: CaseRecord[]
  initialLevel: string | null
  onOpenCase: (id: string) => void
}) {
  const [fStatus, setFStatus] = useState('All statuses')
  const [fDept, setFDept] = useState('All departments')
  const [fLevel, setFLevel] = useState(initialLevel || 'All levels')

  const depts = useMemo(() => [...new Set(cases.map((c) => c.dept))], [cases])

  const visible = cases.filter(
    (c) =>
      (fStatus === 'All statuses' || c.status === fStatus) &&
      (fDept === 'All departments' || c.dept === fDept) &&
      (fLevel === 'All levels' || c.level === fLevel),
  )

  return (
    <section aria-labelledby="cs-h" className="animate-[dcfade_220ms_ease_both]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 id="cs-h" className="m-0 text-[clamp(26px,4vw,38px)] tracking-tight">
          Alert cases
        </h1>
        <p aria-live="polite" className="m-0 text-sm text-neutral-700">
          {visible.length} of {cases.length} cases shown
        </p>
      </div>
      <Divider className="my-4" />

      <div className="mb-6 grid grid-cols-1 gap-4 border-2 border-divider bg-neutral-100 p-[18px] sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Status" htmlFor="f-status">
          <Select id="f-status" aria-label="Filter cases by status" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
            {['All statuses', ...STATUSES].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
        <Field label="Department" htmlFor="f-dept">
          <Select id="f-dept" aria-label="Filter cases by department" value={fDept} onChange={(e) => setFDept(e.target.value)}>
            {['All departments', ...depts].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
        <Field label="Alert level" htmlFor="f-level">
          <Select id="f-level" aria-label="Filter cases by alert level" value={fLevel} onChange={(e) => setFLevel(e.target.value)}>
            {['All levels', ...LEVEL_OPTIONS].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
        <div className="flex items-end">
          <Button variant="secondary" onClick={() => { setFStatus('All statuses'); setFDept('All departments'); setFLevel('All levels') }}>
            Clear filters
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border-2 border-divider bg-bg">
        <table className="w-full min-w-[880px] border-collapse">
          <caption className="border-b-2 border-divider p-3.5 text-left text-[13px] text-neutral-700">
            All open and closed alert cases, most recently opened first.
          </caption>
          <thead>
            <tr>
              {['Intern', 'Department', 'Manager', 'Rule triggered', 'Alert level', 'Absences', 'Status', 'Opened'].map((h, i) => (
                <th key={h} scope="col" className={`p-3 text-[12px] tracking-[0.08em] uppercase ${i === 5 ? 'text-right' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => (
              <tr key={c.id} onClick={() => onOpenCase(c.id)} className="cursor-pointer transition hover:bg-neutral-200">
                <td className="p-3.5" style={{ borderLeft: c.level === 'Red Flag' ? '4px solid var(--color-accent)' : '4px solid transparent' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenCase(c.id)
                    }}
                    className="cursor-pointer border-0 bg-none p-0 text-left text-[15px] font-bold underline decoration-solid underline-offset-4"
                  >
                    {c.name}
                  </button>
                  <div className="text-xs text-neutral-700">{c.id}</div>
                </td>
                <td className="p-3.5 text-sm">{c.dept}</td>
                <td className="p-3.5 text-sm">{c.manager}</td>
                <td className="p-3.5 text-sm">{c.rule}</td>
                <td className="p-3.5">
                  <LevelBadge level={c.level} />
                </td>
                <td className="p-3.5 text-right font-bold tabular-nums">{c.count}</td>
                <td className="p-3.5">
                  <StatusBadge status={c.status} />
                </td>
                <td className="p-3.5 text-sm whitespace-nowrap text-neutral-800">{c.opened}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visible.length === 0 && (
        <p className="mt-5 border-2 border-dashed border-neutral-400 p-6 text-[15px] text-neutral-700">
          No cases match these filters. Clear one to widen the review.
        </p>
      )}
    </section>
  )
}
