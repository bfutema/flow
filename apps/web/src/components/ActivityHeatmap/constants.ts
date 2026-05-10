/** Linhas do grid: segunda (0) … domingo (6). */
export const WEEKDAY_SHORT_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const

/** Rótulos laterais esparsos (como no GitHub). */
export const WEEKDAY_ROW_LABELS: Record<number, string> = {
  0: 'Seg',
  2: 'Qua',
  4: 'Sex',
}

export const MONTH_SHORT_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
] as const

/** Colunas de semana no ano civil (~53). */
export const HEATMAP_WEEK_COLUMNS = 53
