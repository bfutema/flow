import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAbility } from '@casl/react'
import { endOfMonth, format, parseISO, startOfMonth } from 'date-fns'
import { AbilityContext } from '../../contexts/AbilityContext'
import { useAuth } from '../../contexts/AuthContext'
import { getDirectoryUsers, getUserById } from '../../data/directoryUsers'
import {
  absenceTypeLabel,
  addAbsence,
  inclusiveCalendarDays,
  loadAbsences,
  updateAbsence,
  vacationBalanceForUser,
  type AbsenceRecord,
  type AbsenceStatus,
  type AbsenceType,
} from '../../persistence/absenceStorage'
import {
  Card,
  CardFootnote,
  CardTitle,
  Chip,
  Field,
  GhostBtn,
  InlineLink,
  Input,
  Lead,
  Modal,
  ModalActions,
  ModalTitle,
  Overlay,
  PageRoot,
  PageTitle,
  PrimaryBtn,
  Select,
  Stat,
  StatGrid,
  StatLabel,
  StatValue,
  Table,
  TableWrap,
  Td,
  TdEmpty,
  Textarea,
  Th,
  Toolbar,
} from './peopleOpsShared.styles'

function overlapsMonth(start: string, end: string, monthStr: string): boolean {
  const mStart = startOfMonth(parseISO(`${monthStr}-01`))
  const mEnd = endOfMonth(mStart)
  const a = parseISO(start)
  const b = parseISO(end)
  return a <= mEnd && b >= mStart
}

function statusLabel(s: AbsenceStatus): string {
  if (s === 'pending') return 'Pendente'
  if (s === 'approved') return 'Aprovado'
  return 'Recusado'
}

export function AbsencesPage() {
  const { userEmail } = useAuth()
  const ability = useAbility(AbilityContext)
  const viewer = useMemo(() => (userEmail ? getDirectoryUsers().find((u) => u.email === userEmail) : undefined), [
    userEmail,
  ])

  const canRead = ability.can('read', 'Absence')
  const canCreate = ability.can('create', 'Absence')
  const canUpdate = ability.can('update', 'Absence')

  const [tick, setTick] = useState(0)
  const [balanceUserId, setBalanceUserId] = useState(viewer?.id ?? '')
  const [monthFilter, setMonthFilter] = useState(format(new Date(), 'yyyy-MM'))
  const [modalOpen, setModalOpen] = useState(false)

  const [fUserId, setFUserId] = useState(viewer?.id ?? '')
  const [fType, setFType] = useState<AbsenceType>('vacation')
  const [fStart, setFStart] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [fEnd, setFEnd] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [fNotes, setFNotes] = useState('')

  useEffect(() => {
    const b = () => setTick((n) => n + 1)
    window.addEventListener('flow-absences-changed', b)
    return () => window.removeEventListener('flow-absences-changed', b)
  }, [])

  useEffect(() => {
    if (viewer?.id && !balanceUserId) setBalanceUserId(viewer.id)
    if (viewer?.id && !fUserId) setFUserId(viewer.id)
  }, [viewer, balanceUserId, fUserId])

  const rows = useMemo(() => loadAbsences(), [tick])
  const users = useMemo(() => getDirectoryUsers(), [tick])
  const year = new Date().getFullYear()
  const balance = balanceUserId ? vacationBalanceForUser(balanceUserId, year) : null

  const monthRows = useMemo(
    () => rows.filter((r) => overlapsMonth(r.startDate, r.endDate, monthFilter)),
    [rows, monthFilter],
  )

  const submitRequest = () => {
    if (!fUserId || !canCreate) return
    const row: AbsenceRecord = {
      id: crypto.randomUUID(),
      userId: fUserId,
      type: fType,
      startDate: fStart,
      endDate: fEnd,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      notes: fNotes.trim() || undefined,
    }
    addAbsence(row)
    setModalOpen(false)
    setFNotes('')
  }

  const decide = useCallback(
    (row: AbsenceRecord, status: 'approved' | 'rejected') => {
      if (!canUpdate || !viewer) return
      updateAbsence({
        ...row,
        status,
        decidedAt: new Date().toISOString(),
        approverUserId: viewer.id,
        rejectReason: status === 'rejected' ? 'Recusado na demo (sem motivo obrigatório).' : undefined,
      })
    },
    [canUpdate, viewer],
  )

  if (!canRead) {
    return (
      <PageRoot>
        <PageTitle>Férias e ausências</PageTitle>
        <Lead>Sem permissão para ver este módulo.</Lead>
      </PageRoot>
    )
  }

  return (
    <PageRoot>
      <PageTitle>Férias e ausências</PageTitle>
      <Lead>
        Fluxo ilustrativo: solicitação → aprovação. Saldo de férias é{' '}
        <strong>{year}</strong> em dias corridos (template). Dados no navegador.
      </Lead>

      <StatGrid>
        <Stat>
          <StatLabel>Saldo · direito anual (ilustrativo)</StatLabel>
          <StatValue>{balance?.entitlement ?? '—'}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>Férias usadas (aprovadas)</StatLabel>
          <StatValue>{balance?.usedApproved ?? '—'}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>Restante</StatLabel>
          <StatValue>{balance?.remaining ?? '—'}</StatValue>
        </Stat>
      </StatGrid>

      <Toolbar>
        <Field>
          Pessoa (saldo)
          <Select value={balanceUserId} onChange={(e) => setBalanceUserId(e.target.value)}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          Calendário · mês
          <Input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} />
        </Field>
        {canCreate ? (
          <PrimaryBtn type="button" onClick={() => setModalOpen(true)}>
            Nova solicitação
          </PrimaryBtn>
        ) : null}
      </Toolbar>

      <Card>
        <CardTitle>Solicitações em {monthFilter}</CardTitle>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Colaborador</Th>
                <Th>Tipo</Th>
                <Th>Início</Th>
                <Th>Fim</Th>
                <Th>Dias</Th>
                <Th>Status</Th>
                <Th>Aprovador</Th>
                {canUpdate ? <Th>Ações</Th> : null}
              </tr>
            </thead>
            <tbody>
              {monthRows.length === 0 ? (
                <tr>
                  <TdEmpty colSpan={canUpdate ? 8 : 7}>Nenhuma solicitação neste mês.</TdEmpty>
                </tr>
              ) : (
                monthRows.map((r) => {
                  const u = getUserById(r.userId)
                  const appr = r.approverUserId ? getUserById(r.approverUserId) : undefined
                  const tone =
                    r.status === 'approved' ? 'ok' : r.status === 'rejected' ? 'bad' : 'pending'
                  return (
                    <tr key={r.id}>
                      <Td>{u?.name ?? r.userId}</Td>
                      <Td>{absenceTypeLabel(r.type)}</Td>
                      <Td>{r.startDate}</Td>
                      <Td>{r.endDate}</Td>
                      <Td>{inclusiveCalendarDays(r.startDate, r.endDate)}</Td>
                      <Td>
                        <Chip $tone={tone}>{statusLabel(r.status)}</Chip>
                      </Td>
                      <Td>{appr?.name ?? '—'}</Td>
                      {canUpdate ? (
                        <Td>
                          {r.status === 'pending' ? (
                            <>
                              <GhostBtn type="button" onClick={() => decide(r, 'approved')}>
                                Aprovar
                              </GhostBtn>{' '}
                              <GhostBtn type="button" onClick={() => decide(r, 'rejected')}>
                                Recusar
                              </GhostBtn>
                            </>
                          ) : (
                            '—'
                          )}
                        </Td>
                      ) : null}
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <Card>
        <CardTitle>Todas as solicitações</CardTitle>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Colaborador</Th>
                <Th>Tipo</Th>
                <Th>Período</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 40).map((r) => (
                <tr key={r.id}>
                  <Td>{getUserById(r.userId)?.name ?? r.userId}</Td>
                  <Td>{absenceTypeLabel(r.type)}</Td>
                  <Td>
                    {r.startDate} → {r.endDate}
                  </Td>
                  <Td>{statusLabel(r.status)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
        <CardFootnote>
          Veja também a <InlineLink to="/people/approvals">fila de aprovações</InlineLink> para outras pendências.
        </CardFootnote>
      </Card>

      {modalOpen ? (
        <Overlay role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <Modal role="dialog" aria-modal onMouseDown={(e) => e.stopPropagation()}>
            <ModalTitle>Nova solicitação</ModalTitle>
            <Field>
              Colaborador
              <Select value={fUserId} onChange={(e) => setFUserId(e.target.value)}>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              Tipo
              <Select
                value={fType}
                onChange={(e) => setFType(e.target.value as AbsenceType)}
              >
                <option value="vacation">Férias</option>
                <option value="leave">Ausência</option>
                <option value="medical">Saúde</option>
                <option value="other">Outro</option>
              </Select>
            </Field>
            <Field>
              Início
              <Input type="date" value={fStart} onChange={(e) => setFStart(e.target.value)} />
            </Field>
            <Field>
              Fim
              <Input type="date" value={fEnd} onChange={(e) => setFEnd(e.target.value)} />
            </Field>
            <Field>
              Observações
              <Textarea value={fNotes} onChange={(e) => setFNotes(e.target.value)} />
            </Field>
            <ModalActions>
              <GhostBtn type="button" onClick={() => setModalOpen(false)}>
                Cancelar
              </GhostBtn>
              <PrimaryBtn type="button" onClick={submitRequest}>
                Enviar
              </PrimaryBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      ) : null}
    </PageRoot>
  )
}
