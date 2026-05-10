import styled, { css } from 'styled-components'

export const Shell = styled.div`
  width: 100%;
  max-width: 56rem;
  margin: 0 auto;
  box-sizing: border-box;
`

export const PageHeader = styled.header`
  margin-bottom: 1.25rem;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: ${({ theme }) => theme.text};
`

export const PageSubtitle = styled.p`
  margin: 0.5rem 0 0;
  max-width: 40rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
`

/** Trilho tipo “segmented control”: aba ativa = pill elevada sobre o fundo. */
export const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 0.2rem;
  padding: 0.3rem;
  border-radius: 0.7rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  margin-bottom: 1.25rem;
`

export const Tab = styled.button.attrs({ type: 'button' })<{ $active?: boolean }>`
  position: relative;
  z-index: ${({ $active }) => ($active ? 1 : 0)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.52rem 0.95rem;
  border-radius: 0.5rem;
  border: none;
  font: inherit;
  font-size: 0.78rem;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  letter-spacing: 0.01em;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.text : theme.textMuted)};
  background: transparent;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;

  ${({ $active, theme }) =>
    $active
      ? css`
          background: ${theme.surface};
          color: ${theme.text};
          box-shadow:
            0 1px 2px rgba(15, 23, 42, 0.06),
            0 2px 8px rgba(15, 23, 42, 0.06),
            0 0 0 1px ${theme.border};

          ${theme.mode === 'dark'
            ? css`
                box-shadow:
                  0 1px 3px rgba(0, 0, 0, 0.35),
                  0 0 0 1px ${theme.border};
              `
            : ''}

          svg {
            color: ${theme.primary};
          }
        `
      : css`
          svg {
            color: ${theme.textMuted};
            opacity: 0.92;
          }
        `}

  &:hover {
    ${({ $active, theme }) =>
      $active
        ? css`
            color: ${theme.text};
          `
        : css`
            color: ${theme.text};
            background: ${theme.surfaceHover};
            svg {
              color: ${theme.textMuted};
              opacity: 1;
            }
          `}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  svg {
    width: 1.05rem;
    height: 1.05rem;
    flex-shrink: 0;
    transition: color 0.18s ease, opacity 0.18s ease;
  }
`

export const ContentCard = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.85rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1.25rem 1.35rem;
  margin-bottom: 1.5rem;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.15rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const SectionIconWrap = styled.span`
  display: inline-flex;
  width: 2.35rem;
  height: 2.35rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.55rem;
  background: ${({ theme }) => theme.primaryMuted};
  color: ${({ theme }) => theme.primary};
  flex-shrink: 0;

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`

export const SectionIconWrapMuted = styled(SectionIconWrap)`
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.textMuted};
`

export const SectionTitles = styled.div`
  min-width: 0;
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

export const SectionDesc = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const FieldBlock = styled.div`
  margin-bottom: 1.1rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.35rem;
`

export const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  min-height: 2.5rem;
  padding: 0 0.75rem;
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
  width: 100%;
  min-height: 2.5rem;
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

export const ToggleRow = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.85 : 1)};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`

export const ToggleText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`

export const ToggleTitle = styled.span`
  font-size: 0.86rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const ToggleDesc = styled.span`
  font-size: 0.74rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const Checkbox = styled.input`
  width: 1.15rem;
  height: 1.15rem;
  flex-shrink: 0;
  margin-top: 0.12rem;
  accent-color: ${({ theme }) => theme.primary};
  cursor: inherit;
`

export const FooterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.65rem;
`

export const FooterActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
`

export const SecondaryBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.55rem 1rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.surfaceHover};
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

export const PrimaryBtn = styled.button.attrs({ type: 'button' })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.55rem 1.1rem;
  border-radius: 0.55rem;
  border: none;
  font: inherit;
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

  svg {
    width: 1rem;
    height: 1rem;
  }
`

export const Note = styled.p`
  margin: 0 0 1.15rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.55rem;
  font-size: 0.8rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surfaceHover};
  border: 1px solid ${({ theme }) => theme.border};
`

export const SavedFlash = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`
