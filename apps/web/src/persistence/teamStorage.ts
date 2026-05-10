const STORAGE_KEY = 'flow-teams-v1'

export type TeamRecord = {
  id: string
  name: string
  description: string
  memberIds: string[]
  linkedProjectIds: string[]
  createdAt: string
}

function parse(raw: string | null): TeamRecord[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isValid)
  } catch {
    return []
  }
}

function isValid(x: unknown): x is TeamRecord {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.description === 'string' &&
    Array.isArray(o.memberIds) &&
    Array.isArray(o.linkedProjectIds) &&
    typeof o.createdAt === 'string'
  )
}

function seed(): TeamRecord[] {
  const t = new Date().toISOString()
  return [
    {
      id: 'team-seed-1',
      name: 'Squad Plataforma',
      description: 'Evolutivas do núcleo administrativo e integrações.',
      memberIds: ['u1', 'u2', 'u5'],
      linkedProjectIds: ['ecommerce', 'bi'],
      createdAt: t,
    },
    {
      id: 'team-seed-2',
      name: 'Stream cliente CRM',
      description: 'Time focado em CRM e dados comerciais.',
      memberIds: ['u3', 'u6'],
      linkedProjectIds: ['crm'],
      createdAt: t,
    },
  ]
}

export function loadTeams(): TeamRecord[] {
  const s = parse(localStorage.getItem(STORAGE_KEY))
  if (s.length === 0) {
    const init = seed()
    saveTeams(init)
    return init
  }
  return s
}

export function saveTeams(rows: TeamRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

export function notifyTeamsChanged(): void {
  window.dispatchEvent(new Event('flow-teams-changed'))
}

export function upsertTeam(row: TeamRecord): void {
  const all = loadTeams().filter((t) => t.id !== row.id)
  saveTeams([row, ...all])
  notifyTeamsChanged()
}

export function deleteTeam(id: string): void {
  saveTeams(loadTeams().filter((t) => t.id !== id))
  notifyTeamsChanged()
}
