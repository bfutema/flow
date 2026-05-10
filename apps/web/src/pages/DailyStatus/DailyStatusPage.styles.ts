import styled from 'styled-components'

export const PageRoot = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`

export const TopStrip = styled.div`
  margin-bottom: 1.25rem;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

export const Lead = styled.p`
  margin: 0.45rem 0 0;
  max-width: 52rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
`

/** Agrupa filtros + avisos e afasta a primeira seção do dia (ex.: “Hoje”). */
export const FiltersCluster = styled.div`
  margin-bottom: 1.75rem;
`

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.65rem 1rem;
  margin-top: 1.1rem;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
  min-width: 0;
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

export const ToolbarSpacer = styled.div`
  flex: 1;
  min-width: 0;
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
  transition: filter 0.15s ease;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    filter: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`

export const GhostBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.55rem 0.85rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => theme.primaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`

export const ToggleRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;
  user-select: none;
`

export const DaySection = styled.section`
  margin-bottom: 1.75rem;
`

export const DayHeading = styled.h2`
  margin: 0 0 0.85rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  padding-bottom: 0.45rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
  gap: 0.85rem;
`

export const Card = styled.article`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 0.85rem 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  min-width: 0;
`

export const CardHead = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
`

export const Avatar = styled.div`
  flex-shrink: 0;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 800;
  color: #fff;
  background: ${({ theme }) => theme.primary};
`

export const CardHeadText = styled.div`
  flex: 1;
  min-width: 0;
`

export const PersonName = styled.div`
  font-size: 0.84rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;
`

export const ProjectLine = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  margin-top: 0.12rem;
`

export const HoursBadge = styled.span`
  display: inline-block;
  margin-top: 0.35rem;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.18rem 0.45rem;
  border-radius: 0.35rem;
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
`

export const List = styled.ul`
  margin: 0;
  padding-left: 1.05rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.text};
`

export const SubHeading = styled.div`
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 0.15rem;
`

export const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: auto;
  padding-top: 0.35rem;
`

export const MutedBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.28rem 0.5rem;
  border-radius: 0.4rem;
  border: 1px solid transparent;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.primary};

  &:hover {
    border-color: ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const DangerBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.28rem 0.5rem;
  border-radius: 0.4rem;
  border: 1px solid transparent;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.mode === 'dark' ? '#f87171' : '#dc2626'};

  &:hover {
    border-color: ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const EmptyDay = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.textMuted};
  font-style: italic;
  padding: 0.35rem 0;
`

export const LoadMoreWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
`

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  background: ${({ theme }) => theme.overlay};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
  box-sizing: border-box;
`

export const Modal = styled.div`
  width: 100%;
  max-width: 26rem;
  border-radius: 0.85rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1.1rem 1.15rem 1.15rem;
  margin-top: 2vh;
`

export const ModalTitle = styled.h3`
  margin: 0 0 0.85rem;
  font-size: 1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`

export const ModalField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.32rem;
  margin-bottom: 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
`

export const ModalInput = styled.input`
  box-sizing: border-box;
  min-height: 2.35rem;
  padding: 0 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const ModalSelect = styled.select`
  box-sizing: border-box;
  min-height: 2.35rem;
  padding: 0 0.55rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const ModalTextarea = styled.textarea`
  box-sizing: border-box;
  min-height: 5rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;
  line-height: 1.45;
  resize: vertical;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const ModalActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.85rem;
`

export const ErrorText = styled.p`
  margin: 0 0 0.65rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#f87171' : '#dc2626')};
`
