import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAbility } from '@casl/react'
import { AbilityContext } from '../../contexts/AbilityContext'
import { useAuth } from '../../contexts/AuthContext'
import { getUserByEmail } from '../../data/directoryUsers'
import {
  appendDigestDemo,
  ensureNotificationsForUser,
  listNotificationsForUser,
  markAllRead,
  markRead,
} from '../../persistence/notificationCenterStorage'
import {
  Card,
  CardTitle,
  GhostBtn,
  Lead,
  PageRoot,
  PageTitle,
  PrimaryBtn,
  Toolbar,
} from './peopleOpsShared.styles'
import {
  NotifBody,
  NotifItem,
  NotifList,
  NotifMeta,
  NotifTitle,
  UnreadDot,
} from './NotificationsPage.styles'

export function NotificationsPage() {
  const { userEmail } = useAuth()
  const ability = useAbility(AbilityContext)
  const viewer = userEmail ? getUserByEmail(userEmail) : undefined

  const canRead = ability.can('read', 'NotificationCenter')
  const canUpdate = ability.can('update', 'NotificationCenter')

  const [tick, setTick] = useState(0)

  useEffect(() => {
    const b = () => setTick((n) => n + 1)
    window.addEventListener('flow-notifications-changed', b)
    return () => window.removeEventListener('flow-notifications-changed', b)
  }, [])

  useEffect(() => {
    if (viewer?.id) ensureNotificationsForUser(viewer.id)
  }, [viewer?.id])

  const items = useMemo(() => (viewer ? listNotificationsForUser(viewer.id) : []), [viewer, tick])

  if (!canRead || !viewer) {
    return (
      <PageRoot>
        <PageTitle>Avisos</PageTitle>
        <Lead>
          {!viewer
            ? 'Cadastro não encontrado no diretório — não há caixa de avisos para este login.'
            : 'Sem permissão para ver notificações.'}
        </Lead>
      </PageRoot>
    )
  }

  return (
    <PageRoot>
      <PageTitle>Centro de avisos</PageTitle>
      <Lead>
        MVP local: lembretes e digest simulados. Em produção, substitua por push/e-mail e WS alimentados pela
        API.
      </Lead>

      <Toolbar>
        {canUpdate ? (
          <>
            <GhostBtn type="button" onClick={() => markAllRead(viewer.id)}>
              Marcar todas como lidas
            </GhostBtn>
            <PrimaryBtn type="button" onClick={() => appendDigestDemo(viewer.id)}>
              Simular digest
            </PrimaryBtn>
          </>
        ) : null}
      </Toolbar>

      <Card>
        <CardTitle>Sua caixa</CardTitle>
        <NotifList>
          {items.length === 0 ? (
            <Lead style={{ margin: 0 }}>Nenhum aviso.</Lead>
          ) : (
            items.map((n) => (
              <NotifItem key={n.id} $unread={!n.read}>
                {!n.read ? <UnreadDot aria-hidden /> : null}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <NotifTitle $unread={!n.read}>{n.title}</NotifTitle>
                  <NotifBody>{n.body}</NotifBody>
                  <NotifMeta>
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }).format(new Date(n.createdAt))}
                    {n.href ? (
                      <>
                        {' · '}
                        <Link to={n.href}>Abrir</Link>
                      </>
                    ) : null}
                  </NotifMeta>
                </div>
                {canUpdate && !n.read ? (
                  <GhostBtn type="button" onClick={() => markRead(viewer.id, n.id)}>
                    Lida
                  </GhostBtn>
                ) : null}
              </NotifItem>
            ))
          )}
        </NotifList>
      </Card>
    </PageRoot>
  )
}
