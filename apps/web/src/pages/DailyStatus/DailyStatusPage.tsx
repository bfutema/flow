import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAbility } from '@casl/react'
import { format, subDays } from 'date-fns'
import { AbilityContext } from '../../contexts/AbilityContext'
import { useAuth } from '../../contexts/AuthContext'
import { getUserByEmail, getUserById } from '../../data/directoryUsers'
import { getAllProjects, resolveProjectById } from '../../data/projects'
import {
  addDailyStatusEntry,
  loadDailyStatusEntries,
  removeDailyStatusEntry,
  updateDailyStatusEntry,
  type DailyStatusEntry,
} from '../../persistence/dailyStatusStorage'
import { initialsFromDisplayName } from '../../utils/userDisplay'
import {
  Avatar,
  Card,
  CardActions,
  CardGrid,
  CardHead,
  CardHeadText,
  DangerBtn,
  DayHeading,
  DaySection,
  EmptyDay,
  ErrorText,
  Field,
  FiltersCluster,
  GhostBtn,
  HoursBadge,
  Input,
  Lead,
  List,
  LoadMoreWrap,
  Modal,
  ModalActions,
  ModalField,
  ModalInput,
  ModalSelect,
  ModalTextarea,
  ModalTitle,
  MutedBtn,
  Overlay,
  PageRoot,
  PageTitle,
  PersonName,
  PrimaryBtn,
  ProjectLine,
  SubHeading,
  Toolbar,
  ToolbarSpacer,
  ToggleRow,
  TopStrip,
} from './DailyStatusPage.styles'

function toYmd(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

function startOfDayLocal(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function dayHeadingLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`)
  const long = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
  const today = startOfDayLocal(new Date())
  const target = startOfDayLocal(d)
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000)
  if (diffDays === 0) return `Hoje · ${long}`
  if (diffDays === 1) return `Ontem · ${long}`
  if (diffDays === 2) return `Anteontem · ${long}`
  return long.charAt(0).toUpperCase() + long.slice(1)
}

function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

type ModalState =
  | { open: false }
  | { open: true; mode: 'create' | 'edit'; entry?: DailyStatusEntry }

export function DailyStatusPage() {
  const { userEmail } = useAuth()
  const ability = useAbility(AbilityContext)
  const [tick, setTick] = useState(0)
  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [mineOnly, setMineOnly] = useState(false)
  const [daysVisible, setDaysVisible] = useState(5)
  const [modal, setModal] = useState<ModalState>({ open: false })
  const [formError, setFormError] = useState<string | null>(null)

  const [fDate, setFDate] = useState(() => toYmd(new Date()))
  const [fProjectId, setFProjectId] = useState('')
  const [fHours, setFHours] = useState('')
  const [fDone, setFDone] = useState('')
  const [fNext, setFNext] = useState('')

  useEffect(() => {
    const bump = () => setTick((n) => n + 1)
    window.addEventListener('flow-daily-status-changed', bump)
    return () => window.removeEventListener('flow-daily-status-changed', bump)
  }, [])

  const entries = useMemo(() => loadDailyStatusEntries(), [tick])

  const viewerUser = useMemo(
    () => (userEmail ? getUserByEmail(userEmail) : undefined),
    [userEmail],
  )

  const canRead = ability.can('read', 'DailyStatus')
  const canCreate = ability.can('create', 'DailyStatus')
  const canUpdate = ability.can('update', 'DailyStatus')
  const canDelete = ability.can('delete', 'DailyStatus')

  const projects = useMemo(() => getAllProjects(), [tick])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((e) => {
      if (mineOnly && viewerUser && e.userId !== viewerUser.id) return false
      if (filterDate && e.date !== filterDate) return false
      if (q) {
        const u = getUserById(e.userId)
        const uname = (u?.name ?? '').toLowerCase()
        const pname = (e.projectId ? resolveProjectById(e.projectId)?.name : '')?.toLowerCase() ?? ''
        if (!uname.includes(q) && !pname.includes(q)) return false
      }
      return true
    })
  }, [entries, mineOnly, viewerUser, filterDate, search])

  const dayKeys = useMemo(() => {
    const today = startOfDayLocal(new Date())
    if (filterDate) return [filterDate]
    const keys: string[] = []
    for (let i = 0; i < daysVisible; i++) {
      keys.push(toYmd(subDays(today, i)))
    }
    return keys
  }, [daysVisible, filterDate])

  const openCreate = () => {
    setFormError(null)
    setFDate(toYmd(new Date()))
    setFProjectId('')
    setFHours('')
    setFDone('')
    setFNext('')
    setModal({ open: true, mode: 'create' })
  }

  const openEdit = (entry: DailyStatusEntry) => {
    setFormError(null)
    setFDate(entry.date)
    setFProjectId(entry.projectId ?? '')
    setFHours(entry.hoursDeclared)
    setFDone(entry.doneItems.join('\n'))
    setFNext(entry.nextItems.join('\n'))
    setModal({ open: true, mode: 'edit', entry })
  }

  const closeModal = () => setModal({ open: false })

  const submitForm = () => {
    if (!viewerUser) {
      setFormError('Usuário não encontrado no diretório.')
      return
    }
    const doneItems = parseLines(fDone)
    const nextItems = parseLines(fNext)
    const hoursDeclared = fHours.trim()
    if (doneItems.length === 0 && !hoursDeclared) {
      setFormError('Informe o que foi feito (lista) ou as horas declaradas.')
      return
    }
    const now = new Date().toISOString()
    const projectId = fProjectId.trim() || null

    if (modal.open && modal.mode === 'edit' && modal.entry) {
      const updated: DailyStatusEntry = {
        ...modal.entry,
        date: fDate,
        projectId,
        hoursDeclared,
        doneItems,
        nextItems,
        updatedAt: now,
      }
      updateDailyStatusEntry(updated)
      closeModal()
      return
    }

    const created: DailyStatusEntry = {
      id: crypto.randomUUID(),
      userId: viewerUser.id,
      date: fDate,
      projectId,
      hoursDeclared,
      doneItems,
      nextItems,
      createdAt: now,
      updatedAt: now,
    }
    addDailyStatusEntry(created)
    closeModal()
  }

  const onDelete = useCallback(
    (entry: DailyStatusEntry) => {
      if (!viewerUser || entry.userId !== viewerUser.id) return
      if (!window.confirm('Excluir este registro de daily?')) return
      removeDailyStatusEntry(entry.id)
    },
    [viewerUser],
  )

  useEffect(() => {
    if (!modal.open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal.open])

  if (!canRead) {
    return (
      <PageRoot>
        <TopStrip>
          <PageTitle>Status diário</PageTitle>
          <Lead>Você não tem permissão para visualizar este módulo.</Lead>
        </TopStrip>
      </PageRoot>
    )
  }

  return (
    <PageRoot>
      <TopStrip>
        <PageTitle>Status diário</PageTitle>
        <Lead>
          Registro manual do que cada pessoa fez e planeja fazer — pensado para white-label, sem agente na
          máquina nem coleta automática. Horas e itens são{' '}
          <strong>declarados pelo colaborador</strong> e podem ser auditados pelo processo da sua empresa.
        </Lead>
      </TopStrip>

      <FiltersCluster>
        <Toolbar>
          <Field>
            Buscar
            <Input
              placeholder="Nome ou projeto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filtrar por nome ou projeto"
            />
          </Field>
          <Field>
            Dia específico
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              aria-label="Filtrar por data"
            />
          </Field>
          <ToggleRow>
            <input
              type="checkbox"
              checked={mineOnly}
              onChange={(e) => setMineOnly(e.target.checked)}
            />
            Só minhas
          </ToggleRow>
          <ToolbarSpacer />
          {canCreate ? (
            <PrimaryBtn onClick={openCreate} disabled={!viewerUser}>
              Registrar daily
            </PrimaryBtn>
          ) : null}
        </Toolbar>
        {canCreate && !viewerUser ? (
          <Lead style={{ marginTop: '0.65rem', marginBottom: 0 }}>
            Para registrar, seu e-mail precisa estar cadastrado em Usuários.
          </Lead>
        ) : null}
      </FiltersCluster>

      {dayKeys.map((dateStr) => {
        const dayEntries = filtered
          .filter((e) => e.date === dateStr)
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

        return (
          <DaySection key={dateStr} aria-labelledby={`day-${dateStr}`}>
            <DayHeading id={`day-${dateStr}`}>{dayHeadingLabel(dateStr)}</DayHeading>
            {dayEntries.length === 0 ? (
              <EmptyDay>Nenhuma daily registrada neste dia.</EmptyDay>
            ) : (
              <CardGrid>
                {dayEntries.map((e) => {
                  const u = getUserById(e.userId)
                  const name = u?.name ?? 'Usuário'
                  const initials = initialsFromDisplayName(name)
                  const proj = e.projectId ? resolveProjectById(e.projectId) : undefined
                  const own = Boolean(viewerUser && e.userId === viewerUser.id)

                  return (
                    <Card key={e.id}>
                      <CardHead>
                        <Avatar aria-hidden>{initials}</Avatar>
                        <CardHeadText>
                          <PersonName>{name}</PersonName>
                          {proj ? <ProjectLine>{proj.name}</ProjectLine> : <ProjectLine>Sem projeto</ProjectLine>}
                          {e.hoursDeclared.trim() ? (
                            <HoursBadge>{e.hoursDeclared.trim()} declaradas</HoursBadge>
                          ) : null}
                        </CardHeadText>
                      </CardHead>
                      {e.doneItems.length > 0 ? (
                        <>
                          <SubHeading>Feito</SubHeading>
                          <List>
                            {e.doneItems.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </List>
                        </>
                      ) : null}
                      {e.nextItems.length > 0 ? (
                        <>
                          <SubHeading>Próximos passos</SubHeading>
                          <List>
                            {e.nextItems.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </List>
                        </>
                      ) : null}
                      {own && (canUpdate || canDelete) ? (
                        <CardActions>
                          {canUpdate ? (
                            <MutedBtn type="button" onClick={() => openEdit(e)}>
                              Editar
                            </MutedBtn>
                          ) : null}
                          {canDelete ? (
                            <DangerBtn type="button" onClick={() => onDelete(e)}>
                              Excluir
                            </DangerBtn>
                          ) : null}
                        </CardActions>
                      ) : null}
                    </Card>
                  )
                })}
              </CardGrid>
            )}
          </DaySection>
        )
      })}

      {!filterDate ? (
        <LoadMoreWrap>
          <GhostBtn type="button" onClick={() => setDaysVisible((n) => n + 7)}>
            Carregar mais dias
          </GhostBtn>
        </LoadMoreWrap>
      ) : (
        <LoadMoreWrap>
          <GhostBtn type="button" onClick={() => setFilterDate('')}>
            Limpar filtro de data
          </GhostBtn>
        </LoadMoreWrap>
      )}

      {modal.open ? (
        <Overlay role="presentation" onMouseDown={(ev) => ev.target === ev.currentTarget && closeModal()}>
          <Modal
            role="dialog"
            aria-modal="true"
            aria-labelledby="daily-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ModalTitle id="daily-modal-title">
              {modal.mode === 'edit' ? 'Editar daily' : 'Nova daily'}
            </ModalTitle>
            {formError ? <ErrorText>{formError}</ErrorText> : null}
            <ModalField>
              Data
              <ModalInput type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} />
            </ModalField>
            <ModalField>
              Projeto (opcional)
              <ModalSelect value={fProjectId} onChange={(e) => setFProjectId(e.target.value)}>
                <option value="">Sem projeto</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </ModalSelect>
            </ModalField>
            <ModalField>
              Horas declaradas (opcional)
              <ModalInput
                placeholder="Ex.: 5h24 ou 8h"
                value={fHours}
                onChange={(e) => setFHours(e.target.value)}
              />
            </ModalField>
            <ModalField>
              O que foi feito (uma linha por item)
              <ModalTextarea value={fDone} onChange={(e) => setFDone(e.target.value)} />
            </ModalField>
            <ModalField>
              Próximos passos (opcional)
              <ModalTextarea value={fNext} onChange={(e) => setFNext(e.target.value)} />
            </ModalField>
            <ModalActions>
              <GhostBtn type="button" onClick={closeModal}>
                Cancelar
              </GhostBtn>
              <PrimaryBtn type="button" onClick={submitForm}>
                Salvar
              </PrimaryBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      ) : null}
    </PageRoot>
  )
}
