import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const TriggerWrap = styled.span`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
`

export const TriggerBadge = styled.span`
  position: absolute;
  top: -0.15rem;
  right: -0.15rem;
  min-width: 1.05rem;
  padding: 0.08rem 0.28rem;
  border-radius: 999px;
  font-size: 0.58rem;
  font-weight: 800;
  line-height: 1.1;
  text-align: center;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  pointer-events: none;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.headerBg};
`

export const NotifBackdrop = styled.button.attrs({ type: 'button' })`
  position: fixed;
  inset: 0;
  z-index: 72;
  border: none;
  padding: 0;
  margin: 0;
  cursor: default;
  background: transparent;
`

export const NotifPanel = styled.div`
  position: fixed;
  z-index: 73;
  width: min(22rem, calc(100vw - 1.25rem));
  max-height: min(32rem, calc(100dvh - 5rem));
  display: flex;
  flex-direction: column;
  border-radius: 0.65rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  box-shadow:
    ${({ theme }) => theme.shadow},
    0 16px 48px rgba(15, 23, 42, 0.14);

  ${({ theme }) =>
    theme.mode === 'dark'
      ? `
    box-shadow:
      ${theme.shadow},
      0 16px 48px rgba(0, 0, 0, 0.5);
  `
      : ''}
`

export const PanelHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
  padding: 0.85rem 1rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
`

export const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
`

export const PanelTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`

export const IconLinkButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  flex-shrink: 0;
  border-radius: 0.45rem;
  color: ${({ theme }) => theme.textMuted};
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.primary};
  }

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`

export const TextLinkButton = styled.button.attrs({ type: 'button' })`
  border: none;
  padding: 0;
  margin: 0;
  background: none;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.text};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    text-decoration: none;
  }
`

export const PanelFilters = styled.div`
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const FilterSelect = styled.select`
  box-sizing: border-box;
  width: 100%;
  padding: 0.45rem 0.5rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font: inherit;
  font-size: 0.78rem;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const PanelScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.35rem 0.5rem 0.65rem;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 2rem 1rem 2.25rem;
  color: ${({ theme }) => theme.textMuted};
  text-align: center;
  font-size: 0.82rem;
`

export const EmptyBell = styled.span`
  display: flex;
  opacity: 0.35;

  svg {
    width: 2.75rem;
    height: 2.75rem;
  }
`

export const NotifRow = styled.div<{ $unread: boolean }>`
  display: flex;
  gap: 0.55rem;
  align-items: flex-start;
  padding: 0.55rem 0.5rem;
  border-radius: 0.5rem;
  transition: background 0.12s ease;
  background: ${({ $unread, theme }) => ($unread ? theme.surfaceHover : 'transparent')};

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const UnreadDot = styled.span`
  flex-shrink: 0;
  width: 0.45rem;
  height: 0.45rem;
  margin-top: 0.38rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  box-shadow: 0 0 0 2px ${({ theme }) => theme.surface};
`

export const ReadDotSpacer = styled.span`
  flex-shrink: 0;
  width: 0.45rem;
  margin-top: 0.38rem;
`

export const NotifMain = styled.div`
  flex: 1;
  min-width: 0;
`

export const NotifItemTitle = styled.div<{ $unread: boolean }>`
  font-size: 0.84rem;
  font-weight: ${({ $unread }) => ($unread ? 800 : 600)};
  line-height: 1.25;
  margin-bottom: 0.15rem;
`

export const NotifItemBody = styled.p`
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.textMuted};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const NotifMeta = styled.div`
  margin-top: 0.35rem;
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
`

export const InlineRouterLink = styled(Link)`
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`

export const RowGhostBtn = styled.button.attrs({ type: 'button' })`
  flex-shrink: 0;
  align-self: center;
  padding: 0.28rem 0.5rem;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  font: inherit;
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.12s ease,
    border-color 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.textMuted};
  }
`

export const PanelFooter = styled.div`
  flex-shrink: 0;
  padding: 0.55rem 1rem 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
`

export const FooterLink = styled(Link)`
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  text-align: center;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`
