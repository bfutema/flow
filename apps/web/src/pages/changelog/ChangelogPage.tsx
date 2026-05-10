import { useEffect, useMemo, useState } from 'react'
import { useAbility } from '@casl/react'
import { AbilityContext } from '../../contexts/AbilityContext'
import {
  CHANGELOG_ENTRIES,
  CHANGELOG_KIND_LABEL,
  type ChangelogKind,
  maxReleasedAt,
} from '../../data/changelogEntries'
import { changelogUnreadCount, saveLastSeenRelease } from '../../persistence/changelogReadStorage'
import {
  EmptyState,
  EntryBody,
  EntryCard,
  EntryDate,
  EntryHead,
  EntryTitle,
  GhostBtn,
  KindChip,
  Lead,
  PageRoot,
  PageTitle,
  TabBtn,
  TabRow,
  Timeline,
  Toolbar,
} from './ChangelogPage.styles'

type KindFilter = 'all' | ChangelogKind

export function ChangelogPage() {
  const ability = useAbility(AbilityContext)
  const canRead = ability.can('read', 'Changelog')

  const [kind, setKind] = useState<KindFilter>('all')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const b = () => setTick((n) => n + 1)
    window.addEventListener('flow-changelog-read-changed', b)
    return () => window.removeEventListener('flow-changelog-read-changed', b)
  }, [])

  const unread = useMemo(() => changelogUnreadCount(CHANGELOG_ENTRIES), [tick])

  const filtered = useMemo(() => {
    if (kind === 'all') return CHANGELOG_ENTRIES
    return CHANGELOG_ENTRIES.filter((e) => e.kind === kind)
  }, [kind])

  const markAllSeen = () => {
    const max = maxReleasedAt(CHANGELOG_ENTRIES)
    if (max) saveLastSeenRelease(max)
  }

  if (!canRead) {
    return (
      <PageRoot>
        <PageTitle>Novidades</PageTitle>
        <Lead>Sem permissão para ver o histórico de atualizações.</Lead>
      </PageRoot>
    )
  }

  return (
    <PageRoot>
      <PageTitle>Novidades da plataforma</PageTitle>
      <Lead>
        Registro de funcionalidades novas, melhorias, correções e itens de segurança. Em produção, este conteúdo
        pode vir de um CMS ou da API de release notes.
      </Lead>

      <TabRow role="tablist" aria-label="Filtrar por tipo">
        <TabBtn type="button" $active={kind === 'all'} onClick={() => setKind('all')}>
          Todas
        </TabBtn>
        <TabBtn type="button" $active={kind === 'feature'} onClick={() => setKind('feature')}>
          Funcionalidades
        </TabBtn>
        <TabBtn type="button" $active={kind === 'fix'} onClick={() => setKind('fix')}>
          Correções
        </TabBtn>
        <TabBtn type="button" $active={kind === 'improvement'} onClick={() => setKind('improvement')}>
          Melhorias
        </TabBtn>
        <TabBtn type="button" $active={kind === 'security'} onClick={() => setKind('security')}>
          Segurança
        </TabBtn>
      </TabRow>

      <Toolbar>
        {unread > 0 ? (
          <GhostBtn type="button" onClick={markAllSeen}>
            Marcar novidades como vistas ({unread})
          </GhostBtn>
        ) : (
          <GhostBtn type="button" onClick={markAllSeen}>
            Marcar novidades como vistas
          </GhostBtn>
        )}
      </Toolbar>

      {filtered.length === 0 ? (
        <EmptyState>Nenhum item neste filtro.</EmptyState>
      ) : (
        <Timeline aria-label="Histórico de novidades">
          {filtered.map((e) => (
            <EntryCard key={e.id}>
              <EntryHead>
                <KindChip $kind={e.kind}>{CHANGELOG_KIND_LABEL[e.kind]}</KindChip>
                <EntryDate dateTime={e.releasedAt}>
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  }).format(new Date(e.releasedAt))}
                </EntryDate>
              </EntryHead>
              <EntryTitle>{e.title}</EntryTitle>
              <EntryBody>{e.body}</EntryBody>
            </EntryCard>
          ))}
        </Timeline>
      )}
    </PageRoot>
  )
}
