import styled from 'styled-components'

export const Root = styled.div`
  width: 100%;
  max-width: 40rem;
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
  margin: 0.45rem 0 1.25rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
`

export const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1rem 1.15rem;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
`

export const Input = styled.input`
  box-sizing: border-box;
  min-height: 2.45rem;
  padding: 0 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.88rem;

  &:disabled {
    opacity: 0.72;
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const Select = styled.select`
  box-sizing: border-box;
  min-height: 2.45rem;
  padding: 0 0.55rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.88rem;

  &:disabled {
    opacity: 0.72;
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
`

export const PrimaryBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.55rem 1rem;
  border-radius: 0.55rem;
  border: none;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ theme }) => theme.primary};
  color: #fff;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`

export const Note = styled.p`
  margin: 0 0 1rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surfaceHover};
  border: 1px solid ${({ theme }) => theme.border};
`

export const SavedFlash = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  align-self: center;
`
