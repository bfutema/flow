import { useCallback, useEffect, useId, useState, type ReactNode } from 'react'
import { useAbility } from '@casl/react'
import {
  HiBell,
  HiCheck,
  HiCircleStack,
  HiCog6Tooth,
  HiGlobeAlt,
  HiLanguage,
  HiShieldCheck,
} from 'react-icons/hi2'
import { AbilityContext } from '../../contexts/AbilityContext'
import { useAuth } from '../../contexts/AuthContext'
import { useConfirmDialog } from '../../contexts/ConfirmDialogContext'
import { recordAudit } from '../../persistence/auditLogStorage'
import {
  DEFAULT_ORGANIZATION_SETTINGS,
  loadOrganizationSettings,
  resetOrganizationSettings,
  saveOrganizationSettings,
  type OrganizationSettings,
} from '../../persistence/organizationSettingsStorage'
import {
  Checkbox,
  ContentCard,
  FieldBlock,
  FieldLabel,
  FooterActions,
  FooterBar,
  Input,
  Note,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PrimaryBtn,
  SavedFlash,
  SectionDesc,
  SectionHeader,
  SectionIconWrap,
  SectionIconWrapMuted,
  SectionTitle,
  SectionTitles,
  SecondaryBtn,
  Select,
  Shell,
  Tab,
  TabList,
  ToggleDesc,
  ToggleRow,
  ToggleText,
  ToggleTitle,
} from './OrganizationSettingsPage.styles'

const TIMEZONES = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Fortaleza',
  'UTC',
  'America/New_York',
  'Europe/Lisbon',
  'Europe/London',
]

type SettingsTab = 'general' | 'system' | 'region' | 'notifications' | 'backup' | 'security'

const TABS: { id: SettingsTab; label: string; icon: ReactNode }[] = [
  { id: 'general', label: 'Geral', icon: <HiGlobeAlt aria-hidden /> },
  { id: 'system', label: 'Sistema', icon: <HiCog6Tooth aria-hidden /> },
  { id: 'region', label: 'Região', icon: <HiLanguage aria-hidden /> },
  { id: 'notifications', label: 'Notificações', icon: <HiBell aria-hidden /> },
  { id: 'backup', label: 'Backup', icon: <HiCircleStack aria-hidden /> },
  { id: 'security', label: 'Segurança', icon: <HiShieldCheck aria-hidden /> },
]

function tabIcon(id: SettingsTab): ReactNode {
  return TABS.find((t) => t.id === id)?.icon ?? null
}

export function OrganizationSettingsPage() {
  const baseId = useId()
  const { userEmail } = useAuth()
  const ability = useAbility(AbilityContext)
  const { confirm } = useConfirmDialog()
  const canRead = ability.can('read', 'Organization')
  const canUpdate = ability.can('update', 'Organization')

  const [tab, setTab] = useState<SettingsTab>('general')
  const [form, setForm] = useState<OrganizationSettings>(() => loadOrganizationSettings())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const sync = () => setForm(loadOrganizationSettings())
    window.addEventListener('flow-organization-settings-changed', sync)
    return () => window.removeEventListener('flow-organization-settings-changed', sync)
  }, [])

  const save = useCallback(() => {
    if (!canUpdate) return
    saveOrganizationSettings(form)
    recordAudit({
      actorEmail: userEmail,
      verb: 'organization.updated',
      resource: 'Organization',
      summary: `Dados institucionais atualizados (nome exibido: "${form.displayName.slice(0, 60)}").`,
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }, [canUpdate, form, userEmail])

  const restoreDefaults = useCallback(async () => {
    if (!canUpdate) return
    const ok = await confirm({
      title: 'Restaurar padrões',
      message:
        'Isso redefine todas as abas (geral, sistema, região, notificações, backup e segurança) para os valores iniciais do template. Deseja continuar?',
      confirmLabel: 'Restaurar',
      cancelLabel: 'Cancelar',
    })
    if (!ok) return
    resetOrganizationSettings()
    setForm({ ...DEFAULT_ORGANIZATION_SETTINGS })
    recordAudit({
      actorEmail: userEmail,
      verb: 'organization.reset',
      resource: 'Organization',
      summary: 'Configurações da organização restauradas aos padrões.',
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }, [canUpdate, confirm, userEmail])

  if (!canRead) {
    return (
      <Shell>
        <PageHeader>
          <PageTitle>Organização</PageTitle>
          <PageSubtitle>Você não tem permissão para ver estas configurações.</PageSubtitle>
        </PageHeader>
      </Shell>
    )
  }

  return (
    <Shell>
      <PageHeader>
        <PageTitle>Configurações da organização</PageTitle>
        <PageSubtitle>
          Gerencie identidade, parâmetros de sistema, região, notificações, backup e segurança. Os dados são
          persistidos localmente; em produção, sincronize com a API da conta.
        </PageSubtitle>
      </PageHeader>

      {!canUpdate ? (
        <Note>
          Seu papel permite apenas <strong>visualizar</strong> estas informações. Usuários com permissão de edição
          podem alterar os campos e salvar.
        </Note>
      ) : null}

      <TabList role="tablist" aria-label="Seções de configuração">
        {TABS.map((t) => (
          <Tab
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            $active={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            {t.label}
          </Tab>
        ))}
      </TabList>

      {tab === 'general' ? (
        <ContentCard aria-labelledby={`${baseId}-general-h`}>
          <SectionHeader>
            <SectionIconWrap aria-hidden>{tabIcon('general')}</SectionIconWrap>
            <SectionTitles>
              <SectionTitle id={`${baseId}-general-h`}>Informações gerais</SectionTitle>
              <SectionDesc>Nome institucional e canais de contato exibidos na aplicação.</SectionDesc>
            </SectionTitles>
          </SectionHeader>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-display`}>Nome exibido</FieldLabel>
            <Input
              id={`${baseId}-display`}
              value={form.displayName}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              aria-label="Nome exibido"
            />
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-legal`}>Razão social (opcional)</FieldLabel>
            <Input
              id={`${baseId}-legal`}
              value={form.legalName}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, legalName: e.target.value }))}
              aria-label="Razão social"
            />
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-email`}>E-mail de suporte / contato</FieldLabel>
            <Input
              id={`${baseId}-email`}
              type="email"
              value={form.supportEmail}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
              placeholder="suporte@empresa.com"
              aria-label="E-mail de suporte"
            />
          </FieldBlock>
        </ContentCard>
      ) : null}

      {tab === 'system' ? (
        <ContentCard aria-labelledby={`${baseId}-system-h`}>
          <SectionHeader>
            <SectionIconWrap aria-hidden>{tabIcon('system')}</SectionIconWrap>
            <SectionTitles>
              <SectionTitle id={`${baseId}-system-h`}>Parâmetros de sistema</SectionTitle>
              <SectionDesc>
                Valores ilustrativos para sessão e política de senha. Em produção, o servidor aplica as regras reais
                de autenticação.
              </SectionDesc>
            </SectionTitles>
          </SectionHeader>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-session`}>Timeout de sessão (minutos)</FieldLabel>
            <Input
              id={`${baseId}-session`}
              type="number"
              min={5}
              max={480}
              value={form.sessionTimeoutMinutes}
              disabled={!canUpdate}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  sessionTimeoutMinutes: Number.parseInt(e.target.value, 10) || f.sessionTimeoutMinutes,
                }))
              }
              aria-label="Timeout de sessão em minutos"
            />
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-attempts`}>Tentativas máximas de login</FieldLabel>
            <Input
              id={`${baseId}-attempts`}
              type="number"
              min={1}
              max={20}
              value={form.maxLoginAttempts}
              disabled={!canUpdate}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  maxLoginAttempts: Number.parseInt(e.target.value, 10) || f.maxLoginAttempts,
                }))
              }
              aria-label="Tentativas máximas de login"
            />
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-minpw`}>Tamanho mínimo da senha</FieldLabel>
            <Input
              id={`${baseId}-minpw`}
              type="number"
              min={6}
              max={32}
              value={form.minPasswordLength}
              disabled={!canUpdate}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  minPasswordLength: Number.parseInt(e.target.value, 10) || f.minPasswordLength,
                }))
              }
              aria-label="Tamanho mínimo da senha"
            />
          </FieldBlock>
          <ToggleRow $disabled={!canUpdate}>
            <ToggleText>
              <ToggleTitle>Senha forte obrigatória</ToggleTitle>
              <ToggleDesc>Exige caracteres especiais, números e letras maiúsculas (referência de política).</ToggleDesc>
            </ToggleText>
            <Checkbox
              type="checkbox"
              checked={form.requireStrongPassword}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, requireStrongPassword: e.target.checked }))}
            />
          </ToggleRow>
          <ToggleRow $disabled={!canUpdate}>
            <ToggleText>
              <ToggleTitle>Autenticação de dois fatores</ToggleTitle>
              <ToggleDesc>Requer segundo fator no login — depende de provedor e API.</ToggleDesc>
            </ToggleText>
            <Checkbox
              type="checkbox"
              checked={form.mfaEnabled}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, mfaEnabled: e.target.checked }))}
            />
          </ToggleRow>
        </ContentCard>
      ) : null}

      {tab === 'region' ? (
        <ContentCard aria-labelledby={`${baseId}-region-h`}>
          <SectionHeader>
            <SectionIconWrapMuted aria-hidden>{tabIcon('region')}</SectionIconWrapMuted>
            <SectionTitles>
              <SectionTitle id={`${baseId}-region-h`}>Região e formato</SectionTitle>
              <SectionDesc>Fuso horário e idioma para datas e textos da interface.</SectionDesc>
            </SectionTitles>
          </SectionHeader>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-tz`}>Fuso horário de referência</FieldLabel>
            <Select
              id={`${baseId}-tz`}
              value={form.defaultTimezone}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, defaultTimezone: e.target.value }))}
              aria-label="Fuso horário"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Select>
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-locale`}>Locale de datas</FieldLabel>
            <Select
              id={`${baseId}-locale`}
              value={form.dateLocale}
              disabled={!canUpdate}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  dateLocale: e.target.value === 'en-US' ? 'en-US' : 'pt-BR',
                }))
              }
              aria-label="Locale de datas"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
            </Select>
          </FieldBlock>
        </ContentCard>
      ) : null}

      {tab === 'notifications' ? (
        <ContentCard aria-labelledby={`${baseId}-notif-h`}>
          <SectionHeader>
            <SectionIconWrap aria-hidden>{tabIcon('notifications')}</SectionIconWrap>
            <SectionTitles>
              <SectionTitle id={`${baseId}-notif-h`}>Preferências de notificações</SectionTitle>
              <SectionDesc>
                Opções ilustrativas para o centro de avisos e lembretes locais. Integrações reais de e-mail e push
                viriam da API.
              </SectionDesc>
            </SectionTitles>
          </SectionHeader>
          <ToggleRow $disabled={!canUpdate}>
            <ToggleText>
              <ToggleTitle>Lembretes de prazo na interface</ToggleTitle>
              <ToggleDesc>Exibir avisos locais sobre marcos e entregas próximas.</ToggleDesc>
            </ToggleText>
            <Checkbox
              type="checkbox"
              checked={form.notifyDeadlineInApp}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, notifyDeadlineInApp: e.target.checked }))}
            />
          </ToggleRow>
          <ToggleRow $disabled={!canUpdate}>
            <ToggleText>
              <ToggleTitle>Pendências na fila de aprovações</ToggleTitle>
              <ToggleDesc>Destacar quando houver itens aguardando decisão em Operação e pessoas.</ToggleDesc>
            </ToggleText>
            <Checkbox
              type="checkbox"
              checked={form.notifyApprovalPending}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, notifyApprovalPending: e.target.checked }))}
            />
          </ToggleRow>
        </ContentCard>
      ) : null}

      {tab === 'backup' ? (
        <ContentCard aria-labelledby={`${baseId}-backup-h`}>
          <SectionHeader>
            <SectionIconWrap aria-hidden>{tabIcon('backup')}</SectionIconWrap>
            <SectionTitles>
              <SectionTitle id={`${baseId}-backup-h`}>Configurações de backup</SectionTitle>
              <SectionDesc>
                Preferências ilustrativas. Em produção, agendamento e retenção seriam serviços no backend ou na
                nuvem do cliente.
              </SectionDesc>
            </SectionTitles>
          </SectionHeader>
          <ToggleRow $disabled={!canUpdate}>
            <ToggleText>
              <ToggleTitle>Backup automático</ToggleTitle>
              <ToggleDesc>Simular preferência de cópias periódicas da configuração e dados da tenant.</ToggleDesc>
            </ToggleText>
            <Checkbox
              type="checkbox"
              checked={form.backupAutomatic}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, backupAutomatic: e.target.checked }))}
            />
          </ToggleRow>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-backup-freq`}>Frequência de backup</FieldLabel>
            <Select
              id={`${baseId}-backup-freq`}
              value={form.backupFrequency}
              disabled={!canUpdate}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  backupFrequency:
                    e.target.value === 'weekly' || e.target.value === 'monthly'
                      ? e.target.value
                      : 'daily',
                }))
              }
              aria-label="Frequência de backup"
            >
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </Select>
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-backup-time`}>Horário do backup</FieldLabel>
            <Input
              id={`${baseId}-backup-time`}
              type="time"
              value={form.backupTime}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, backupTime: e.target.value }))}
              aria-label="Horário do backup"
            />
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor={`${baseId}-backup-ret`}>Retenção de backups (dias)</FieldLabel>
            <Input
              id={`${baseId}-backup-ret`}
              type="number"
              min={1}
              max={365}
              value={form.backupRetentionDays}
              disabled={!canUpdate}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  backupRetentionDays: Number.parseInt(e.target.value, 10) || f.backupRetentionDays,
                }))
              }
              aria-label="Retenção de backups em dias"
            />
          </FieldBlock>
          <ToggleRow $disabled={!canUpdate}>
            <ToggleText>
              <ToggleTitle>Backup na nuvem</ToggleTitle>
              <ToggleDesc>Enviar cópias para armazenamento externo configurado na integração.</ToggleDesc>
            </ToggleText>
            <Checkbox
              type="checkbox"
              checked={form.backupCloud}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, backupCloud: e.target.checked }))}
            />
          </ToggleRow>
        </ContentCard>
      ) : null}

      {tab === 'security' ? (
        <ContentCard aria-labelledby={`${baseId}-sec-h`}>
          <SectionHeader>
            <SectionIconWrapMuted aria-hidden>{tabIcon('security')}</SectionIconWrapMuted>
            <SectionTitles>
              <SectionTitle id={`${baseId}-sec-h`}>Políticas e auditoria</SectionTitle>
              <SectionDesc>
                Controles de referência para conformidade. A aplicação demo grava auditoria localmente quando
                habilitado.
              </SectionDesc>
            </SectionTitles>
          </SectionHeader>
          <ToggleRow $disabled={!canUpdate}>
            <ToggleText>
              <ToggleTitle>Registrar ações na auditoria</ToggleTitle>
              <ToggleDesc>
                Manter histórico de eventos relevantes (login, alterações de organização, etc.) no navegador.
              </ToggleDesc>
            </ToggleText>
            <Checkbox
              type="checkbox"
              checked={form.auditRecordActions}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, auditRecordActions: e.target.checked }))}
            />
          </ToggleRow>
          <ToggleRow $disabled={!canUpdate}>
            <ToggleText>
              <ToggleTitle>Verificação de e-mail obrigatória</ToggleTitle>
              <ToggleDesc>
                Quando ativo, a UI pode exigir confirmação de e-mail para novos usuários — requer backend e fluxo
                de convite.
              </ToggleDesc>
            </ToggleText>
            <Checkbox
              type="checkbox"
              checked={form.requireEmailVerified}
              disabled={!canUpdate}
              onChange={(e) => setForm((f) => ({ ...f, requireEmailVerified: e.target.checked }))}
            />
          </ToggleRow>
        </ContentCard>
      ) : null}

      {canUpdate ? (
        <FooterBar>
          <div>{saved ? <SavedFlash>Salvo.</SavedFlash> : null}</div>
          <FooterActions>
            <SecondaryBtn type="button" onClick={restoreDefaults}>
              Restaurar padrões
            </SecondaryBtn>
            <PrimaryBtn type="button" onClick={save}>
              <HiCheck aria-hidden />
              Salvar configurações
            </PrimaryBtn>
          </FooterActions>
        </FooterBar>
      ) : null}
    </Shell>
  )
}
