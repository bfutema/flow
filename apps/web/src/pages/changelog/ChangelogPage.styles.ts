import styled from 'styled-components'
import {
  GhostBtn,
  Lead,
  PageRoot,
  PageTitle,
  TabBtn,
  TabRow,
  Toolbar,
} from '../peopleOps/peopleOpsShared.styles'

export { PageRoot, PageTitle, Lead, Toolbar, TabRow, TabBtn, GhostBtn }

export const KindChip = styled.span<{ $kind: 'feature' | 'fix' | 'improvement' | 'security' }>`
  display: inline-block;
  padding: 0.15rem 0.45rem;
  border-radius: 0.35rem;
  font-size: 0.68rem;
  font-weight: 700;
  ${({ theme, $kind }) =>
    $kind === 'feature'
      ? `background: color-mix(in srgb, ${theme.primary} 22%, transparent); color: ${theme.primary};`
      : $kind === 'fix'
        ? `background: ${theme.mode === 'dark' ? 'rgba(56,189,248,0.18)' : 'rgba(2,132,199,0.12)'}; color: ${theme.mode === 'dark' ? '#7dd3fc' : '#0369a1'};`
        : $kind === 'security'
          ? `background: ${theme.mode === 'dark' ? 'rgba(250,204,21,0.14)' : 'rgba(202,138,4,0.14)'}; color: ${theme.mode === 'dark' ? '#fde047' : '#a16207'};`
          : `background: ${theme.surfaceHover}; color: ${theme.textMuted};`}
`

export const Timeline = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`

export const EntryCard = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1rem 1.1rem;
`

export const EntryHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
`

export const EntryTitle = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  line-height: 1.3;
`

export const EntryDate = styled.time`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  white-space: nowrap;
`

export const EntryBody = styled.div`
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.textMuted};
  white-space: pre-wrap;
`

export const EmptyState = styled.p`
  margin: 0;
  padding: 1.5rem 1rem;
  text-align: center;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.textMuted};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 0.75rem;
`
