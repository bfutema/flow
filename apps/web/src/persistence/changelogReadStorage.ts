const STORAGE_KEY = 'flow-changelog-last-seen-release-v1'

export function loadLastSeenRelease(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveLastSeenRelease(iso: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, iso)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('flow-changelog-read-changed'))
}

/** Quantidade de entradas com `releasedAt` estritamente maior que o último “visto”. */
export function changelogUnreadCount(entries: { releasedAt: string }[]): number {
  const last = loadLastSeenRelease()
  if (!last) return entries.length
  return itemsNewerThan(entries, last).length
}

function itemsNewerThan<T extends { releasedAt: string }>(entries: T[], lastSeenIso: string): T[] {
  return entries.filter((e) => e.releasedAt > lastSeenIso)
}
