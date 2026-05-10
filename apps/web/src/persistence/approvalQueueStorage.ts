const STORAGE_KEY = 'flow-approval-queue-v1'

export type ApprovalKind = 'hours_correction' | 'daily_review' | 'generic_request'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type ApprovalItem = {
  id: string
  kind: ApprovalKind
  title: string
  summary: string
  requesterUserId: string
  createdAt: string
  status: ApprovalStatus
  decidedByUserId?: string | null
  decidedAt?: string
}

function parse(raw: string | null): ApprovalItem[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isValid)
  } catch {
    return []
  }
}

function isValid(x: unknown): x is ApprovalItem {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.kind === 'string' &&
    typeof o.title === 'string' &&
    typeof o.summary === 'string' &&
    typeof o.requesterUserId === 'string' &&
    typeof o.createdAt === 'string' &&
    typeof o.status === 'string'
  )
}

function seed(): ApprovalItem[] {
  const t = new Date().toISOString()
  return [
    {
      id: 'appr-seed-1',
      kind: 'hours_correction',
      title: 'Revisão de horas — Projeto BI',
      summary: 'Solicitação para ajustar 8h registradas em março (ilustrativo).',
      requesterUserId: 'u2',
      createdAt: t,
      status: 'pending',
    },
    {
      id: 'appr-seed-2',
      kind: 'daily_review',
      title: 'Conferência de daily',
      summary: 'Daily de 12/05 marcada para revisão do líder técnico.',
      requesterUserId: 'u3',
      createdAt: t,
      status: 'pending',
    },
    {
      id: 'appr-seed-3',
      kind: 'generic_request',
      title: 'Acesso a ambiente de homologação',
      summary: 'Pedido de VPN / credencial temporária.',
      requesterUserId: 'u5',
      createdAt: t,
      status: 'approved',
      decidedByUserId: 'u1',
      decidedAt: t,
    },
  ]
}

export function loadApprovals(): ApprovalItem[] {
  const s = parse(localStorage.getItem(STORAGE_KEY))
  if (s.length === 0) {
    const init = seed()
    saveApprovals(init)
    return init
  }
  return s
}

export function saveApprovals(rows: ApprovalItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

export function notifyApprovalsChanged(): void {
  window.dispatchEvent(new Event('flow-approvals-changed'))
}

export function updateApproval(row: ApprovalItem): void {
  const all = loadApprovals()
  const i = all.findIndex((r) => r.id === row.id)
  if (i === -1) return
  const next = [...all]
  next[i] = row
  saveApprovals(next)
  notifyApprovalsChanged()
}

export function approvalKindLabel(k: ApprovalKind): string {
  switch (k) {
    case 'hours_correction':
      return 'Horas'
    case 'daily_review':
      return 'Daily'
    default:
      return 'Solicitação'
  }
}
