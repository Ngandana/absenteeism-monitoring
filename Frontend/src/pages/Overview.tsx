import { useMemo } from 'react'
import { LEVELS, MarkScale, Divider, LevelBadge, StatusBadge } from '../components/ui'
import type { CaseRecord, Cycle } from '../lib/types'

export function Overview({
  cases,
  cycles,
  onOpenCase,
  onViewLevel,
}: {
  cases: CaseRecord[]
  cycles: Cycle[]
  onOpenCase: (id: string) => void
  onViewLevel: (level: string) => void
}) {
  const open = useMemo(() => cases.filter((c) => c.status !== 'Closed' && c.status !== 'Dismissed'), [cases])

  const levelStats = LEVELS.map((label, i) => {
    const count = open.filter((c) => c.level === label).length
    const notes = ['2–4 qualifying absences', '5–6 qualifying absences', '7–9 qualifying absences', '10 or more — review promptly']
    return { label, count, step: i + 1, note: notes[i] }
  })

  const depts = [...new Set(cases.map((c) => c.dept))]
  const deptCounts = depts
    .map((name) => {
      const rows = open.filter((c) => c.dept === name)
      return { name, total: rows.length, red: rows.filter((c) => c.level === 'Red Flag').length }
    })
    .filter((d) => d.total > 0)
    .sort((a, b) => b.total - a.total)
  const deptMax = Math.max(1, ...deptCounts.map((d) => d.total))

  const cycMax = Math.max(1, ...cycles.map((c) => c.value))
  const cycAvg = cycles.length ? cycles.reduce((a, c) => a + c.value, 0) / cycles.length : 0

  const priorityCases = cases.filter((c) => c.status === 'New' || c.status === 'Action Required').slice(0, 4)

  return (
    <section aria-labelledby="ov-h" className="animate-[dcfade_220ms_ease_both]">
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-3">
        <h1 id="ov-h" className="m-0 text-[clamp(26px,4vw,38px)] tracking-tight">
          Overview
        </h1>
        <p className="m-0 text-sm text-neutral-700">{open.length} open cases</p>
      </div>
      <Divider className="my-4" />

      <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 className="m-0 text-[13px] font-bold tracking-[0.12em] text-neutral-700 uppercase">Open cases by alert level</h2>
        <p className="m-0 text-[13px] text-neutral-700">Thresholds 2 / 5 / 7 / 10 days per rolling cycle — pending sign-off (see decisions log).</p>
      </div>
      <div className="mb-8 grid grid-cols-2 border-t-2 border-l-2 border-divider sm:grid-cols-4">
        {levelStats.map((lv) => (
          <button
            key={lv.label}
            type="button"
            onClick={() => onViewLevel(lv.label)}
            aria-label={`${lv.count} open ${lv.label} cases. View filtered list.`}
            className="flex min-h-[150px] cursor-pointer flex-col gap-2.5 border-r-2 border-b-2 border-divider bg-bg p-4 text-left transition hover:-translate-y-0.5 hover:bg-neutral-200"
          >
            <MarkScale step={lv.step} size={18} />
            <span className="font-heading text-[44px] leading-none font-extrabold tracking-tight">{lv.count}</span>
            <span className="text-[15px] font-bold">{lv.label}</span>
            <span className="mt-auto text-[13px] text-neutral-700">{lv.note}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 border-t-2 border-l-2 border-divider md:grid-cols-2">
        <div className="border-r-2 border-b-2 border-divider bg-bg p-5">
          <h2 className="m-0 mb-1 text-base font-extrabold">Open cases by department</h2>
          <p className="m-0 mb-2 text-[13px] text-neutral-700">Hover a bar for the exact split.</p>
          <ul className="m-0 mb-4 flex list-none flex-wrap gap-x-[18px] gap-y-1.5 p-0 text-xs text-neutral-800">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2.5 w-4 bg-neutral-800" /> Early Warning – Consultation
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2.5 w-4 border border-accent-800 bg-accent" /> Red Flag
            </li>
          </ul>
          <div className="flex flex-col gap-3.5">
            {deptCounts.map((d) => (
              <div key={d.name}>
                <div className="mb-1 flex justify-between gap-3 text-[13px]">
                  <span className="font-semibold">{d.name}</span>
                  <span className="tabular-nums text-neutral-700">{d.total}</span>
                </div>
                <div
                  role="img"
                  aria-label={`${d.name}: ${d.total} open — ${d.total - d.red} Early Warning to Consultation, ${d.red} Red Flag`}
                  className="flex h-[18px] bg-neutral-200"
                >
                  <span className="bg-neutral-800 transition-[width]" style={{ width: `${((d.total - d.red) / deptMax) * 100}%` }} />
                  <span className="bg-accent transition-[width]" style={{ width: `${(d.red / deptMax) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-r-2 border-b-2 border-divider bg-bg p-5">
          <h2 className="m-0 mb-1 text-base font-extrabold">Qualifying absences per 30-day cycle</h2>
          <p className="m-0 mb-2 text-[13px] text-neutral-700">Six most recent cycles.</p>
          <div className="relative border-l border-neutral-300 border-b-2 border-b-divider px-1">
            <div
              aria-hidden="true"
              className="absolute right-0 left-0 border-t-2 border-dashed border-neutral-700 opacity-80"
              style={{ bottom: `${(cycAvg / cycMax) * 150}px` }}
            />
            <div className="flex h-[180px] items-end gap-2 sm:gap-4">
              {cycles.map((c) => (
                <div key={c.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`Cycle ${c.label}: ${c.value} qualifying absences`}>
                  <span className="text-xs font-bold tabular-nums">{c.value}</span>
                  <span className="w-full bg-neutral-800" style={{ height: `${(c.value / cycMax) * 150}px` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2 sm:gap-4">
            {cycles.map((c) => (
              <span key={c.label} className="flex-1 text-center text-[11px] text-neutral-700">
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 border-2 border-divider bg-bg">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-divider px-5 py-4">
          <h2 className="m-0 text-base font-extrabold">Needs a decision first</h2>
        </div>
        {priorityCases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onOpenCase(c.id)}
            aria-label={`Open case ${c.id} for ${c.name}, ${c.level}, status ${c.status}`}
            className="grid min-h-14 w-full cursor-pointer grid-cols-1 items-center gap-2 border-0 border-b border-neutral-300 bg-bg px-5 py-3.5 text-left transition hover:bg-neutral-200 sm:grid-cols-4"
          >
            <span className="text-[15px] font-bold">
              {c.name}
              <br />
              <span className="text-[13px] font-normal text-neutral-700">{c.dept}</span>
            </span>
            <span className="text-[13px] text-neutral-800">{c.rule}</span>
            <LevelBadge level={c.level} />
            <span className="text-[13px] text-neutral-700">
              <StatusBadge status={c.status} /> · opened {c.opened}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
