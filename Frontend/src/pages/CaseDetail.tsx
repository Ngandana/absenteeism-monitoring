import { useEffect, useState } from 'react'
import { Button, Divider, Field, levelStep, MarkScale, Select, Textarea } from '../components/ui'
import { patchCase } from '../lib/api'
import type { CaseRecord } from '../lib/types'

const STATUSES = ['New', 'Under Review', 'Action Required', 'Dismissed', 'Closed']
const ACTIONS = ['No Action', 'Continue Monitoring', 'Management Discussion', 'Schedule Consultation', 'Formal Action Review', 'Other']

function notesProblem(notes: string): string {
  const v = notes.trim()
  if (!v) return 'Decision notes are required before saving.'
  if (v.length < 15) return 'Add a little more detail — at least 15 characters.'
  return ''
}

export function CaseDetail({ initialCase, onBack, onSaved }: { initialCase: CaseRecord; onBack: () => void; onSaved: (c: CaseRecord) => void }) {
  const [caseData, setCaseData] = useState(initialCase)
  const [status, setStatus] = useState(initialCase.status)
  const [action, setAction] = useState(initialCase.action || 'No Action')
  const [notes, setNotes] = useState(initialCase.notes || '')
  const [notesTouched, setNotesTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setCaseData(initialCase)
    setStatus(initialCase.status)
    setAction(initialCase.action || 'No Action')
    setNotes(initialCase.notes || '')
    setNotesTouched(false)
    setSavedMsg('')
  }, [initialCase])

  const notesError = notesTouched ? notesProblem(notes) : ''
  const step = levelStep(caseData.level)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const problem = notesProblem(notes)
    if (problem) {
      setNotesTouched(true)
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await patchCase(caseData.id, { status, action, notes })
      setCaseData(res.case)
      onSaved(res.case)
      setSavedMsg('Decision saved (in-memory sample) · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-labelledby="cd-h" className="animate-[dcfade_220ms_ease_both]">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to alert case list"
        className="mb-3 inline-flex min-h-11 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm font-semibold text-neutral-800 hover:text-accent-700"
      >
        ← All cases
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="m-0 text-[13px] tracking-[0.1em] text-neutral-700 uppercase">
            Case {caseData.id} · opened {caseData.opened}
          </p>
          <h1 id="cd-h" className="mt-1 mb-0 text-[clamp(26px,4vw,38px)] tracking-tight">
            {caseData.name}
          </h1>
        </div>
        <span className="flex items-center gap-2.5 border-2 border-divider px-3.5 py-2.5">
          <MarkScale step={step} size={18} />
          <span className="text-[15px] font-bold">{caseData.level}</span>
          <span className="text-[13px] text-neutral-700">step {step} of 4</span>
        </span>
      </div>
      <Divider className="mt-4" />

      <div className="grid grid-cols-1 border-t-2 border-l-2 border-divider sm:grid-cols-2">
        <dl className="m-0 grid grid-cols-2 gap-4 border-r-2 border-b-2 border-divider p-[18px] sm:grid-cols-3">
          <div>
            <dt className="text-xs tracking-[0.08em] text-neutral-700 uppercase">Department</dt>
            <dd className="mt-1 mb-0 text-[15px] font-semibold">{caseData.dept}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.08em] text-neutral-700 uppercase">Reporting manager</dt>
            <dd className="mt-1 mb-0 text-[15px] font-semibold">{caseData.manager}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.08em] text-neutral-700 uppercase">Qualifying absences</dt>
            <dd className="mt-1 mb-0 text-[15px] font-semibold">{caseData.count}</dd>
          </div>
        </dl>
        <dl className="m-0 grid grid-cols-2 gap-4 border-r-2 border-b-2 border-divider p-[18px]">
          <div>
            <dt className="text-xs tracking-[0.08em] text-neutral-700 uppercase">Rule triggered</dt>
            <dd className="mt-1 mb-0 text-[15px] font-semibold">{caseData.rule}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.08em] text-neutral-700 uppercase">30-day cycle</dt>
            <dd className="mt-1 mb-0 text-[15px] font-semibold">{caseData.cycle}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-7 grid grid-cols-1 items-start gap-7 lg:grid-cols-2">
        <div>
          <h2 className="m-0 mb-1 text-base font-extrabold">Evidence — qualifying absence dates</h2>
          <p className="m-0 mb-3.5 text-[13px] text-neutral-700">
            Synced from Jibble. Approved leave, public holidays and Pending Review days are held out of the count.
          </p>
          <div className="overflow-x-auto border-2 border-divider">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Date', 'Classification', 'Source record', 'Counts'].map((h) => (
                    <th key={h} scope="col" className="p-2.5 px-4 text-left text-[12px] tracking-[0.08em] uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {caseData.dates.map((d) => (
                  <tr key={d.date + d.source}>
                    <td className="p-3 px-4 text-sm font-semibold whitespace-nowrap">{d.date}</td>
                    <td className="p-3 px-4 text-sm">{d.type}</td>
                    <td className="p-3 px-4 text-[13px] text-neutral-700">{d.source}</td>
                    <td className="p-3 px-4 text-[13px]">
                      {d.counts ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold">✓ Yes</span>
                      ) : (
                        <span className="text-neutral-700">Excluded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-7 mb-3 text-base font-extrabold">Case history</h2>
          <ol className="m-0 list-none border-l-2 border-divider p-0">
            {caseData.history.map((h, i) => (
              <li key={i} className="relative py-0 pb-[18px] pl-[18px]">
                <span aria-hidden="true" className="absolute top-1.5 left-[-6px] h-2.5 w-2.5 bg-neutral-800" />
                <p className="m-0 text-sm font-semibold">{h.what}</p>
                <p className="mt-0.5 mb-0 text-[13px] text-neutral-700">
                  {h.who} · {h.when}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={handleSubmit} aria-label="Case review decision" className="border-2 border-divider bg-bg">
          <div className="flex items-start gap-3 border-b-2 border-divider bg-neutral-200 p-[18px]">
            <p className="m-0 text-sm">
              <strong>Review and decide only.</strong> Nothing on this screen contacts the intern. Any conversation, consultation or formal step is
              arranged by a person after this record is saved.
            </p>
          </div>

          <div className="flex flex-col gap-[22px] p-[18px]">
            <fieldset className="m-0 border-0 p-0">
              <legend className="pb-2 text-sm font-bold">Case status</legend>
              <div role="radiogroup" aria-label="Case status" className="flex flex-wrap border-2 border-divider">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s as CaseRecord['status'])}
                    aria-pressed={status === s}
                    className="min-h-11 flex-1 cursor-pointer p-2.5 text-left text-[13px] font-semibold transition-colors"
                    style={{ background: status === s ? 'var(--color-neutral-900)' : 'transparent', color: status === s ? 'var(--color-neutral-100)' : 'var(--color-text)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <Field label="Action decision" htmlFor="d-action" hint="What you have decided to do next, off-system.">
              <Select id="d-action" aria-label="Action decision for this case" value={action} onChange={(e) => setAction(e.target.value)}>
                {ACTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </Field>

            <Field label="Decision notes" htmlFor="d-notes" hint="Required. Record the evidence you relied on and any context (min. 15 characters).">
              <Textarea
                id="d-notes"
                rows={5}
                aria-invalid={!!notesError}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => setNotesTouched(true)}
                placeholder="e.g. Three unexcused absences confirmed against Jibble records; pattern is Monday-only. Scheduling a discussion with the department lead."
                style={{ borderColor: notesError ? 'var(--color-accent-700)' : undefined }}
              />
              <p aria-live="polite" className="mt-1.5 mb-0 min-h-5 text-[13px] font-semibold text-accent-700">
                {notesError}
              </p>
            </Field>

            {error && <p className="m-0 text-[13px] font-semibold text-accent-700">{error}</p>}

            <div className="flex flex-wrap items-center gap-3 border-t-2 border-divider pt-4">
              <Button type="submit" variant="primary" aria-busy={saving} disabled={saving}>
                {saving ? 'Saving decision…' : 'Save decision'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setStatus(caseData.status)
                  setAction(caseData.action || 'No Action')
                  setNotes(caseData.notes || '')
                  setNotesTouched(false)
                }}
              >
                Discard changes
              </Button>
              <p aria-live="polite" className="m-0 text-sm font-semibold text-neutral-800">
                {savedMsg}
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
