import { useAbility } from '@casl/react'
import { HiCheck, HiArrowLeft } from 'react-icons/hi2'
import { AbilityContext } from '../../contexts/AbilityContext'
import {
  BackLink,
  FeatureItem,
  FeatureList,
  GhostBtn,
  Lead,
  MutedNote,
  PageRoot,
  PageTitle,
  PlanBadge,
  PlanCard,
  PlanDesc,
  PlanFooter,
  PlanFooterNote,
  PlanGrid,
  PlanName,
  PlanPeriod,
  PlanPrice,
  PlanPriceRow,
  PrimaryBtn,
} from './PlansPage.styles'

const ic = { size: 16 as const, 'aria-hidden': true as const }

type PlanTier = {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  current?: boolean
  cta: 'current' | 'upgrade' | 'contact'
}

const TIERS: PlanTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'R$ 0',
    period: '/mês',
    description: 'Explorar o template com dados locais e papéis de demonstração.',
    features: [
      'Até 5 usuários ilustrativos',
      'Projetos e timeline no navegador',
      'Centro de avisos e aprovações (demo)',
    ],
    cta: 'upgrade',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 'R$ 89',
    period: '/usuário · mês',
    description: 'Uso em equipe com governança e trilhas de auditoria quando conectado à API.',
    features: [
      'Usuários e papéis via backend',
      'Auditoria e notificações persistentes',
      'SSO e backup (via integrações)',
    ],
    current: true,
    cta: 'current',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Sob consulta',
    period: '',
    description: 'Multi-tenant, SLA, ambientes dedicados e customização de marca.',
    features: [
      'Domínio e marca white-label',
      'Retenção de dados e conformidade',
      'Suporte prioritário',
    ],
    cta: 'contact',
  },
]

export function PlansPage() {
  const ability = useAbility(AbilityContext)
  const canRead = ability.can('read', 'Subscription')
  const canUpdate = ability.can('update', 'Subscription')

  if (!canRead) {
    return (
      <PageRoot>
        <PageTitle>Planos</PageTitle>
        <Lead>Você não tem permissão para ver planos e uso desta organização.</Lead>
      </PageRoot>
    )
  }

  return (
    <PageRoot>
      <PageTitle>Planos</PageTitle>
      <Lead>
        Comparativo ilustrativo para white-label. Em produção, preços, limites e o plano ativo viriam da API de
        billing; botões podem abrir checkout, área do cliente ou contato com vendas.
      </Lead>

      <PlanGrid>
        {TIERS.map((tier) => (
          <PlanCard key={tier.id} $highlight={tier.current}>
            {tier.current ? <PlanBadge>Atual</PlanBadge> : null}
            <PlanName>{tier.name}</PlanName>
            <PlanPriceRow>
              <PlanPrice>{tier.price}</PlanPrice>
              {tier.period ? <PlanPeriod>{tier.period}</PlanPeriod> : null}
            </PlanPriceRow>
            <PlanDesc>{tier.description}</PlanDesc>
            <FeatureList>
              {tier.features.map((f) => (
                <FeatureItem key={f}>
                  <HiCheck {...ic} />
                  {f}
                </FeatureItem>
              ))}
            </FeatureList>
            <PlanFooter>
              {tier.cta === 'current' ? (
                <GhostBtn type="button" disabled>
                  Plano atual
                </GhostBtn>
              ) : null}
              {tier.cta === 'upgrade' && canUpdate ? (
                <PrimaryBtn type="button">Fazer upgrade</PrimaryBtn>
              ) : null}
              {tier.cta === 'upgrade' && !canUpdate ? (
                <PlanFooterNote>Somente administradores podem alterar o plano.</PlanFooterNote>
              ) : null}
              {tier.cta === 'contact' ? (
                <PrimaryBtn type="button">Falar com vendas</PrimaryBtn>
              ) : null}
            </PlanFooter>
          </PlanCard>
        ))}
      </PlanGrid>

      <MutedNote>
        Limites e faturas reais substituem este comparativo quando a API de billing estiver disponível.
      </MutedNote>

      <BackLink to="/settings/organization">
        <HiArrowLeft size={18} aria-hidden />
        Voltar para configurações da organização
      </BackLink>
    </PageRoot>
  )
}
