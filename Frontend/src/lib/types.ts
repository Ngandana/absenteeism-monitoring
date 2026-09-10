export type CaseDate = {
  date: string
  type: string
  source: string
  counts: boolean
}

export type CaseHistoryEntry = {
  what: string
  who: string
  when: string
}

export type AlertLevel = 'Early Warning' | 'Concern' | 'Consultation' | 'Red Flag'
export type CaseStatus = 'New' | 'Under Review' | 'Action Required' | 'Dismissed' | 'Closed'

export type CaseRecord = {
  id: string
  name: string
  dept: string
  manager: string
  status: CaseStatus
  opened: string
  cycle: string
  dates: CaseDate[]
  history: CaseHistoryEntry[]
  count: number
  level: AlertLevel
  rule: string
  action?: string
  notes?: string
}

export type Cycle = {
  label: string
  value: number
}

export type ExceptionRecord = {
  id: string
  name: string
  date: string
  issue: string
  state: 'Pending Review' | 'Data Error'
  resolved: boolean
}

export type SyncRun = {
  run: string
  source: string
  records: number
  result: string
  detail: string
  ok: boolean
  retry: string
}

export type ReferenceTableKey = 'alert-recipients' | 'leave-policies' | 'absence-rules'

export type ReferenceRecord = {
  id: string
  primary: string
  fields: Record<string, unknown>
}
