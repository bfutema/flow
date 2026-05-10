import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Can } from '../contexts/AbilityContext'
import { useAuth } from '../contexts/AuthContext'
import { getUserById } from '../data/directoryUsers'
import { GhostLink } from './MyProfile/MyProfilePage.styles'
import { ProfileDashboard } from './MyProfile/ProfileDashboard'

function emailsMatch(a: string | null | undefined, b: string): boolean {
  if (!a) return false
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function UserProfile() {
  const { userId } = useParams<{ userId: string }>()
  const { userEmail } = useAuth()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const bump = () => setTick((n) => n + 1)
    window.addEventListener('flow-app-users-changed', bump)
    return () => window.removeEventListener('flow-app-users-changed', bump)
  }, [])

  const user = useMemo(
    () => (userId ? getUserById(userId) : undefined),
    [userId, tick],
  )

  if (!userId) {
    return <Navigate to="/users" replace />
  }

  if (!user) {
    return <Navigate to="/users" replace />
  }

  const showSensitive = emailsMatch(userEmail, user.email)

  return (
    <ProfileDashboard
      profileUser={user}
      showSensitive={showSensitive}
      pageTitle={showSensitive ? 'Meu perfil (diretório)' : user.name}
      footnote={
        showSensitive ? (
          <>
            Você está vendo o mesmo layout do seu <strong>Meu perfil</strong>, incluindo dados sensíveis,
            porque este cadastro é o seu usuário logado.
          </>
        ) : (
          <>
            Perfil de <strong>{user.name}</strong> — visão inspirada em redes sociais profissionais.
            Remuneração, custos e metas pessoais aparecem apenas para o próprio usuário em{' '}
            <GhostLink to="/profile">Meu perfil</GhostLink>.
          </>
        )
      }
      headerActions={
        <>
          <GhostLink to="/users">← Usuários</GhostLink>
          <GhostLink to="/profile">Meu perfil</GhostLink>
          <Can I="update" a="User">
            <GhostLink to={`/users/${user.id}/edit`}>Editar cadastro</GhostLink>
          </Can>
        </>
      }
    />
  )
}
