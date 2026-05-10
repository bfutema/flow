import styled from 'styled-components'

export const NotifList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`

export const NotifItem = styled.li<{ $unread?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $unread }) =>
    $unread ? theme.surfaceHover : theme.surface};
`

export const UnreadDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 0.35rem;
  flex-shrink: 0;
  background: ${({ theme }) => theme.primary};
`

export const NotifTitle = styled.div<{ $unread?: boolean }>`
  font-size: 0.86rem;
  font-weight: ${({ $unread }) => ($unread ? 800 : 600)};
  color: ${({ theme }) => theme.text};
`

export const NotifBody = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const NotifMeta = styled.div`
  margin-top: 0.35rem;
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};

  a {
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`
