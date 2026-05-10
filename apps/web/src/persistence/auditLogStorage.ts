const STORAGE_KEY = 'flow-audit-log-v1'
const MAX_ENTRIES = 400

export type AuditLogEntry = {
  id: string
  /** ISO 8601 */
  at: string
  actorEmail: string | null
  /** Verbo curto: settings.update, security.matrix_saved, etc. */
  verb: string
  /** Recurso CASL ou rótulo livre (Organization, Security, …). */
  resource: string
  summary: string
}

function parseStored(raw: string | null): AuditLogEntry[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isValid)
  } catch {
    return []
  }
}

function isValid(x: unknown): x is AuditLogEntry {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.at === 'string' &&
    (o.actorEmail === null || typeof o.actorEmail === 'string') &&
    typeof o.verb === 'string' &&
    typeof o.resource === 'string' &&
    typeof o.summary === 'string'
  )
}

function seedEntries(): AuditLogEntry[] {
  const t = new Date().toISOString()
  return [
    {
      id: 'audit-seed-1',
      at: t,
      actorEmail: 'system',
      verb: 'bootstrap',
      resource: 'AuditLog',
      summary: 'Log de auditoria inicializado (ambiente de demonstração).',
    },
    {
      id: 'audit-seed-2',
      at: t,
      actorEmail: null,
      verb: 'info',
      resource: 'Organization',
      summary:
        'Em produção, eventos de login, CRUD e integrações seriam registrados automaticamente pela API.',
    },
  ]
}

export function loadAuditLogEntries(): AuditLogEntry[] {
  const stored = parseStored(localStorage.getItem(STORAGE_KEY))
  if (stored.length === 0) {
    const seed = seedEntries()
    saveAuditLogEntriesRaw(seed)
    return seed
  }
  return stored
}

function saveAuditLogEntriesRaw(entries: AuditLogEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function notifyAuditLogChanged(): void {
  window.dispatchEvent(new Event('flow-audit-log-changed'))
}

/**
 * Registra evento no front (demo). Em API real, o servidor seria a fonte da verdade.
 */
export type AuditLogInput = (Omit<AuditLogEntry, 'id' | 'at'>) & { id?: string }

export function recordAudit(entry: AuditLogInput): void {
  const row: AuditLogEntry = {
    id: entry.id ?? crypto.randomUUID(),
    at: new Date().toISOString(),
    actorEmail: entry.actorEmail,
    verb: entry.verb,
    resource: entry.resource,
    summary: entry.summary.slice(0, 500),
  }
  const rest = loadAuditLogEntries().filter((e) => e.id !== row.id)
  const next = [row, ...rest].slice(0, MAX_ENTRIES)
  saveAuditLogEntriesRaw(next)
  notifyAuditLogChanged()
}
