import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTheme } from 'styled-components'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ActivityHeatmap } from '../../components/ActivityHeatmap'
import type { DemoUser } from '../../data/demoUsers'
import { resolveProjectById } from '../../data/projects'
import { getProjectIdsForUser } from '../../data/userProjectAssociations'
import { formatDisplayDate } from '../../utils/formatDisplayDate'
import { initialsFromDisplayName } from '../../utils/userDisplay'
import {
  AsideColumn,
  Avatar,
  Card,
  CardHead,
  CardLink,
  CardTitle,
  ChartBox,
  ControlCard,
  DailyDate,
  DailyGroups,
  DailyPill,
  DailyPills,
  DeliveryClient,
  DeliveryCode,
  DeliveryItem,
  DeliveryList,
  DeliveryMeta,
  DeliveryTitle,
  Footnote,
  GhostLink,
  LayoutGrid,
  MainColumn,
  MetricDd,
  MetricDdPositive,
  MetricDt,
  MetricList,
  PageActions,
  PageHeader,
  PageTitle,
  ProfileEmail,
  ProfileHero,
  ProfileName,
  ProfileRole,
  ProfileRoot,
  ProgressLabel,
  ProgressRing,
  ProgressStrong,
  ProgressWrap,
  ProjectMini,
  ProjectMiniBar,
  ProjectMiniBarFill,
  ProjectMiniGrid,
  ProjectMiniName,
  ProjectMiniStatus,
  StatusChip,
  TabBtn,
  TabRow,
  Tag,
  TagRow,
  WidgetGrid,
} from './MyProfilePage.styles'

const PRODUCTIVITY = [
  { m: 'Jun', v: 62 },
  { m: 'Jul', v: 71 },
  { m: 'Ago', v: 89 },
]

const REMUNERATION_BARS = [
  { m: 'Jul', v: 8200 },
  { m: 'Ago', v: 9100 },
  { m: 'Set', v: 8800 },
  { m: 'Out', v: 9500 },
  { m: 'Nov', v: 10100 },
  { m: 'Dez', v: 10800 },
]

const DELIVERIES = [
  {
    code: '#168',
    title: 'Comunicação Black Friday',
    client: 'Polishop',
    status: 'delay' as const,
    statusLabel: 'Em atraso a 3 dias',
  },
  {
    code: '#172',
    title: 'Integração catálogo',
    client: 'BMW',
    status: 'warn' as const,
    statusLabel: '1 semana restante',
  },
  {
    code: '#179',
    title: 'Relatório trimestral',
    client: 'Bradesco',
    status: 'ok' as const,
    statusLabel: 'No prazo',
  },
]

const DAILY = [
  {
    date: 'Hoje',
    items: ['Chat X-Apps — 4h12', 'Projeto Unimed — 8h00'],
  },
  {
    date: 'Ontem',
    items: ['Flow Admin — 6h30', 'Code review — 1h45'],
  },
]

function collaboratorTitle(role: string): string {
  const r = role.toLowerCase()
  if (r.includes('admin')) return 'Administrador(a)'
  if (r.includes('visual')) return 'Colaborador(a)'
  return 'Colaborador(a)'
}

function profileTags(role: string): { label: string; tone: 'amber' | 'cyan' | 'slate' }[] {
  const r = role.toLowerCase()
  if (r.includes('admin')) {
    return [
      { label: 'Operações', tone: 'cyan' },
      { label: 'Governança', tone: 'amber' },
    ]
  }
  if (r.includes('visual')) {
    return [
      { label: 'Consulta', tone: 'slate' },
      { label: 'Relatórios', tone: 'amber' },
    ]
  }
  return [
    { label: 'Desenvolvimento', tone: 'amber' },
    { label: 'Entregas', tone: 'cyan' },
  ]
}

function ProgressRingSvg({ pct, color }: { pct: number; color: string }) {
  const r = 36
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="10" opacity={0.12} />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="54" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight={800}>
        {pct}%
      </text>
    </svg>
  )
}

export type ProfileDashboardProps = {
  profileUser: DemoUser
  /** Remuneração, custo/hora, horas de controle e aba de remuneração só quando true (normalmente: visitante = false). */
  showSensitive: boolean
  pageTitle: string
  footnote: ReactNode
  headerActions?: ReactNode
  /** Link estilo “Ver todos os projetos” — mesmo texto que em Meu perfil. */
  projectsListHref?: string
}

export function ProfileDashboard({
  profileUser,
  showSensitive,
  pageTitle,
  footnote,
  headerActions,
  projectsListHref = '/projects',
}: ProfileDashboardProps) {
  const theme = useTheme()
  const [tick, setTick] = useState(0)
  const [costTab, setCostTab] = useState<'cost' | 'hours'>('cost')
  const [deliveryTab, setDeliveryTab] = useState<'roadmap' | 'stories'>('stories')
  const [historyTab, setHistoryTab] = useState<'pay' | 'activity'>('pay')

  useEffect(() => {
    const bump = () => setTick((n) => n + 1)
    window.addEventListener('flow-app-users-changed', bump)
    window.addEventListener('flow-project-meta-changed', bump)
    return () => {
      window.removeEventListener('flow-app-users-changed', bump)
      window.removeEventListener('flow-project-meta-changed', bump)
    }
  }, [])

  const displayName = profileUser.name
  const initials = initialsFromDisplayName(displayName)
  const roleLabel = profileUser.role
  const titleLine = collaboratorTitle(roleLabel)
  const tags = profileTags(roleLabel)

  const projects = useMemo(() => {
    return getProjectIdsForUser(profileUser.id)
      .map((id) => resolveProjectById(id))
      .filter(Boolean) as NonNullable<ReturnType<typeof resolveProjectById>>[]
  }, [profileUser.id, tick])

  const projectStatus = ['blue', 'amber', 'green', 'blue'] as const
  const projectPct = [72, 45, 100, 38]

  const chartPrimary = theme.primary
  const tooltipStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    fontSize: 12,
    color: theme.text,
  }

  const activityHistoryData = PRODUCTIVITY.map((p, i) => ({ ...p, v: p.v + i * 5 }))

  return (
    <ProfileRoot>
      <PageHeader>
        <div>
          <PageTitle>{pageTitle}</PageTitle>
          <Footnote style={{ marginTop: '0.35rem', maxWidth: '42rem' }}>{footnote}</Footnote>
        </div>
        <PageActions>{headerActions}</PageActions>
      </PageHeader>

      <LayoutGrid>
        <AsideColumn>
          <ProfileHero>
            <Avatar aria-hidden>{initials}</Avatar>
            <ProfileName>{displayName}</ProfileName>
            <ProfileRole>
              {titleLine} · {roleLabel} · {profileUser.status === 'active' ? 'Ativo' : 'Inativo'}
            </ProfileRole>
            <ProfileEmail>{profileUser.email}</ProfileEmail>
            {profileUser.createdAt ? (
              <Footnote style={{ margin: '0.4rem 0 0' }}>
                Na organização desde {formatDisplayDate(profileUser.createdAt)}
              </Footnote>
            ) : null}
            <TagRow>
              {tags.map((t) => (
                <Tag key={t.label} $tone={t.tone}>
                  {t.label}
                </Tag>
              ))}
            </TagRow>
          </ProfileHero>

          {showSensitive ? (
            <ControlCard>
              <CardHead style={{ marginBottom: '0.65rem' }}>
                <CardTitle style={{ fontSize: '0.82rem' }}>Controle mensal</CardTitle>
              </CardHead>
              <TabRow>
                <TabBtn type="button" $active={costTab === 'cost'} onClick={() => setCostTab('cost')}>
                  Custo
                </TabBtn>
                <TabBtn type="button" $active={costTab === 'hours'} onClick={() => setCostTab('hours')}>
                  Horas
                </TabBtn>
              </TabRow>
              {costTab === 'cost' ? (
                <MetricList>
                  <div>
                    <MetricDt>Valor / hora</MetricDt>
                    <MetricDd>R$ 100,00</MetricDd>
                  </div>
                  <div>
                    <MetricDt>Remuneração estimada</MetricDt>
                    <MetricDd>R$ 10.000,00</MetricDd>
                  </div>
                  <div>
                    <MetricDt>Remuneração atual</MetricDt>
                    <MetricDdPositive>R$ 10.000,00</MetricDdPositive>
                  </div>
                </MetricList>
              ) : (
                <MetricList>
                  <div>
                    <MetricDt>Horas planejadas</MetricDt>
                    <MetricDd>160 h</MetricDd>
                  </div>
                  <div>
                    <MetricDt>Horas registradas</MetricDt>
                    <MetricDd>112 h</MetricDd>
                  </div>
                  <div>
                    <MetricDt>Saldo</MetricDt>
                    <MetricDd>-48 h</MetricDd>
                  </div>
                </MetricList>
              )}
              <ProgressWrap>
                <ProgressRing style={{ color: theme.text }}>
                  <ProgressRingSvg pct={70} color={chartPrimary} />
                </ProgressRing>
                <ProgressLabel>
                  <ProgressStrong>Progresso da meta</ProgressStrong>
                  Ilustrativo — alinhamento com timeline e alocações em evolução.
                </ProgressLabel>
              </ProgressWrap>
            </ControlCard>
          ) : null}
        </AsideColumn>

        <MainColumn>
          <Card>
            <CardHead>
              <CardTitle>Entregas</CardTitle>
              <CardLink>Ver mais</CardLink>
            </CardHead>
            <TabRow style={{ marginBottom: '0.75rem' }}>
              <TabBtn
                type="button"
                $active={deliveryTab === 'roadmap'}
                onClick={() => setDeliveryTab('roadmap')}
              >
                Roadmap
              </TabBtn>
              <TabBtn
                type="button"
                $active={deliveryTab === 'stories'}
                onClick={() => setDeliveryTab('stories')}
              >
                Stories
              </TabBtn>
            </TabRow>
            <DeliveryList>
              {(deliveryTab === 'stories' ? DELIVERIES : DELIVERIES.slice(0, 2)).map((d) => (
                <DeliveryItem key={d.code}>
                  <DeliveryCode>{d.code}</DeliveryCode>
                  <DeliveryMeta>
                    <DeliveryTitle>{d.title}</DeliveryTitle>
                    <DeliveryClient>{d.client}</DeliveryClient>
                  </DeliveryMeta>
                  <StatusChip
                    $variant={d.status === 'delay' ? 'danger' : d.status === 'warn' ? 'warn' : 'ok'}
                  >
                    {d.statusLabel}
                  </StatusChip>
                </DeliveryItem>
              ))}
            </DeliveryList>
          </Card>

          <WidgetGrid>
            <Card>
              <CardHead>
                <CardTitle>Produtividade</CardTitle>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.primary }}>
                  ↑ 26% vs. mês anterior
                </span>
              </CardHead>
              <ChartBox>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PRODUCTIVITY} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                    <XAxis dataKey="m" tick={{ fill: theme.chartAxis, fontSize: 11 }} axisLine={false} />
                    <YAxis tick={{ fill: theme.chartAxis, fontSize: 11 }} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke={chartPrimary}
                      strokeWidth={2}
                      dot={{ fill: chartPrimary, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartBox>
            </Card>

            <Card>
              <CardHead>
                <CardTitle>Daily status</CardTitle>
              </CardHead>
              <DailyGroups>
                {DAILY.map((g) => (
                  <div key={g.date}>
                    <DailyDate>{g.date}</DailyDate>
                    <DailyPills>
                      {g.items.map((x) => (
                        <DailyPill key={x}>{x}</DailyPill>
                      ))}
                    </DailyPills>
                  </div>
                ))}
              </DailyGroups>
            </Card>
          </WidgetGrid>

          <ActivityHeatmap year={new Date().getFullYear()} />

          <Card>
            <CardHead>
              <CardTitle>{showSensitive ? 'Históricos' : 'Ritmo de atividades'}</CardTitle>
              <CardLink>{showSensitive ? '2º semestre (ilustrativo)' : 'Visão pública (ilustrativo)'}</CardLink>
            </CardHead>
            {showSensitive ? (
              <>
                <TabRow style={{ marginBottom: '0.75rem' }}>
                  <TabBtn type="button" $active={historyTab === 'pay'} onClick={() => setHistoryTab('pay')}>
                    Remuneração
                  </TabBtn>
                  <TabBtn
                    type="button"
                    $active={historyTab === 'activity'}
                    onClick={() => setHistoryTab('activity')}
                  >
                    Atividades
                  </TabBtn>
                </TabRow>
                <ChartBox>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={historyTab === 'pay' ? REMUNERATION_BARS : activityHistoryData}
                      margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                      <XAxis dataKey="m" tick={{ fill: theme.chartAxis, fontSize: 11 }} axisLine={false} />
                      <YAxis tick={{ fill: theme.chartAxis, fontSize: 11 }} axisLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="v" fill={chartPrimary} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartBox>
              </>
            ) : (
              <>
                <Footnote style={{ marginBottom: '0.75rem' }}>
                  Valores financeiros e remuneração ficam disponíveis apenas em <strong>Meu perfil</strong>, para o
                  próprio usuário.
                </Footnote>
                <ChartBox>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityHistoryData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                      <XAxis dataKey="m" tick={{ fill: theme.chartAxis, fontSize: 11 }} axisLine={false} />
                      <YAxis tick={{ fill: theme.chartAxis, fontSize: 11 }} axisLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="v" fill={chartPrimary} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartBox>
              </>
            )}
          </Card>

          <Card>
            <CardHead>
              <CardTitle>Projetos relacionados</CardTitle>
              <GhostLink to={projectsListHref}>Ver todos</GhostLink>
            </CardHead>
            <ProjectMiniGrid>
              {projects.slice(0, 4).map((p, i) => (
                <ProjectMini key={p.id} to={`/projects/${p.id}`}>
                  <ProjectMiniName>{p.name}</ProjectMiniName>
                  <ProjectMiniStatus $variant={projectStatus[i % projectStatus.length]}>
                    {i % 3 === 0 ? 'Em andamento' : i % 3 === 1 ? 'Pausado' : 'Referência'}
                  </ProjectMiniStatus>
                  <Footnote style={{ margin: 0 }}>Horas de atuação (ilustrativo)</Footnote>
                  <ProjectMiniBar>
                    <ProjectMiniBarFill $pct={projectPct[i % projectPct.length]} />
                  </ProjectMiniBar>
                </ProjectMini>
              ))}
            </ProjectMiniGrid>
            {projects.length === 0 ? (
              <Footnote>Nenhum projeto associado neste exemplo.</Footnote>
            ) : null}
          </Card>
        </MainColumn>
      </LayoutGrid>
    </ProfileRoot>
  )
}
