import { useMemo, useState, type CSSProperties } from 'react'
import { HEATMAP_WEEK_COLUMNS, WEEKDAY_ROW_LABELS } from './constants'
import type { ActivityHeatmapView } from './types'
import {
  generateMockYearGrid,
  monthStartWeekColumns,
  rawGridToIntensityGrid,
} from './utils'
import * as S from './ActivityHeatmap.styles'

const WEEKDAY_NAMES_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const

export type ActivityHeatmapProps = {
  year?: number
  title?: string
  defaultView?: ActivityHeatmapView
  /** Dados brutos por modo (`hours` = horas/dia, `daily` = contagens). Ausente = mock determinístico. */
  data?: Partial<Record<ActivityHeatmapView, number[][]>>
}

export function ActivityHeatmap({
  year = new Date().getFullYear(),
  title = 'Histórico de Atividade',
  defaultView = 'hours',
  data,
}: ActivityHeatmapProps) {
  const [view, setView] = useState<ActivityHeatmapView>(defaultView)

  const hoursRaw = useMemo(
    () => data?.hours ?? generateMockYearGrid(year, 'hours'),
    [data?.hours, year],
  )
  const dailyRaw = useMemo(
    () => data?.daily ?? generateMockYearGrid(year, 'daily'),
    [data?.daily, year],
  )

  const grid = useMemo(() => {
    const raw = view === 'hours' ? hoursRaw : dailyRaw
    return rawGridToIntensityGrid(raw, view)
  }, [dailyRaw, hoursRaw, view])

  const months = useMemo(
    () => monthStartWeekColumns(year, HEATMAP_WEEK_COLUMNS),
    [year],
  )

  /** Tamanho mínimo por célula; sobra distribui em `1fr`; telas estreitas rolam na horizontal. */
  const heatVars = {
    ['--heatmap-gap' as string]: '3px',
    ['--heatmap-cell-min' as string]: '14px',
  } as CSSProperties

  return (
    <S.Shell aria-label={title}>
      <S.TopBar>
        <S.TitleBlock>
          <S.Title>{title}</S.Title>
          <S.Legend aria-hidden>
            <S.LegendLabel>Min</S.LegendLabel>
            <S.LegendSamples>
              {([0, 1, 2, 3, 4] as const).map((lvl) => (
                <S.LegendSample key={lvl} $level={lvl} />
              ))}
            </S.LegendSamples>
            <S.LegendLabel>Máx.</S.LegendLabel>
          </S.Legend>
        </S.TitleBlock>
        <S.ToggleGroup role="tablist" aria-label="Tipo de agregação">
          <S.ToggleBtn
            role="tab"
            aria-selected={view === 'hours'}
            $active={view === 'hours'}
            onClick={() => setView('hours')}
          >
            Horas
          </S.ToggleBtn>
          <S.ToggleBtn
            role="tab"
            aria-selected={view === 'daily'}
            $active={view === 'daily'}
            onClick={() => setView('daily')}
          >
            Daily
          </S.ToggleBtn>
        </S.ToggleGroup>
      </S.TopBar>

      <S.HeatmapScroll style={heatVars}>
        <S.UnifiedGrid
          role="grid"
          aria-label={`Atividade por semana e dia da semana, ano ${year}`}
          aria-colcount={HEATMAP_WEEK_COLUMNS}
          aria-rowcount={7}
        >
          {Array.from({ length: 7 }, (_, d) => (
            <S.DayLabel
              key={`lab-${d}`}
              aria-hidden
              style={{ gridColumn: 1, gridRow: d + 1 }}
            >
              {WEEKDAY_ROW_LABELS[d] ?? '\u00a0'}
            </S.DayLabel>
          ))}
          {grid.map((week, w) =>
            week.map((level, d) => (
              <S.Cell
                key={`${w}-${d}`}
                role="gridcell"
                aria-label={`Semana ${w + 1}, ${WEEKDAY_NAMES_PT[d]}, intensidade ${level} de 4`}
                $level={level}
                style={{ gridColumn: w + 2, gridRow: d + 1 }}
              />
            )),
          )}
          <S.MonthTrack aria-hidden>
            {months.map(({ label, weekIndex }) => (
              <S.MonthLabel
                key={label}
                $leftPct={(weekIndex / HEATMAP_WEEK_COLUMNS) * 100}
              >
                {label}
              </S.MonthLabel>
            ))}
          </S.MonthTrack>
        </S.UnifiedGrid>
      </S.HeatmapScroll>
    </S.Shell>
  )
}
