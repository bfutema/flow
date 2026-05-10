import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const PageRoot = styled.div`
  width: 100%;
  max-width: 64rem;
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
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
  max-width: 48rem;
`

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  align-items: flex-end;
  margin-bottom: 1rem;
`

export const PrimaryBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.5rem 0.95rem;
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

export const GhostBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.5rem 0.85rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
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

export const DangerBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.45rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#f87171' : '#dc2626')};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1rem 1.1rem;
  margin-bottom: 1rem;
`

export const CardTitle = styled.h2`
  margin: 0 0 0.65rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 0.65rem;
  margin-bottom: 1rem;
`

export const Stat = styled.div`
  padding: 0.65rem 0.75rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
`

export const StatLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.textMuted};
`

export const StatValue = styled.div`
  font-size: 1.15rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  margin-top: 0.2rem;
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
  padding: 0 0.55rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }

  &:disabled {
    opacity: 0.65;
  }
`

export const Select = styled.select`
  box-sizing: border-box;
  min-height: 2.35rem;
  padding: 0 0.45rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;

  &:disabled {
    opacity: 0.65;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const Textarea = styled.textarea`
  box-sizing: border-box;
  min-height: 4rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;
  resize: vertical;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const TableWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.65rem;
  overflow: auto;
  max-width: 100%;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
`

export const Th = styled.th`
  text-align: left;
  padding: 0.5rem 0.65rem;
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.textMuted};
  font-weight: 700;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: nowrap;
`

export const Td = styled.td`
  padding: 0.45rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  vertical-align: top;
`

/** Célula de tabela vazia / placeholder (mesmo padding que Td). */
export const TdEmpty = styled(Td)`
  text-align: center;
  font-style: italic;
  color: ${({ theme }) => theme.textMuted};
`

/** Bloco empilhado dentro de célula (subtítulo + meta). */
export const TableCellStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
`

export const TableCellMuted = styled.div`
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const TableCellFootnote = styled.div`
  font-size: 0.68rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.textMuted};
`

export const TabRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1rem;
`

export const TabBtn = styled.button.attrs({ type: 'button' })<{ $active?: boolean }>`
  padding: 0.35rem 0.65rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme, $active }) => ($active ? 'transparent' : theme.border)};
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ theme, $active }) => ($active ? theme.primary : theme.surface)};
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.textMuted)};

  &:hover {
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.text)};
  }
`

export const Chip = styled.span<{ $tone?: 'pending' | 'ok' | 'bad' }>`
  display: inline-block;
  padding: 0.15rem 0.45rem;
  border-radius: 0.35rem;
  font-size: 0.68rem;
  font-weight: 700;
  ${({ theme, $tone }) =>
    $tone === 'ok'
      ? `background: color-mix(in srgb, ${theme.primary} 22%, transparent); color: ${theme.primary};`
      : $tone === 'bad'
        ? `background: ${theme.mode === 'dark' ? 'rgba(248,113,113,0.15)' : 'rgba(220,38,38,0.12)'}; color: ${theme.mode === 'dark' ? '#f87171' : '#b91c1c'};`
        : `background: ${theme.surfaceHover}; color: ${theme.textMuted};`}
`

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 85;
  background: ${({ theme }) => theme.overlay};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
`

export const Modal = styled.div`
  width: 100%;
  max-width: 24rem;
  border-radius: 0.85rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  padding: 1rem 1.1rem;
  margin-top: 4vh;
`

/** Modal mais largo (formulários com listas); mesmo padding que Modal. */
export const ModalWide = styled(Modal)`
  max-width: min(100%, 28rem);
`

/** Espaço vertical entre campos do modal (ritmo CardTitle → bloco). */
export const ModalFieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`

/** Lista de checkboxes sob Field (gap alinhado ao Field). */
export const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  margin-top: 0.28rem;
`

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`

export const ModalTitle = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.45rem;
  margin-top: 1rem;
`

export const InlineLink = styled(Link)`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

/** Nota rodapé dentro de Card (ritmo Lead, sem margem inferior extra). */
export const CardFootnote = styled.p`
  margin: 0.65rem 0 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
  max-width: 48rem;
`

/** Texto de estado vazio em lista/card (substitui Lead com margin custom). */
export const EmptyHint = styled.p`
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
`

export const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
`

export const TeamCard = styled.article`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  padding: 1rem 1.1rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const TeamName = styled.div`
  font-size: 0.88rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`

export const TeamMeta = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 0.35rem;
  line-height: 1.4;
`

export const TeamActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  margin-top: 0.65rem;
`
