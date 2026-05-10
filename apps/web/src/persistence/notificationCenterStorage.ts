const STORAGE_KEY = 'flow-notification-center-v1'
const MAX_PER_USER = 80

export type NotificationItem = {
  id: string
  userId: string
  title: string
  body: string
  createdAt: string
  read: boolean
  href?: string
}

function parse(raw: string | null): NotificationItem[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isValid)
  } catch {
    return []
  }
}

function isValid(x: unknown): x is NotificationItem {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.userId === 'string' &&
    typeof o.title === 'string' &&
    typeof o.body === 'string' &&
    typeof o.createdAt === 'string' &&
    typeof o.read === 'boolean'
  )
}

function seedForUser(userId: string): NotificationItem[] {
  const t = new Date().toISOString()
  return [
    {
      id: `notif-seed-${userId}-1`,
      userId,
      title: 'Prazo de entrega em 3 dias',
      body: 'Há marcos ilustrativos configurados na timeline — confira alocações.',
      createdAt: t,
      read: false,
      href: '/allocations',
    },
    {
      id: `notif-seed-${userId}-2`,
      userId,
      title: 'Digest semanal',
      body: 'Resumo: 2 dailies pendentes de revisão e 1 solicitação na fila de aprovações.',
      createdAt: t,
      read: false,
      href: '/people/approvals',
    },
  ]
}

export function loadAllNotifications(): NotificationItem[] {
  return parse(localStorage.getItem(STORAGE_KEY))
}

export function saveAllNotifications(rows: NotificationItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, 500)))
}

export function notifyNotificationCenterChanged(): void {
  window.dispatchEvent(new Event('flow-notifications-changed'))
}

/** Garante seeds mínimos por usuário logado (primeira visita). */
export function ensureNotificationsForUser(userId: string): void {
  const all = loadAllNotifications()
  if (all.some((n) => n.userId === userId)) return
  const merged = [...seedForUser(userId), ...all]
  saveAllNotifications(merged)
  notifyNotificationCenterChanged()
}

export function listNotificationsForUser(userId: string): NotificationItem[] {
  return loadAllNotifications()
    .filter((n) => n.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function unreadCountForUser(userId: string): number {
  return listNotificationsForUser(userId).filter((n) => !n.read).length
}

export function appendNotifications(items: NotificationItem[]): void {
  const rest = loadAllNotifications().filter((x) => !items.some((i) => i.id === x.id))
  const byUser = new Map<string, NotificationItem[]>()
  for (const n of [...items, ...rest]) {
    const list = byUser.get(n.userId) ?? []
    list.push(n)
    byUser.set(n.userId, list)
  }
  const flat: NotificationItem[] = []
  for (const [, list] of byUser) {
    flat.push(...list.slice(0, MAX_PER_USER).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)))
  }
  saveAllNotifications(flat)
  notifyNotificationCenterChanged()
}

export function markRead(userId: string, id: string): void {
  const all = loadAllNotifications().map((n) =>
    n.id === id && n.userId === userId ? { ...n, read: true } : n,
  )
  saveAllNotifications(all)
  notifyNotificationCenterChanged()
}

export function markAllRead(userId: string): void {
  const all = loadAllNotifications().map((n) =>
    n.userId === userId ? { ...n, read: true } : n,
  )
  saveAllNotifications(all)
  notifyNotificationCenterChanged()
}

/** Demo: simula digest com vários avisos de uma vez. */
export function appendDigestDemo(userId: string): void {
  const now = Date.now()
  const batch: NotificationItem[] = Array.from({ length: 4 }, (_, i) => ({
    id: crypto.randomUUID(),
    userId,
    title: `Digest · item ${i + 1}`,
    body: 'Conteúdo ilustrativo gerado localmente. Em produção viria de agregação no servidor.',
    createdAt: new Date(now - i * 60000).toISOString(),
    read: false,
    href: i % 2 === 0 ? '/people/approvals' : '/daily-status',
  }))
  appendNotifications(batch)
}
