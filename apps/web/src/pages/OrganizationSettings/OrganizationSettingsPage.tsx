import { useCallback, useEffect, useState } from 'react'
import { useAbility } from '@casl/react'
import { AbilityContext } from '../../contexts/AbilityContext'
import { useAuth } from '../../contexts/AuthContext'
import { recordAudit } from '../../persistence/auditLogStorage'
import {
  loadOrganizationSettings,
  saveOrganizationSettings,
  type OrganizationSettings,
} from '../../persistence/organizationSettingsStorage'
import {
  Actions,
  Card,
  Field,
  Input,
  Lead,
  Note,
  PageTitle,
  PrimaryBtn,
  Root,
  SavedFlash,
  Select,
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

export function OrganizationSettingsPage() {
  const { userEmail } = useAuth()
  const ability = useAbility(AbilityContext)
  const canRead = ability.can('read', 'Organization')
  const canUpdate = ability.can('update', 'Organization')

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

  if (!canRead) {
    return (
      <Root>
        <PageTitle>Organização</PageTitle>
        <Lead>Você não tem permissão para ver estas configurações.</Lead>
      </Root>
    )
  }

  return (
    <Root>
      <PageTitle>Configurações da organização</PageTitle>
      <Lead>
        Dados institucionais da tenant neste template (persistidos no navegador). Em produção, viriam da API e
        alimentariam marca, e-mails e políticas da conta.
      </Lead>

      {!canUpdate ? (
        <Note>
          Seu papel permite apenas <strong>visualizar</strong> estas informações. Usuários com permissão de
          edição podem alterar nome exibido, contato e preferências regionais.
        </Note>
      ) : null}

      <Card>
        <Field>
          Nome exibido
          <Input
            value={form.displayName}
            disabled={!canUpdate}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            aria-label="Nome exibido"
          />
        </Field>
        <Field>
          Razão social (opcional)
          <Input
            value={form.legalName}
            disabled={!canUpdate}
            onChange={(e) => setForm((f) => ({ ...f, legalName: e.target.value }))}
            aria-label="Razão social"
          />
        </Field>
        <Field>
          E-mail de suporte / contato
          <Input
            type="email"
            value={form.supportEmail}
            disabled={!canUpdate}
            onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
            placeholder="suporte@empresa.com"
            aria-label="E-mail de suporte"
          />
        </Field>
        <Field>
          Fuso horário de referência
          <Select
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
        </Field>
        <Field>
          Locale de datas
          <Select
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
        </Field>
        {canUpdate ? (
          <Actions>
            <PrimaryBtn type="button" onClick={save}>
              Salvar alterações
            </PrimaryBtn>
            {saved ? <SavedFlash>Salvo.</SavedFlash> : null}
          </Actions>
        ) : null}
      </Card>
    </Root>
  )
}
