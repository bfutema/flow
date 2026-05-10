import styled from 'styled-components'

export const Root = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

export const Lead = styled.p`
  margin: 0.45rem 0 1rem;
  max-width: 48rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
`

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1rem;
  align-items: flex-end;
  margin-bottom: 1rem;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
`

export const Input = styled.input`
  box-sizing: border-box;
  min-height: 2.35rem;
  padding: 0 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;
  min-width: 12rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const Select = styled.select`
  box-sizing: border-box;
  min-height: 2.35rem;
  padding: 0 0.55rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;
  min-width: 10rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const TableWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  overflow: hidden;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
`

export const Th = styled.th`
  text-align: left;
  padding: 0.55rem 0.75rem;
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.textMuted};
  font-weight: 700;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: nowrap;
`

export const Td = styled.td`
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  vertical-align: top;
`

export const TdMuted = styled(Td)`
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.72rem;
`

export const Verb = styled.code`
  font-size: 0.68rem;
  padding: 0.12rem 0.35rem;
  border-radius: 0.3rem;
  background: ${({ theme }) => theme.surfaceHover};
  border: 1px solid ${({ theme }) => theme.border};
`
