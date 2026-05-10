import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAbility } from '@casl/react'
import { AbilityContext } from '../../contexts/AbilityContext'
import { getDirectoryUsers, getUserById } from '../../data/directoryUsers'
import { getAllProjects, resolveProjectById } from '../../data/projects'
import {
  deleteTeam,
  loadTeams,
  upsertTeam,
  type TeamRecord,
} from '../../persistence/teamStorage'
import {
  CheckboxLabel,
  CheckboxList,
  DangerBtn,
  Field,
  GhostBtn,
  Input,
  Lead,
  ModalActions,
  ModalFieldStack,
  ModalTitle,
  ModalWide,
  Overlay,
  PageRoot,
  PageTitle,
  PrimaryBtn,
  TeamActions,
  TeamCard,
  TeamGrid,
  TeamMeta,
  TeamName,
  Textarea,
  Toolbar,
} from './peopleOpsShared.styles'

export function TeamsPage() {
  const ability = useAbility(AbilityContext)
  const canRead = ability.can('read', 'Team')
  const canCreate = ability.can('create', 'Team')
  const canUpdate = ability.can('update', 'Team')
  const canDelete = ability.can('delete', 'Team')

  const [tick, setTick] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TeamRecord | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [projectIds, setProjectIds] = useState<string[]>([])

  useEffect(() => {
    const b = () => setTick((n) => n + 1)
    window.addEventListener('flow-teams-changed', b)
    return () => window.removeEventListener('flow-teams-changed', b)
  }, [])

  const teams = useMemo(() => loadTeams(), [tick])
  const users = useMemo(() => getDirectoryUsers(), [tick])
  const projects = useMemo(() => getAllProjects(), [tick])

  const openNew = () => {
    setEditing(null)
    setName('')
    setDescription('')
    setMemberIds([])
    setProjectIds([])
    setModalOpen(true)
  }

  const openEdit = (t: TeamRecord) => {
    setEditing(t)
    setName(t.name)
    setDescription(t.description)
    setMemberIds([...t.memberIds])
    setProjectIds([...t.linkedProjectIds])
    setModalOpen(true)
  }

  const toggleMember = (id: string) => {
    setMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleProject = (id: string) => {
    setProjectIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const saveTeam = () => {
    if (!name.trim()) return
    const row: TeamRecord = {
      id: editing?.id ?? crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      memberIds,
      linkedProjectIds: projectIds,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    }
    upsertTeam(row)
    setModalOpen(false)
  }

  const remove = useCallback(
    (id: string) => {
      if (!canDelete || !window.confirm('Excluir esta equipe?')) return
      deleteTeam(id)
    },
    [canDelete],
  )

  if (!canRead) {
    return (
      <PageRoot>
        <PageTitle>Equipes</PageTitle>
        <Lead>Sem permissão.</Lead>
      </PageRoot>
    )
  }

  return (
    <PageRoot>
      <PageTitle>Equipes</PageTitle>
      <Lead>
        Agrupe pessoas e projetos em squads ou streams — mais leve que um organograma completo. Ideal para
        white-label até existir módulo hierárquico dedicado.
      </Lead>

      <Toolbar>
        {canCreate ? (
          <PrimaryBtn type="button" onClick={openNew}>
            Nova equipe
          </PrimaryBtn>
        ) : null}
      </Toolbar>

      <TeamGrid>
        {teams.map((t) => (
          <TeamCard key={t.id}>
            <TeamName>{t.name}</TeamName>
            <TeamMeta>
              {t.description || 'Sem descrição.'}
              <br />
              <strong>Membros:</strong>{' '}
              {t.memberIds.length
                ? t.memberIds.map((id) => getUserById(id)?.name ?? id).join(', ')
                : '—'}
              <br />
              <strong>Projetos:</strong>{' '}
              {t.linkedProjectIds.length
                ? t.linkedProjectIds.map((id) => resolveProjectById(id)?.name ?? id).join(', ')
                : '—'}
            </TeamMeta>
            <TeamActions>
              {canUpdate ? (
                <GhostBtn type="button" onClick={() => openEdit(t)}>
                  Editar
                </GhostBtn>
              ) : null}
              {canDelete ? (
                <DangerBtn type="button" onClick={() => remove(t.id)}>
                  Excluir
                </DangerBtn>
              ) : null}
            </TeamActions>
          </TeamCard>
        ))}
      </TeamGrid>

      {modalOpen ? (
        <Overlay role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <ModalWide role="dialog" aria-modal onMouseDown={(e) => e.stopPropagation()}>
            <ModalTitle>{editing ? 'Editar equipe' : 'Nova equipe'}</ModalTitle>
            <ModalFieldStack>
              <Field>
                Nome
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field>
                Descrição
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>
              <Field>
                Membros
                <CheckboxList>
                  {users.map((u) => (
                    <CheckboxLabel key={u.id}>
                      <input
                        type="checkbox"
                        checked={memberIds.includes(u.id)}
                        onChange={() => toggleMember(u.id)}
                      />
                      {u.name}
                    </CheckboxLabel>
                  ))}
                </CheckboxList>
              </Field>
              <Field>
                Projetos vinculados
                <CheckboxList>
                  {projects.map((p) => (
                    <CheckboxLabel key={p.id}>
                      <input
                        type="checkbox"
                        checked={projectIds.includes(p.id)}
                        onChange={() => toggleProject(p.id)}
                      />
                      {p.name}
                    </CheckboxLabel>
                  ))}
                </CheckboxList>
              </Field>
            </ModalFieldStack>
            <ModalActions>
              <GhostBtn type="button" onClick={() => setModalOpen(false)}>
                Cancelar
              </GhostBtn>
              <PrimaryBtn type="button" onClick={saveTeam} disabled={!name.trim()}>
                Salvar
              </PrimaryBtn>
            </ModalActions>
          </ModalWide>
        </Overlay>
      ) : null}
    </PageRoot>
  )
}
