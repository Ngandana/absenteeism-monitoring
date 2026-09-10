import { useEffect, useMemo, useState } from 'react'
import { Nav, type ScreenKey } from './components/Nav'
import { Overview } from './pages/Overview'
import { AlertCases } from './pages/AlertCases'
import { CaseDetail } from './pages/CaseDetail'
import { ReferenceData } from './pages/ReferenceData'
import { DataQuality } from './pages/DataQuality'
import { fetchCases, fetchCycles, fetchExceptions, fetchSyncLog } from './lib/api'
import type { CaseRecord, Cycle, ExceptionRecord, SyncRun } from './lib/types'

type AppScreen = ScreenKey | 'detail'

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('overview')
  const [caseId, setCaseId] = useState<string | null>(null)
  const [levelFilter, setLevelFilter] = useState<string | null>(null)

  const [cases, setCases] = useState<CaseRecord[]>([])
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>([])
  const [syncLog, setSyncLog] = useState<SyncRun[]>([])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    Promise.all([fetchCases(), fetchCycles(), fetchExceptions(), fetchSyncLog()])
      .then(([c, cy, ex, sl]) => {
        setCases(c.cases)
        setCycles(cy.cycles)
        setExceptions(ex.exceptions)
        setSyncLog(sl.runs)
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : String(err)))
  }, [])

  const openCount = useMemo(() => cases.filter((c) => c.status !== 'Closed' && c.status !== 'Dismissed').length, [cases])
  const qualityBadge = useMemo(
    () => exceptions.filter((e) => !e.resolved && (e.state === 'Pending Review' || e.state === 'Data Error')).length,
    [exceptions],
  )
  const activeCase = caseId ? cases.find((c) => c.id === caseId) : null

  function navigate(s: ScreenKey) {
    setScreen(s)
    if (s !== 'cases') setLevelFilter(null)
  }

  function openCase(id: string) {
    setCaseId(id)
    setScreen('detail')
  }

  function viewLevel(level: string) {
    setLevelFilter(level)
    setScreen('cases')
  }

  function handleCaseSaved(updated: CaseRecord) {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  function handleExceptionResolved(id: string) {
    setExceptions((prev) => prev.map((e) => (e.id === id ? { ...e, resolved: true } : e)))
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-20 border-b-2 border-divider bg-bg">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3.5">
            <img src="/pillar5-logo.png" alt="Pillar 5 Group" className="h-11 w-auto flex-none" />
            <div className="min-w-0 border-l-2 border-divider pl-3.5">
              <div className="font-heading text-[17px] leading-tight font-extrabold tracking-tight">Intern Absenteeism Monitoring</div>
              <div className="text-[13px] leading-tight text-neutral-700">Airtable ← Jibble</div>
            </div>
          </div>
          <div className="flex min-h-11 items-center gap-2.5 border-2 border-divider px-3 py-1.5">
            <span aria-hidden="true" className="flex h-[26px] w-[26px] flex-none items-center justify-center bg-neutral-800 text-[11px] font-bold text-neutral-100">
              GA
            </span>
            <span className="text-[13px] leading-snug">
              Miss Gabby
              <br />
              <span className="text-neutral-700">Management</span>
            </span>
          </div>
        </div>
        <Nav screen={screen === 'detail' ? 'cases' : screen} onNavigate={navigate} openCaseCount={openCount} qualityBadge={qualityBadge} />
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pt-6 pb-16 sm:px-8">
        {loadError && (
          <p className="mb-6 border-2 border-accent-700 bg-accent-200 p-4 text-sm font-semibold text-accent-800">
            Couldn't reach the backend at the configured API URL ({loadError}). Start it with `npm start` in Backend/, or check
            Frontend/.env's VITE_API_BASE_URL.
          </p>
        )}

        {screen === 'overview' && <Overview cases={cases} cycles={cycles} onOpenCase={openCase} onViewLevel={viewLevel} />}
        {screen === 'cases' && <AlertCases cases={cases} initialLevel={levelFilter} onOpenCase={openCase} />}
        {screen === 'detail' && activeCase && (
          <CaseDetail initialCase={activeCase} onBack={() => setScreen('cases')} onSaved={handleCaseSaved} />
        )}
        {screen === 'reference' && <ReferenceData />}
        {screen === 'quality' && <DataQuality exceptions={exceptions} syncLog={syncLog} onResolved={handleExceptionResolved} />}
      </main>

      <footer className="border-t-2 border-divider bg-bg p-[18px] sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-6 gap-y-2 text-[13px] text-neutral-700">
          <span>Intern Absenteeism Monitoring System · Pillar 5 Group</span>
          <span>Read-only mirror of Airtable. No automated contact with interns.</span>
        </div>
      </footer>
    </div>
  )
}
