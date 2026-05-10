const STORAGE_KEY = 'flow-organization-settings-v1'

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
}

export const DEFAULT_ORGANIZATION_SETTINGS: OrganizationSettings = {
  displayName: 'Flow Admin',
  legalName: '',
  supportEmail: '',
  defaultTimezone: 'America/Sao_Paulo',
  dateLocale: 'pt-BR',
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
