import { format, parseISO } from 'date-fns'

const STORAGE_KEY = 'flow-absences-v1'
const ILLUSTRATIVE_ANNUAL_VACATION_DAYS = 30

export type AbsenceType = 'vacation' | 'leave' | 'medical' | 'other'
export type AbsenceStatus = 'pending' | 'approved' | 'rejected'

export type AbsenceRecord = {
  id: string
  userId: string
  type: AbsenceType
  startDate: string
  endDate: string
  status: AbsenceStatus
  requestedAt: string
  decidedAt?: string
  approverUserId?: string | null
  notes?: string
  rejectReason?: string
}

function parse(raw: string | null): AbsenceRecord[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isValid)
  } catch {
    return []
  }
}

function isValid(x: unknown): x is AbsenceRecord {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.userId === 'string' &&
    typeof o.type === 'string' &&
    typeof o.startDate === 'string' &&
    typeof o.endDate === 'string' &&
    typeof o.status === 'string' &&
    typeof o.requestedAt === 'string'
  )
}

function seed(): AbsenceRecord[] {
  const t = new Date().toISOString()
  return [
    {
      id: 'abs-seed-1',
      userId: 'u2',
      type: 'vacation',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(Date.now() + 5 * 86400000), 'yyyy-MM-dd'),
      status: 'pending',
      requestedAt: t,
      notes: 'Recesso planejado (ilustrativo)',
    },
    {
      id: 'abs-seed-2',
      userId: 'u3',
      type: 'vacation',
      startDate: format(new Date(Date.now() - 20 * 86400000), 'yyyy-MM-dd'),
      endDate: format(new Date(Date.now() - 14 * 86400000), 'yyyy-MM-dd'),
      status: 'approved',
      requestedAt: t,
      decidedAt: t,
      approverUserId: 'u1',
      notes: 'Aprovado para demo',
    },
  ]
}

export function loadAbsences(): AbsenceRecord[] {
  const s = parse(localStorage.getItem(STORAGE_KEY))
  if (s.length === 0) {
    const init = seed()
    saveAbsences(init)
    return init
  }
  return s
}

export function saveAbsences(rows: AbsenceRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

export function notifyAbsencesChanged(): void {
  window.dispatchEvent(new Event('flow-absences-changed'))
}

export function addAbsence(row: AbsenceRecord): void {
  saveAbsences([row, ...loadAbsences()])
  notifyAbsencesChanged()
}

export function updateAbsence(row: AbsenceRecord): void {
  const all = loadAbsences()
  const i = all.findIndex((r) => r.id === row.id)
  if (i === -1) return
  const next = [...all]
  next[i] = row
  saveAbsences(next)
  notifyAbsencesChanged()
}

/** Dias corridos inclusivos entre duas datas YYYY-MM-DD. */
export function inclusiveCalendarDays(start: string, end: string): number {
  try {
    const a = parseISO(start)
    const b = parseISO(end)
    const ms = Math.max(0, b.getTime() - a.getTime())
    return Math.floor(ms / 86400000) + 1
  } catch {
    return 0
  }
}

/** Saldo ilustrativo de férias (dias corridos) no ano civil. */
export function vacationBalanceForUser(userId: string, year: number): {
  entitlement: number
  usedApproved: number
  remaining: number
} {
  const rows = loadAbsences().filter(
    (r) =>
      r.userId === userId &&
      r.type === 'vacation' &&
      r.status === 'approved' &&
      parseISO(r.startDate).getFullYear() <= year &&
      parseISO(r.endDate).getFullYear() >= year,
  )
  let used = 0
  for (const r of rows) {
    const start = parseISO(r.startDate).getFullYear() < year ? `${year}-01-01` : r.startDate
    const end = parseISO(r.endDate).getFullYear() > year ? `${year}-12-31` : r.endDate
    used += inclusiveCalendarDays(start, end)
  }
  const entitlement = ILLUSTRATIVE_ANNUAL_VACATION_DAYS
  return {
    entitlement,
    usedApproved: used,
    remaining: Math.max(0, entitlement - used),
  }
}

export function absenceTypeLabel(t: AbsenceType): string {
  switch (t) {
    case 'vacation':
      return 'Férias'
    case 'leave':
      return 'Ausência'
    case 'medical':
      return 'Saúde'
    default:
      return 'Outro'
  }
}
