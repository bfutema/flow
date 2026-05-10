import { useEffect, useMemo, useState } from 'react'
import { useAbility } from '@casl/react'
import { AbilityContext } from '../../contexts/AbilityContext'
import { loadAuditLogEntries, type AuditLogEntry } from '../../persistence/auditLogStorage'
import {
  Field,
  Input,
  Lead,
  PageTitle,
  Root,
  Select,
  Table,
  TableWrap,
  Td,
  TdMuted,
  Th,
  Toolbar,
  Verb,
} from './AuditLogPage.styles'

function formatAt(iso: string): string {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(d)
  } catch {
    return iso
  }
}

export function AuditLogPage() {
  const ability = useAbility(AbilityContext)
  const canRead = ability.can('read', 'AuditLog')
  const [tick, setTick] = useState(0)
  const [search, setSearch] = useState('')
  const [resource, setResource] = useState<string>('')

  useEffect(() => {
    const bump = () => setTick((n) => n + 1)
    window.addEventListener('flow-audit-log-changed', bump)
    return () => window.removeEventListener('flow-audit-log-changed', bump)
  }, [])

  const rows = useMemo(() => loadAuditLogEntries(), [tick])

  const resources = useMemo(() => {
    const s = new Set<string>()
    for (const r of rows) s.add(r.resource)
    return [...s].sort()
  }, [rows])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (resource && r.resource !== resource) return false
      if (!q) return true
      const blob = `${r.summary} ${r.verb} ${r.resource} ${r.actorEmail ?? ''}`.toLowerCase()
      return blob.includes(q)
    })
  }, [rows, resource, search])

  if (!canRead) {
    return (
      <Root>
        <PageTitle>Auditoria</PageTitle>
        <Lead>Você não tem permissão para visualizar o log de auditoria.</Lead>
      </Root>
    )
  }

  return (
    <Root>
      <PageTitle>Auditoria</PageTitle>
      <Lead>
        Eventos registrados neste ambiente de demonstração (armazenamento local). Em produção, a API deveria ser
        a fonte da verdade, com retenção e exportação conforme política do cliente.
      </Lead>

      <Toolbar>
        <Field>
          Buscar
          <Input
            placeholder="Texto livre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar no log"
          />
        </Field>
        <Field>
          Recurso
          <Select
            value={resource}
            onChange={(e) => setResource(e.target.value)}
            aria-label="Filtrar por recurso"
          >
            <option value="">Todos</option>
            {resources.map((res) => (
              <option key={res} value={res}>
                {res}
              </option>
            ))}
          </Select>
        </Field>
      </Toolbar>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Quando</Th>
              <Th>Ator</Th>
              <Th>Verbo</Th>
              <Th>Recurso</Th>
              <Th>Resumo</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <Td
                  colSpan={5}
                  style={{ textAlign: 'center', padding: '1.25rem 0.75rem', fontStyle: 'italic' }}
                >
                  Nenhum evento encontrado com os filtros atuais.
                </Td>
              </tr>
            ) : (
              filtered.map((r: AuditLogEntry) => (
                <tr key={r.id}>
                  <TdMuted>{formatAt(r.at)}</TdMuted>
                  <Td>{r.actorEmail ?? '—'}</Td>
                  <Td>
                    <Verb>{r.verb}</Verb>
                  </Td>
                  <Td>{r.resource}</Td>
                  <Td>{r.summary}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrap>
    </Root>
  )
}
