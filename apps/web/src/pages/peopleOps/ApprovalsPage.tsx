import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAbility } from '@casl/react'
import { AbilityContext } from '../../contexts/AbilityContext'
import { useAuth } from '../../contexts/AuthContext'
import { getUserByEmail, getUserById } from '../../data/directoryUsers'
import {
  approvalKindLabel,
  loadApprovals,
  updateApproval,
  type ApprovalItem,
  type ApprovalKind,
} from '../../persistence/approvalQueueStorage'
import {
  Card,
  CardTitle,
  Chip,
  GhostBtn,
  Lead,
  PageRoot,
  PageTitle,
  PrimaryBtn,
  TabBtn,
  TabRow,
  Table,
  TableCellFootnote,
  TableCellMuted,
  TableCellStack,
  TableWrap,
  Td,
  TdEmpty,
  Th,
} from './peopleOpsShared.styles'

export function ApprovalsPage() {
  const { userEmail } = useAuth()
  const ability = useAbility(AbilityContext)
  const viewer = userEmail ? getUserByEmail(userEmail) : undefined

  const canRead = ability.can('read', 'ApprovalQueue')
  const canUpdate = ability.can('update', 'ApprovalQueue')

  const [tick, setTick] = useState(0)
  const [tab, setTab] = useState<'all' | ApprovalKind>('all')

  useEffect(() => {
    const b = () => setTick((n) => n + 1)
    window.addEventListener('flow-approvals-changed', b)
    return () => window.removeEventListener('flow-approvals-changed', b)
  }, [])

  const rows = useMemo(() => loadApprovals(), [tick])

  const filtered = useMemo(() => {
    if (tab === 'all') return rows
    return rows.filter((r) => r.kind === tab)
  }, [rows, tab])

  const decide = useCallback(
    (row: ApprovalItem, status: 'approved' | 'rejected') => {
      if (!canUpdate || !viewer) return
      updateApproval({
        ...row,
        status,
        decidedAt: new Date().toISOString(),
        decidedByUserId: viewer.id,
      })
    },
    [canUpdate, viewer],
  )

  if (!canRead) {
    return (
      <PageRoot>
        <PageTitle>Aprovações</PageTitle>
        <Lead>Sem permissão para ver a fila.</Lead>
      </PageRoot>
    )
  }

  return (
    <PageRoot>
      <PageTitle>Aprovações</PageTitle>
      <Lead>
        Fila única para pendências ilustrativas (horas, daily, solicitações genéricas). Centraliza decisões que,
        em um ERP real, poderiam vir de várias origens.
      </Lead>

      <TabRow role="tablist" aria-label="Filtrar tipo">
        <TabBtn type="button" $active={tab === 'all'} onClick={() => setTab('all')}>
          Todos
        </TabBtn>
        <TabBtn
          type="button"
          $active={tab === 'hours_correction'}
          onClick={() => setTab('hours_correction')}
        >
          Horas
        </TabBtn>
        <TabBtn type="button" $active={tab === 'daily_review'} onClick={() => setTab('daily_review')}>
          Daily
        </TabBtn>
        <TabBtn
          type="button"
          $active={tab === 'generic_request'}
          onClick={() => setTab('generic_request')}
        >
          Solicitações
        </TabBtn>
      </TabRow>

      <Card>
        <CardTitle>Pendências e histórico recente</CardTitle>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Tipo</Th>
                <Th>Título</Th>
                <Th>Solicitante</Th>
                <Th>Status</Th>
                {canUpdate ? <Th>Ações</Th> : null}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <TdEmpty colSpan={canUpdate ? 5 : 4}>Nada neste filtro.</TdEmpty>
                </tr>
              ) : (
                filtered.map((r) => {
                  const req = getUserById(r.requesterUserId)
                  const dec = r.decidedByUserId ? getUserById(r.decidedByUserId) : undefined
                  const tone =
                    r.status === 'approved' ? 'ok' : r.status === 'rejected' ? 'bad' : 'pending'
                  return (
                    <tr key={r.id}>
                      <Td>{approvalKindLabel(r.kind)}</Td>
                      <Td>
                        <TableCellStack>
                          <strong>{r.title}</strong>
                          <TableCellMuted>{r.summary}</TableCellMuted>
                          {dec ? <TableCellFootnote>Por {dec.name}</TableCellFootnote> : null}
                        </TableCellStack>
                      </Td>
                      <Td>{req?.name ?? r.requesterUserId}</Td>
                      <Td>
                        <Chip $tone={tone}>
                          {r.status === 'pending'
                            ? 'Pendente'
                            : r.status === 'approved'
                              ? 'Aprovado'
                              : 'Recusado'}
                        </Chip>
                      </Td>
                      {canUpdate ? (
                        <Td>
                          {r.status === 'pending' ? (
                            <>
                              <PrimaryBtn type="button" onClick={() => decide(r, 'approved')}>
                                Aprovar
                              </PrimaryBtn>{' '}
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
    </PageRoot>
  )
}
