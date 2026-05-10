/** Visualização do heatmap: horas agregadas ou contagens diárias (estilo GitHub). */
export type ActivityHeatmapView = 'hours' | 'daily'

/** Intensidade visual de cada célula (0 = sem atividade, 4 = máximo). */
export type ActivityIntensity = 0 | 1 | 2 | 3 | 4

/** Uma semana (coluna) com 7 dias — índice 0 = segunda-feira. */
export type WeekColumn = readonly ActivityIntensity[]
