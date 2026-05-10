import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const ProfileRoot = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`

export const PageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.35rem;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

export const PageActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`

export const GhostLink = styled(Link)`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

/**
 * Flex + aside sticky: evita sensação de “faixa morta” à esquerda quando a coluna
 * principal é bem mais alta — perfil/controle acompanham o scroll (desktop).
 * Em coluna única, sticky off para não cobrir o bloco da direita ao rolar.
 */
export const LayoutGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.35rem;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`

export const AsideColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 0 0 17.5rem;
  width: 17.5rem;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 1;
  align-self: flex-start;

  @media (max-width: 960px) {
    flex: 1 1 auto;
    width: 100%;
    position: static;
    z-index: auto;
  }
`

export const MainColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1rem 1.15rem;
  min-width: 0;
`

export const CardHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  margin-bottom: 0.85rem;
`

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const CardLink = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const ProfileHero = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? `linear-gradient(165deg, ${theme.surfaceHover} 0%, ${theme.surface} 55%)`
      : `linear-gradient(165deg, ${theme.surfaceHover} 0%, ${theme.surface} 60%)`};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1.15rem 1.1rem;
  text-align: center;
`

export const Avatar = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primary},
    color-mix(in srgb, ${({ theme }) => theme.primary} 55%, #38bdf8)
  );
  border: 3px solid ${({ theme }) => theme.border};
`

export const ProfileName = styled.div`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;
`

export const ProfileRole = styled.div`
  margin-top: 0.25rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
`

export const ProfileEmail = styled.div`
  margin-top: 0.45rem;
  font-size: 0.74rem;
  color: ${({ theme }) => theme.textMuted};
  word-break: break-all;
`

export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: center;
  margin-top: 0.75rem;
`

export const Tag = styled.span<{ $tone?: 'amber' | 'cyan' | 'slate' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  ${({ $tone, theme }) =>
    $tone === 'cyan'
      ? `
    background: color-mix(in srgb, ${theme.primary} 22%, transparent);
    color: ${theme.primary};
  `
      : $tone === 'slate'
        ? `
    background: ${theme.surfaceHover};
    color: ${theme.textMuted};
    border: 1px solid ${theme.border};
  `
        : `
    background: color-mix(in srgb, #eab308 28%, transparent);
    color: ${theme.mode === 'dark' ? '#fde68a' : '#854d0e'};
  `}
`

export const ControlCard = styled(Card)`
  padding: 0.95rem 1rem;
`

export const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.85rem;
  padding: 0.2rem;
  border-radius: 0.45rem;
  background: ${({ theme }) => theme.surfaceHover};
`

export const TabBtn = styled.button.attrs({ type: 'button' })<{ $active?: boolean }>`
  flex: 1;
  padding: 0.35rem 0.5rem;
  border: none;
  border-radius: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  background: ${({ theme, $active }) => ($active ? theme.surface : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.textMuted)};
  box-shadow: ${({ theme, $active }) => ($active ? theme.shadow : 'none')};

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`

export const MetricList = styled.dl`
  margin: 0;
  display: grid;
  gap: 0.45rem;
`

export const MetricDt = styled.dt`
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.textMuted};
`

export const MetricDd = styled.dd`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  font-variant-numeric: tabular-nums;
`

export const MetricDdPositive = styled(MetricDd)`
  color: ${({ theme }) => (theme.mode === 'dark' ? '#4ade80' : '#15803d')};
`

export const ProgressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`

export const ProgressRing = styled.div`
  position: relative;
  width: 4rem;
  height: 4rem;
  flex-shrink: 0;
`

export const ProgressLabel = styled.div`
  font-size: 0.72rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.textMuted};
`

export const ProgressStrong = styled.span`
  display: block;
  font-size: 0.95rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`

export const DeliveryList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`

export const DeliveryItem = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.65rem;
  align-items: center;
  padding: 0.55rem 0.65rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
`

export const DeliveryCode = styled.span`
  font-family: ui-monospace, monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`

export const DeliveryMeta = styled.div`
  min-width: 0;
`

export const DeliveryTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const DeliveryClient = styled.div`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
`

export const StatusChip = styled.span<{ $variant: 'danger' | 'warn' | 'ok' }>`
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.45rem;
  border-radius: 0.35rem;
  white-space: nowrap;
  ${({ $variant }) =>
    $variant === 'danger'
      ? 'background: color-mix(in srgb, #dc2626 18%, transparent); color: #f87171;'
      : $variant === 'warn'
        ? 'background: color-mix(in srgb, #eab308 22%, transparent); color: #ca8a04;'
        : 'background: color-mix(in srgb, #22c55e 18%, transparent); color: #4ade80;'}
`

export const DailyGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const DailyDate = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const DailyPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`

export const DailyPill = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.28rem 0.55rem;
  border-radius: 0.45rem;
  background: color-mix(in srgb, #22c55e 14%, transparent);
  color: ${({ theme }) => (theme.mode === 'dark' ? '#86efac' : '#166534')};
  border: 1px solid color-mix(in srgb, #22c55e 35%, transparent);
`

export const ChartBox = styled.div`
  width: 100%;
  height: 220px;
  min-height: 200px;
`

export const Footnote = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.72rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const ProjectMiniGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 0.65rem;
`

export const ProjectMini = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s ease,
    transform 0.12s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primaryMuted};
    transform: translateY(-2px);
  }
`

export const ProjectMiniName = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const ProjectMiniStatus = styled.span<{ $variant: 'blue' | 'amber' | 'green' }>`
  font-size: 0.65rem;
  font-weight: 700;
  align-self: flex-start;
  padding: 0.15rem 0.4rem;
  border-radius: 0.3rem;
  ${({ $variant }) =>
    $variant === 'blue'
      ? 'background: color-mix(in srgb, #3b82f6 20%, transparent); color: #93c5fd;'
      : $variant === 'amber'
        ? 'background: color-mix(in srgb, #eab308 22%, transparent); color: #fde047;'
        : 'background: color-mix(in srgb, #22c55e 20%, transparent); color: #86efac;'}
`

export const ProjectMiniBar = styled.div`
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.border};
  overflow: hidden;
`

export const ProjectMiniBarFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => `${$pct}%`};
  border-radius: 2px;
  background: ${({ theme }) => theme.primary};
`
