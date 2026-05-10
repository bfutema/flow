import type { MongoAbility, RawRuleOf } from '@casl/ability'

/** Verbos alinhados ao CASL (API futura). */
export type AppAction = 'manage' | 'create' | 'read' | 'update' | 'delete'

/**
 * Recursos da aplicação (subjects CASL).
 * Use strings estáveis — espelhar na API com @casl/ability.
 */
export type AppSubject =
  | 'all'
  | 'Dashboard'
  | 'Project'
  | 'User'
  | 'Report'
  | 'Timeline'
  | 'TaskBoard'
  | 'Organogram'
  | 'Security'
  | 'JsonViewer'
  | 'FlowDesign'
  /** Daily / stand-up declarado pelo colaborador (white-label, sem coleta automática). */
  | 'DailyStatus'
  /** Dados institucionais da tenant (nome, contato, locale). */
  | 'Organization'
  /** Histórico de eventos relevantes para conformidade e suporte. */
  | 'AuditLog'
  /** Férias e ausências (workflow ilustrativo). */
  | 'Absence'
  /** Fila única de pendências (horas, daily, solicitações). */
  | 'ApprovalQueue'
  /** Equipes / squads vinculadas a pessoas e projetos. */
  | 'Team'
  /** Centro de avisos por usuário (MVP local). */
  | 'NotificationCenter'

export type AppAbilities = [AppAction, AppSubject]

export type AppAbility = MongoAbility<AppAbilities>

export type AppRawRule = RawRuleOf<AppAbility>

/** Papéis persistidos (rótulos do cadastro → slug). */
export type RoleSlug = 'admin' | 'editor' | 'viewer'
