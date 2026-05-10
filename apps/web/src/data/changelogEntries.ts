/**
 * Registro curado de novidades da plataforma (substitua por API em produção).
 * Ordene do mais recente ao mais antigo; `releasedAt` em ISO 8601 para comparação lexicográfica.
 */
export type ChangelogKind = 'feature' | 'fix' | 'improvement' | 'security'

export type ChangelogEntry = {
  id: string
  releasedAt: string
  kind: ChangelogKind
  title: string
  /** Uma ou mais linhas; quebras de linha preservadas. */
  body: string
}

export const CHANGELOG_KIND_LABEL: Record<ChangelogKind, string> = {
  feature: 'Nova funcionalidade',
  fix: 'Correção',
  improvement: 'Melhoria',
  security: 'Segurança',
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    id: 'cl-2026-05-10-changelog',
    releasedAt: '2026-05-10T18:00:00.000Z',
    kind: 'feature',
    title: 'Página de novidades (changelog)',
    body:
      'Histórico de atualizações da plataforma: novas funcionalidades, correções e melhorias.\nAcesso pelo menu Plataforma → Novidades ou pelo atalho na conta.',
  },
  {
    id: 'cl-2026-05-10-fix-notif-popover',
    releasedAt: '2026-05-10T17:25:00.000Z',
    kind: 'fix',
    title: 'Popover de notificações no header não abria',
    body:
      'Corrigido ciclo de renderização que impedia o painel de receber posição (open vs. ref do painel).\nTambém evitado fechar no mesmo clique por captura no backdrop.',
  },
  {
    id: 'cl-2026-05-10-security-logout',
    releasedAt: '2026-05-10T16:50:00.000Z',
    kind: 'security',
    title: 'Encerrar sessão só no menu da conta',
    body:
      'O botão de sair foi removido do header para reduzir cliques acidentais; o logout fica explícito no popover do perfil, com o mesmo fluxo de redirecionamento para o login.',
  },
  {
    id: 'cl-2026-05-10-people-spacing',
    releasedAt: '2026-05-10T14:30:00.000Z',
    kind: 'improvement',
    title: 'Espaçamento unificado em Operação e pessoas',
    body:
      'Telas de férias, aprovações, equipes e avisos alinhadas ao mesmo ritmo de paddings e cards do restante do admin.',
  },
  {
    id: 'cl-2026-05-10-notif-header',
    releasedAt: '2026-05-10T12:00:00.000Z',
    kind: 'improvement',
    title: 'Notificações no header e sidebar agrupado',
    body:
      'Sino de notificações no topo com popover (filtros e ações).\nMenu lateral reorganizado em grupos colapsáveis (Gestão, Operação, Pessoas, Governança, Plataforma).',
  },
  {
    id: 'cl-2026-05-09-people-ops',
    releasedAt: '2026-05-09T16:00:00.000Z',
    kind: 'feature',
    title: 'Operação e pessoas',
    body:
      'Férias e ausências (saldo ilustrativo e fluxo de aprovação).\nFila única de aprovações.\nEquipes vinculadas a membros e projetos.\nCentro de avisos com digest simulado (dados locais).',
  },
  {
    id: 'cl-2026-05-09-perms',
    releasedAt: '2026-05-09T10:00:00.000Z',
    kind: 'improvement',
    title: 'Permissões granulares',
    body:
      'Novos recursos CASL para os módulos de pessoas e notificações, configuráveis em Controle de acesso.',
  },
]

export function maxReleasedAt(entries: ChangelogEntry[]): string {
  if (entries.length === 0) return ''
  return entries.reduce((max, e) => (e.releasedAt > max ? e.releasedAt : max), entries[0].releasedAt)
}
