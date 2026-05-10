import styled from 'styled-components'

export const Shell = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 0.65rem 0.85rem 0.75rem;
  min-width: 0;
`

/** Título + legenda na mesma linha (quebra só em telas estreitas); toggles à direita. */
export const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem 0.85rem;
  margin-bottom: 0.45rem;
`

export const TitleBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.65rem;
  min-width: 0;
  flex: 1 1 auto;
`

export const Title = styled.h3`
  margin: 0;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
`

export const ToggleGroup = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-shrink: 0;
`

export const ToggleBtn = styled.button.attrs({ type: 'button' })<{ $active?: boolean }>`
  padding: 0.28rem 0.55rem;
  border-radius: 0.4rem;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
  border: 1px solid
    ${({ theme, $active }) => ($active ? 'transparent' : theme.border)};
  background: ${({ theme, $active }) =>
    $active ? theme.primary : theme.surfaceHover};
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.textMuted)};

  &:hover {
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.text)};
    border-color: ${({ theme, $active }) =>
      $active ? 'transparent' : theme.primaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`

export const Legend = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  flex-wrap: wrap;
  padding: 0.2rem 0.42rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.surfaceHover};
  border: 1px solid ${({ theme }) => theme.border};
`

export const LegendLabel = styled.span`
  font-size: 0.62rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
`

export const LegendSamples = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`

export const LegendSample = styled.span<{ $level: 0 | 1 | 2 | 3 | 4 }>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
  ${({ theme, $level }) => cellFill(theme.primary, theme.surface, theme.chartGrid, $level)}
`

function cellFill(
  primary: string,
  surface: string,
  chartGrid: string,
  level: 0 | 1 | 2 | 3 | 4,
) {
  if (level === 0) {
    return `
      background: color-mix(in srgb, ${chartGrid} 45%, ${surface});
      border: 1px solid color-mix(in srgb, ${chartGrid} 70%, transparent);
    `
  }
  const pct = 22 + level * 18
  return `
    background: color-mix(in srgb, ${primary} ${pct}%, ${surface});
    border: 1px solid color-mix(in srgb, ${primary} 35%, transparent);
  `
}

/** Grid único: coluna de rótulos + 53 semanas; linha extra para meses. */
export const UnifiedGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(1.5rem, auto)
    repeat(53, minmax(var(--heatmap-cell-min, 14px), 1fr));
  grid-template-rows: repeat(7, auto) auto;
  column-gap: 0.38rem;
  row-gap: var(--heatmap-gap, 3px);
  width: 100%;
  min-width: 0;
`

export const DayLabel = styled.span`
  font-size: 0.58rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.05rem;
  min-height: 0;
`

export const Cell = styled.span<{ $level: 0 | 1 | 2 | 3 | 4 }>`
  width: 100%;
  min-width: var(--heatmap-cell-min, 14px);
  aspect-ratio: 1;
  border-radius: 2px;
  box-sizing: border-box;
  ${({ theme, $level }) =>
    cellFill(theme.primary, theme.surface, theme.chartGrid, $level)}
`

/** Só sobre as colunas de semanas (não a coluna Seg/Qua/Sex), para % bater com o grid. */
export const MonthTrack = styled.div`
  position: relative;
  grid-column: 2 / -1;
  grid-row: 8;
  height: 0.85rem;
  margin-top: 0.15rem;
  width: 100%;
  min-width: 0;
`

export const MonthLabel = styled.span<{ $leftPct: number }>`
  position: absolute;
  left: ${({ $leftPct }) => `${$leftPct}%`};
  top: 0;
  font-size: 0.58rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  white-space: nowrap;
  transform: translateX(-2px);
`

/** Scroll horizontal quando a largura não cabe no mínimo das 53 colunas. */
export const HeatmapScroll = styled.div`
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.15rem;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
`
