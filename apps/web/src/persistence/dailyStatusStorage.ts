import { format, subDays } from 'date-fns'

const STORAGE_KEY = 'flow-daily-status-v1'

export type DailyStatusEntry = {
  id: string
  userId: string
  /** YYYY-MM-DD (dia da daily no fuso local ao registrar). */
  date: string
  projectId: string | null
  /** Texto livre, ex.: "5h24", "8h" — declarado pelo colaborador. */
  hoursDeclared: string
  doneItems: string[]
  nextItems: string[]
  createdAt: string
  updatedAt: string
}

function parseStored(raw: string | null): DailyStatusEntry[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isValidEntry)
  } catch {
    return []
  }
}

function isValidEntry(x: unknown): x is DailyStatusEntry {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.userId === 'string' &&
    typeof o.date === 'string' &&
    (o.projectId === null || typeof o.projectId === 'string') &&
    typeof o.hoursDeclared === 'string' &&
    Array.isArray(o.doneItems) &&
    Array.isArray(o.nextItems) &&
    typeof o.createdAt === 'string' &&
    typeof o.updatedAt === 'string'
  )
}

function seedEntries(): DailyStatusEntry[] {
  const now = new Date()
  const today = format(now, 'yyyy-MM-dd')
  const y = format(subDays(now, 1), 'yyyy-MM-dd')
  const t = now.toISOString()
  return [
    {
      id: 'ds-seed-1',
      userId: 'u2',
      date: today,
      projectId: 'ecommerce',
      hoursDeclared: '5h24',
      doneItems: [
        'Revisão do fluxo de checkout no ambiente de homologação',
        'Pair programming na correção de timeout na API de catálogo',
      ],
      nextItems: ['Subir feature flag do novo carrinho para QA'],
      createdAt: t,
      updatedAt: t,
    },
    {
      id: 'ds-seed-2',
      userId: 'u1',
      date: today,
      projectId: 'bi',
      hoursDeclared: '3h12',
      doneItems: ['Dashboard executivo: ajustes de filtro por período'],
      nextItems: [],
      createdAt: t,
      updatedAt: t,
    },
    {
      id: 'ds-seed-3',
      userId: 'u3',
      date: y,
      projectId: 'crm',
      hoursDeclared: '8h00',
      doneItems: [
        'Documentação do módulo de oportunidades',
        'Suporte a pré-vendas na demo interna',
      ],
      nextItems: ['Alinhar critérios de scoring com marketing'],
      createdAt: t,
      updatedAt: t,
    },
    {
      id: 'ds-seed-4',
      userId: 'u2',
      date: y,
      projectId: 'faturamento',
      hoursDeclared: '6h45',
      doneItems: ['Validação de NF-e em lote no novo worker'],
      nextItems: [],
      createdAt: t,
      updatedAt: t,
    },
  ]
}

export function loadDailyStatusEntries(): DailyStatusEntry[] {
  const stored = parseStored(localStorage.getItem(STORAGE_KEY))
  if (stored.length === 0) {
    const seed = seedEntries()
    saveDailyStatusEntries(seed)
    return seed
  }
  return stored
}

export function saveDailyStatusEntries(entries: DailyStatusEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function notifyDailyStatusChanged(): void {
  window.dispatchEvent(new Event('flow-daily-status-changed'))
}

export function addDailyStatusEntry(entry: DailyStatusEntry): void {
  const all = loadDailyStatusEntries()
  saveDailyStatusEntries([entry, ...all])
  notifyDailyStatusChanged()
}

export function updateDailyStatusEntry(entry: DailyStatusEntry): void {
  const all = loadDailyStatusEntries()
  const idx = all.findIndex((e) => e.id === entry.id)
  if (idx === -1) return
  const next = [...all]
  next[idx] = entry
  saveDailyStatusEntries(next)
  notifyDailyStatusChanged()
}

export function removeDailyStatusEntry(id: string): void {
  const all = loadDailyStatusEntries().filter((e) => e.id !== id)
  saveDailyStatusEntries(all)
  notifyDailyStatusChanged()
}
