import styled from 'styled-components'
import { Link } from 'react-router-dom'

export { PageRoot, PageTitle, Lead, PrimaryBtn, GhostBtn } from '../peopleOps/peopleOpsShared.styles'

export const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15.5rem, 1fr));
  gap: 1rem;
  align-items: stretch;
  margin-top: 0.25rem;
`

export const PlanCard = styled.article<{ $highlight?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1.1rem 1.15rem;
  border-radius: 0.85rem;
  border: 1px solid
    ${({ theme, $highlight }) =>
      $highlight ? `color-mix(in srgb, ${theme.primary} 55%, ${theme.border})` : theme.border};
  background: ${({ theme, $highlight }) =>
    $highlight
      ? `color-mix(in srgb, ${theme.primary} 9%, ${theme.surface})`
      : theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const PlanBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.2rem 0.45rem;
  border-radius: 0.35rem;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${({ theme }) => theme.primary};
  color: #fff;
`

export const PlanName = styled.h2`
  margin: 0;
  padding-right: 4.5rem;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

export const PlanPriceRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.5rem;
`

export const PlanPrice = styled.span`
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.text};
`

export const PlanPeriod = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
`

export const PlanDesc = styled.p`
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const FeatureList = styled.ul`
  list-style: none;
  margin: 0.15rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
`

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  font-size: 0.8rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.text};

  svg {
    flex-shrink: 0;
    margin-top: 0.12rem;
    width: 1rem;
    height: 1rem;
    color: ${({ theme }) => theme.primary};
  }
`

export const PlanFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.35rem;
  padding-top: 0.65rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`

export const PlanFooterNote = styled.span`
  font-size: 0.76rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.textMuted};
`

export const MutedNote = styled.p`
  margin: 1.25rem 0 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
  max-width: 48rem;
`

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.75rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
