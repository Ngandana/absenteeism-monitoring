import { useState } from 'react'
import { Button, Divider, StatTile } from '../components/ui'
import { resolveException } from '../lib/api'
import type { ExceptionRecord, SyncRun } from '../lib/types'

export function DataQuality({
  exceptions,
  syncLog,
  onResolved,
}: {
  exceptions: ExceptionRecord[]
  syncLog: SyncRun[]
  onResolved: (id: string) => void
}) {
  const [resolving, setResolving] = useState<string | null>(null)

  const pendingCount = exceptions.filter((e) => !e.resolved && e.state === 'Pending Review').length
  const errorCount = exceptions.filter((e) => !e.resolved && e.state === 'Data Error').length

  async function handleResolve(id: string) {
    setResolving(id)
    try {
      await resolveException(id)
      onResolved(id)
    } finally {
      setResolving(null)
    }
  }

  return (
    <section aria-labelledby="dq-h" className="animate-[dcfade_220ms_ease_both]">
      <h1 id="dq-h" className="m-0 text-[clamp(26px,4vw,38px)] tracking-tight">
        Data quality &amp; exceptions
      </h1>
      <p className="mt-2 max-w-[64ch] text-[15px] text-neutral-800">
        Records that could not be classified into a case, and the sync log behind them. Clearing these keeps the case list trustworthy — no alert
        is raised from an unresolved record.
      </p>
      <Divider className="my-[18px]" />

      <div className="mb-[30px] grid grid-cols-1 border-t-2 border-l-2 border-divider sm:grid-cols-3">
        <StatTile value={pendingCount} label="Pending Review" note="Awaiting a human classification" />
        <StatTile value={errorCount} label="Data Error" note="Mapping or duplication faults" />
        <StatTile value="1" label="Failed sync run (30 days)" note="Retried automatically and cleared" />
      </div>

      <h2 className="m-0 mb-3 text-lg font-extrabold">Records awaiting review</h2>
      <div className="mb-8 overflow-x-auto border-2 border-divider">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              {['Record', 'Intern', 'Date', 'Issue', 'State', 'Action'].map((h) => (
                <th key={h} scope="col" className="p-3 px-4 text-left text-[12px] tracking-[0.08em] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exceptions.map((e) => (
              <tr key={e.id}>
                <td className="p-3 px-4 text-[13px] text-neutral-800">{e.id}</td>
                <td className="p-3 px-4 text-sm font-semibold">{e.name}</td>
                <td className="p-3 px-4 text-sm whitespace-nowrap">{e.date}</td>
                <td className="p-3 px-4 text-sm">{e.issue}</td>
                <td className="p-3 px-4">
                  {e.resolved ? (
                    <span className="inline-flex items-center gap-1.5 border-[1.5px] border-neutral-500 px-[9px] py-[3px] text-[13px] font-semibold whitespace-nowrap text-neutral-800">
                      ✓ Resolved
                    </span>
                  ) : e.state === 'Data Error' ? (
                    <span className="inline-flex items-center gap-1.5 border-[1.5px] border-accent-700 bg-accent-200 px-[9px] py-[3px] text-[13px] font-bold whitespace-nowrap text-accent-800">
                      ⚠ Data Error
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 border-[1.5px] border-neutral-700 px-[9px] py-[3px] text-[13px] font-semibold whitespace-nowrap">
                      ○ Pending Review
                    </span>
                  )}
                </td>
                <td className="p-3 px-4">
                  <Button
                    variant="secondary"
                    disabled={e.resolved}
                    aria-busy={resolving === e.id}
                    onClick={() => handleResolve(e.id)}
                    className="whitespace-nowrap"
                  >
                    {e.resolved ? 'Resolved' : resolving === e.id ? 'Working…' : e.state === 'Data Error' ? 'Re-run mapping' : 'Mark reviewed'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="m-0 mb-3 text-lg font-extrabold">Sync log</h2>
      <div className="overflow-x-auto border-2 border-divider">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr>
              {['Run', 'Source', 'Records', 'Result', 'Retry'].map((h, i) => (
                <th key={h} scope="col" className={`p-3 px-4 text-[12px] tracking-[0.08em] uppercase ${i === 2 ? 'text-right' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {syncLog.map((s) => (
              <tr key={s.run}>
                <td className="p-3 px-4 text-sm font-semibold whitespace-nowrap">{s.run}</td>
                <td className="p-3 px-4 text-sm">{s.source}</td>
                <td className="p-3 px-4 text-right text-sm tabular-nums">{s.records}</td>
                <td className="p-3 px-4">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    {s.ok ? '✓' : '✕'} {s.result}
                  </span>
                  <div className="text-[13px] text-neutral-700">{s.detail}</div>
                </td>
                <td className="p-3 px-4 text-sm text-neutral-800">{s.retry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
