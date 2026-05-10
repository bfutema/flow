const STORAGE_KEY = 'flow-organization-settings-v1'

export type BackupFrequency = 'daily' | 'weekly' | 'monthly'

export type OrganizationSettings = {
  /** Nome exibido na UI (sidebar, título). */
  displayName: string
  /** Razão social / nome legal (opcional em demos). */
  legalName: string
  /** E-mail de suporte ou contato institucional. */
  supportEmail: string
  /** Fuso IANA para textos de data relativos (referência white-label). */
  defaultTimezone: string
  /** Locale para datas e números na UI. */
  dateLocale: 'pt-BR' | 'en-US'
  /** Timeout de sessão em minutos (referência MVP). */
  sessionTimeoutMinutes: number
  /** Tentativas máximas de login antes de bloquear (MVP). */
  maxLoginAttempts: number
  /** Tamanho mínimo de senha (MVP). */
  minPasswordLength: number
  /** Exigir senha forte (MVP, sem enforcement real). */
  requireStrongPassword: boolean
  /** Autenticação em dois fatores (MVP, requer backend). */
  mfaEnabled: boolean
  /** Backup automático (MVP local). */
  backupAutomatic: boolean
  /** Frequência ilustrativa de backup. */
  backupFrequency: BackupFrequency
  /** Horário preferencial para backup (HH:mm). */
  backupTime: string
  /** Dias de retenção de backups (ilustrativo). */
  backupRetentionDays: number
  /** Backup em nuvem (MVP). */
  backupCloud: boolean
  /** Lembretes de prazo na interface (MVP local). */
  notifyDeadlineInApp: boolean
  /** Avisos sobre pendências na fila de aprovação (MVP local). */
  notifyApprovalPending: boolean
  /** Registrar ações relevantes na auditoria local (demo). */
  auditRecordActions: boolean
  /** Exigir verificação de e-mail para novos usuários — requer backend (demo). */
  requireEmailVerified: boolean
}

export const DEFAULT_ORGANIZATION_SETTINGS: OrganizationSettings = {
  displayName: 'Flow Admin',
  legalName: '',
  supportEmail: '',
  defaultTimezone: 'America/Sao_Paulo',
  dateLocale: 'pt-BR',
  sessionTimeoutMinutes: 30,
  maxLoginAttempts: 5,
  minPasswordLength: 8,
  requireStrongPassword: true,
  mfaEnabled: false,
  backupAutomatic: true,
  backupFrequency: 'daily',
  backupTime: '02:00',
  backupRetentionDays: 30,
  backupCloud: false,
  notifyDeadlineInApp: true,
  notifyApprovalPending: true,
  auditRecordActions: true,
  requireEmailVerified: false,
}

function asBool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback
}

function asInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number.parseInt(v, 10) : NaN
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.trunc(n)))
}

function asBackupFrequency(v: unknown): BackupFrequency {
  if (v === 'weekly' || v === 'monthly') return v
  return 'daily'
}

function asTimeHHmm(v: unknown, fallback: string): string {
  if (typeof v !== 'string' || !/^\d{1,2}:\d{2}$/.test(v.trim())) return fallback
  const [h, m] = v.trim().split(':').map(Number)
  if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59) return fallback
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function clampSettings(raw: unknown): OrganizationSettings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_ORGANIZATION_SETTINGS }
  const o = raw as Record<string, unknown>
  const dateLocale = o.dateLocale === 'en-US' ? 'en-US' : 'pt-BR'
  return {
    displayName:
      typeof o.displayName === 'string' && o.displayName.trim()
        ? o.displayName.trim().slice(0, 120)
        : DEFAULT_ORGANIZATION_SETTINGS.displayName,
    legalName:
      typeof o.legalName === 'string' ? o.legalName.trim().slice(0, 200) : '',
    supportEmail:
      typeof o.supportEmail === 'string' ? o.supportEmail.trim().slice(0, 120) : '',
    defaultTimezone:
      typeof o.defaultTimezone === 'string' && o.defaultTimezone.trim()
        ? o.defaultTimezone.trim().slice(0, 80)
        : DEFAULT_ORGANIZATION_SETTINGS.defaultTimezone,
    dateLocale,
    sessionTimeoutMinutes: asInt(
      o.sessionTimeoutMinutes,
      5,
      480,
      DEFAULT_ORGANIZATION_SETTINGS.sessionTimeoutMinutes,
    ),
    maxLoginAttempts: asInt(
      o.maxLoginAttempts,
      1,
      20,
      DEFAULT_ORGANIZATION_SETTINGS.maxLoginAttempts,
    ),
    minPasswordLength: asInt(
      o.minPasswordLength,
      6,
      32,
      DEFAULT_ORGANIZATION_SETTINGS.minPasswordLength,
    ),
    requireStrongPassword: asBool(
      o.requireStrongPassword,
      DEFAULT_ORGANIZATION_SETTINGS.requireStrongPassword,
    ),
    mfaEnabled: asBool(o.mfaEnabled, DEFAULT_ORGANIZATION_SETTINGS.mfaEnabled),
    backupAutomatic: asBool(o.backupAutomatic, DEFAULT_ORGANIZATION_SETTINGS.backupAutomatic),
    backupFrequency: asBackupFrequency(o.backupFrequency),
    backupTime: asTimeHHmm(o.backupTime, DEFAULT_ORGANIZATION_SETTINGS.backupTime),
    backupRetentionDays: asInt(
      o.backupRetentionDays,
      1,
      365,
      DEFAULT_ORGANIZATION_SETTINGS.backupRetentionDays,
    ),
    backupCloud: asBool(o.backupCloud, DEFAULT_ORGANIZATION_SETTINGS.backupCloud),
    notifyDeadlineInApp: asBool(o.notifyDeadlineInApp, DEFAULT_ORGANIZATION_SETTINGS.notifyDeadlineInApp),
    notifyApprovalPending: asBool(
      o.notifyApprovalPending,
      DEFAULT_ORGANIZATION_SETTINGS.notifyApprovalPending,
    ),
    auditRecordActions: asBool(o.auditRecordActions, DEFAULT_ORGANIZATION_SETTINGS.auditRecordActions),
    requireEmailVerified: asBool(
      o.requireEmailVerified,
      DEFAULT_ORGANIZATION_SETTINGS.requireEmailVerified,
    ),
  }
}

export function loadOrganizationSettings(): OrganizationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_ORGANIZATION_SETTINGS }
    return clampSettings(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_ORGANIZATION_SETTINGS }
  }
}

export function saveOrganizationSettings(next: OrganizationSettings): void {
  const clamped = clampSettings(next)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clamped))
  window.dispatchEvent(new Event('flow-organization-settings-changed'))
}

export function resetOrganizationSettings(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ORGANIZATION_SETTINGS))
  window.dispatchEvent(new Event('flow-organization-settings-changed'))
}
