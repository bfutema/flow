import styled from 'styled-components'

export const GroupWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.45rem;
`

export const GroupHeaderBtn = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  width: 100%;
  padding: 0.35rem 0.45rem 0.25rem;
  margin: 0;
  border: none;
  border-radius: 0.45rem;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.sidebarActive};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const GroupTitle = styled.span`
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const GroupChevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textMuted};
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0')});
  transition: transform 0.2s ease;

  svg {
    width: 0.85rem;
    height: 0.85rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const GroupBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`
