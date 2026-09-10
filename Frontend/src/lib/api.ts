import type { CaseRecord, Cycle, ExceptionRecord, ReferenceRecord, ReferenceTableKey, SyncRun } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || body.message || `${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

export function fetchCases() {
  return request<{ sample: boolean; cases: CaseRecord[] }>('/api/cases')
}

export function fetchCase(id: string) {
  return request<{ sample: boolean; case: CaseRecord }>(`/api/cases/${id}`)
}

export function patchCase(id: string, patch: { status?: string; action?: string; notes?: string }) {
  return request<{ sample: boolean; persisted: boolean; case: CaseRecord }>(`/api/cases/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export function fetchCycles() {
  return request<{ sample: boolean; cycles: Cycle[] }>('/api/cycles')
}

export function fetchExceptions() {
  return request<{ sample: boolean; exceptions: ExceptionRecord[] }>('/api/exceptions')
}

export function resolveException(id: string) {
  return request<{ sample: boolean; persisted: boolean; id: string; resolved: boolean }>(
    `/api/exceptions/${id}/resolve`,
    { method: 'PATCH' },
  )
}

export function fetchSyncLog() {
  return request<{ sample: boolean; runs: SyncRun[] }>('/api/sync-log')
}

export function fetchReferenceTable(table: ReferenceTableKey) {
  return request<{ table: string; count: number; records: ReferenceRecord[] }>(`/api/reference/${table}`)
}
