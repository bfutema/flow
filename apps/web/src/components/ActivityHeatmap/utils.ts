import type { ActivityIntensity } from './types'
import { HEATMAP_WEEK_COLUMNS, MONTH_SHORT_PT } from './constants'

/** Converte horas (0–24+) em nível 0–4 para o heatmap. */
export function hoursToIntensity(hours: number): ActivityIntensity {
  if (hours <= 0) return 0
  if (hours < 2) return 1
  if (hours < 4) return 2
  if (hours < 8) return 3
  return 4
}

/** Converte contagem de eventos “daily” em nível 0–4. */
export function dailyCountToIntensity(count: number): ActivityIntensity {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}

/** Determina em qual coluna (semana) cada mês começa no ano civil. */
export function monthStartWeekColumns(
  year: number,
  totalWeeks: number,
): { label: string; weekIndex: number }[] {
  const yearStart = new Date(year, 0, 1).getTime()
  return MONTH_SHORT_PT.map((label, monthIndex) => {
    const first = new Date(year, monthIndex, 1).getTime()
    const diffDays = Math.floor((first - yearStart) / 86400000)
    const weekIndex = Math.max(0, Math.min(totalWeeks - 1, Math.floor(diffDays / 7)))
    return { label, weekIndex }
  })
}

/** PRNG determinístico simples (seed por ano + índice). */
function seededNoise(seed: number, x: number, y: number): number {
  let n = seed + x * 374761393 + y * 668265263
  n = (n ^ (n >>> 13)) >>> 0
  n = Math.imul(n, 1274126177)
  return (n >>> 0) / 4294967296
}

/**
 * Gera dados ilustrativos [semana][dia] com valores brutos:
 * - modo `hours`: horas por dia
 * - modo `daily`: número de registros / checks
 */
export function generateMockYearGrid(
  year: number,
  mode: 'hours' | 'daily',
): number[][] {
  const seed = year * 10007 + (mode === 'hours' ? 1 : 2)
  const weeks: number[][] = []

  for (let w = 0; w < HEATMAP_WEEK_COLUMNS; w++) {
    const days: number[] = []
    for (let d = 0; d < 7; d++) {
      const r = seededNoise(seed, w, d)
      if (mode === 'hours') {
        // Maioria dos dias com alguma atividade; picos ocasionais
        const base = r < 0.12 ? 0 : r < 0.35 ? r * 6 : r * 10 + 2
        days.push(Math.round(base * 10) / 10)
      } else {
        const count = r < 0.25 ? 0 : r < 0.55 ? 1 : r < 0.8 ? 2 + Math.floor(r * 2) : 5 + Math.floor(r * 4)
        days.push(count)
      }
    }
    weeks.push(days)
  }
  return weeks
}

export function rawGridToIntensityGrid(
  raw: number[][],
  mode: 'hours' | 'daily',
): ActivityIntensity[][] {
  return raw.map((week) =>
    week.map((v) =>
      mode === 'hours' ? hoursToIntensity(v) : dailyCountToIntensity(v),
    ),
  )
}
