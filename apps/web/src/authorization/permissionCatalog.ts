import type { AppAction, AppSubject } from './types'

export type PermissionCatalogItem = {
  /** Chave estável p.ex. "create:Project" */
  id: string
  action: AppAction
  subject: AppSubject
  label: string
  description?: string
  group: string
}

/**
 * Catálogo explícito de permissões granulares (RBAC híbrido).
 * Novas telas/ações: acrescentar aqui e usar nas telas com `ability.can(...)`.
 */
export const PERMISSION_CATALOG: PermissionCatalogItem[] = [
  {
    id: 'read:Dashboard',
    action: 'read',
    subject: 'Dashboard',
    label: 'Ver dashboard',
    group: 'Painel',
    description: 'Página inicial e atalhos.',
  },
  {
    id: 'read:Project',
    action: 'read',
    subject: 'Project',
    label: 'Listar e abrir projetos',
    group: 'Projetos',
  },
  {
    id: 'create:Project',
    action: 'create',
    subject: 'Project',
    label: 'Criar projeto',
    group: 'Projetos',
  },
  {
    id: 'update:Project',
    action: 'update',
    subject: 'Project',
    label: 'Editar projeto e modelagem',
    group: 'Projetos',
    description: 'Metadados, motor SQL, diagrama ER.',
  },
  {
    id: 'delete:Project',
    action: 'delete',
    subject: 'Project',
    label: 'Excluir projeto',
    group: 'Projetos',
  },
  {
    id: 'read:User',
    action: 'read',
    subject: 'User',
    label: 'Ver usuários e perfis',
    group: 'Usuários',
  },
  {
    id: 'create:User',
    action: 'create',
    subject: 'User',
    label: 'Criar usuário',
    group: 'Usuários',
  },
  {
    id: 'update:User',
    action: 'update',
    subject: 'User',
    label: 'Editar usuário',
    group: 'Usuários',
  },
  {
    id: 'delete:User',
    action: 'delete',
    subject: 'User',
    label: 'Excluir usuário',
    group: 'Usuários',
  },
  {
    id: 'read:Report',
    action: 'read',
    subject: 'Report',
    label: 'Ver relatórios',
    group: 'Relatórios',
  },
  {
    id: 'read:Timeline',
    action: 'read',
    subject: 'Timeline',
    label: 'Ver timeline / alocações',
    group: 'Timeline',
  },
  {
    id: 'create:Timeline',
    action: 'create',
    subject: 'Timeline',
    label: 'Alocar colaborador',
    group: 'Timeline',
    description: 'Incluir colaborador no projeto na timeline.',
  },
  {
    id: 'delete:Timeline',
    action: 'delete',
    subject: 'Timeline',
    label: 'Desalocar colaborador',
    group: 'Timeline',
    description: 'Remover colaborador alocado do projeto na timeline.',
  },
  {
    id: 'update:Timeline',
    action: 'update',
    subject: 'Timeline',
    label: 'Editar barras e cores na timeline',
    group: 'Timeline',
    description: 'Ajustar períodos das barras e cor da alocação.',
  },
  {
    id: 'read:TaskBoard',
    action: 'read',
    subject: 'TaskBoard',
    label: 'Ver quadro de tarefas',
    group: 'Tarefas',
  },
  {
    id: 'create:TaskBoard',
    action: 'create',
    subject: 'TaskBoard',
    label: 'Adicionar tarefa',
    group: 'Tarefas',
    description: 'Criar novos cartões no quadro.',
  },
  {
    id: 'update:TaskBoard',
    action: 'update',
    subject: 'TaskBoard',
    label: 'Editar tarefas e colunas',
    group: 'Tarefas',
    description: 'Arrastar cartões, reordenar colunas e gerenciar o quadro.',
  },
  {
    id: 'read:Organogram',
    action: 'read',
    subject: 'Organogram',
    label: 'Ver organograma',
    group: 'Organograma',
  },
  {
    id: 'manage:Security',
    action: 'manage',
    subject: 'Security',
    label: 'Configurar papéis e permissões',
    group: 'Segurança',
    description: 'Tela de controle de acesso (este módulo).',
  },
  {
    id: 'read:DailyStatus',
    action: 'read',
    subject: 'DailyStatus',
    label: 'Ver daily / status do time',
    group: 'Colaboração',
    description: 'Feed de dailies declaradas manualmente pelos colaboradores.',
  },
  {
    id: 'create:DailyStatus',
    action: 'create',
    subject: 'DailyStatus',
    label: 'Registrar daily',
    group: 'Colaboração',
    description: 'Incluir ou duplicar registro do próprio dia.',
  },
  {
    id: 'update:DailyStatus',
    action: 'update',
    subject: 'DailyStatus',
    label: 'Editar daily própria',
    group: 'Colaboração',
    description: 'Alterar texto, horas ou projeto do próprio registro.',
  },
  {
    id: 'delete:DailyStatus',
    action: 'delete',
    subject: 'DailyStatus',
    label: 'Excluir daily própria',
    group: 'Colaboração',
    description: 'Remover um registro criado pelo próprio usuário.',
  },
  {
    id: 'read:Organization',
    action: 'read',
    subject: 'Organization',
    label: 'Ver configurações da organização',
    group: 'Organização',
    description: 'Nome exibido, contato e preferências regionais (somente leitura para papéis sem atualização).',
  },
  {
    id: 'update:Organization',
    action: 'update',
    subject: 'Organization',
    label: 'Editar configurações da organização',
    group: 'Organização',
    description: 'Alterar dados institucionais da tenant no template demo.',
  },
  {
    id: 'read:AuditLog',
    action: 'read',
    subject: 'AuditLog',
    label: 'Ver auditoria',
    group: 'Organização',
    description: 'Linha do tempo de eventos registrados (demo via navegador; em produção viria da API).',
  },
  {
    id: 'read:Absence',
    action: 'read',
    subject: 'Absence',
    label: 'Ver férias e ausências',
    group: 'Operação e pessoas',
  },
  {
    id: 'create:Absence',
    action: 'create',
    subject: 'Absence',
    label: 'Solicitar ausência',
    group: 'Operação e pessoas',
  },
  {
    id: 'update:Absence',
    action: 'update',
    subject: 'Absence',
    label: 'Aprovar ou recusar ausências',
    group: 'Operação e pessoas',
  },
  {
    id: 'read:ApprovalQueue',
    action: 'read',
    subject: 'ApprovalQueue',
    label: 'Ver fila de aprovações',
    group: 'Operação e pessoas',
  },
  {
    id: 'update:ApprovalQueue',
    action: 'update',
    subject: 'ApprovalQueue',
    label: 'Decidir itens da fila',
    group: 'Operação e pessoas',
  },
  {
    id: 'read:Team',
    action: 'read',
    subject: 'Team',
    label: 'Ver equipes',
    group: 'Operação e pessoas',
  },
  {
    id: 'create:Team',
    action: 'create',
    subject: 'Team',
    label: 'Criar equipe',
    group: 'Operação e pessoas',
  },
  {
    id: 'update:Team',
    action: 'update',
    subject: 'Team',
    label: 'Editar equipe',
    group: 'Operação e pessoas',
  },
  {
    id: 'delete:Team',
    action: 'delete',
    subject: 'Team',
    label: 'Excluir equipe',
    group: 'Operação e pessoas',
  },
  {
    id: 'read:NotificationCenter',
    action: 'read',
    subject: 'NotificationCenter',
    label: 'Ver notificações',
    group: 'Operação e pessoas',
  },
  {
    id: 'update:NotificationCenter',
    action: 'update',
    subject: 'NotificationCenter',
    label: 'Marcar notificações como lidas',
    group: 'Operação e pessoas',
  },
]

export function catalogIds(): string[] {
  return PERMISSION_CATALOG.map((p) => p.id)
}
