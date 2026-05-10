import { useMemo } from 'react'
import { useAbility } from '@casl/react'
import { AbilityContext } from '../../contexts/AbilityContext'
import { useAuth } from '../../contexts/AuthContext'
import { getUserByEmail } from '../../data/directoryUsers'
import type { DemoUser } from '../../data/demoUsers'
import { displayNameFromEmail } from '../../utils/userDisplay'
import { GhostLink } from './MyProfilePage.styles'
import { ProfileDashboard } from './ProfileDashboard'

function minimalSelfUser(email: string): DemoUser {
  return {
    id: '__session__',
    name: displayNameFromEmail(email),
    email,
    role: 'Colaborador(a)',
    status: 'active',
    createdAt: '',
  }
}

export function MyProfilePage() {
  const { userEmail } = useAuth()
  const ability = useAbility(AbilityContext)

  const dirUser = useMemo(
    () => (userEmail ? getUserByEmail(userEmail) : undefined),
    [userEmail],
  )

  const profileUser = useMemo((): DemoUser | null => {
    if (!userEmail) return null
    return dirUser ?? minimalSelfUser(userEmail)
  }, [dirUser, userEmail])

  const canOpenDirectoryProfile =
    Boolean(dirUser) && ability.can('read', 'User')

  if (!profileUser) {
    return null
  }

  return (
    <ProfileDashboard
      profileUser={profileUser}
      showSensitive
      pageTitle="Meu perfil"
      footnote={
        <>
          Visão consolidada inspirada no seu dia a dia: entregas, ritmo e projetos. Os gráficos e métricas
          abaixo são <strong>ilustrativos</strong> até existir API — dados reais de ponto, custo e alocação
          poderão substituir esta camada depois.
        </>
      }
      headerActions={
        canOpenDirectoryProfile && dirUser ? (
          <GhostLink to={`/users/${dirUser.id}`}>Abrir perfil no diretório</GhostLink>
        ) : null
      }
    />
  )
}
