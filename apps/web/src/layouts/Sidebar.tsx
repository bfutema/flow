import { useEffect, useState } from 'react'
import {
  HiBell,
  HiBuildingOffice2,
  HiCalendarDateRange,
  HiCalendarDays,
  HiChartBar,
  HiClipboardDocumentCheck,
  HiClipboardDocumentList,
  HiDocumentMagnifyingGlass,
  HiFolder,
  HiShieldCheck,
  HiSquares2X2,
  HiUserGroup,
  HiUsers,
  HiViewColumns,
} from 'react-icons/hi2'
import { FlowMark } from '../components/Brand'
import { BrandLabel, MarkWrap } from '../components/Brand/FlowLogo.styles'
import { Can } from '../contexts/AbilityContext'
import {
  Aside,
  Brand,
  Footer,
  FooterAccountRow,
  NavBadge,
  NavEllipsis,
  NavIcon,
  NavLabel,
  NavLabelRow,
  NavScroll,
  SidebarLink,
} from './Sidebar.styles'
import { useAuth } from '../contexts/AuthContext'
import { loadOrganizationSettings } from '../persistence/organizationSettingsStorage'
import {
  ensureNotificationsForUser,
  unreadCountForUser,
} from '../persistence/notificationCenterStorage'
import { SidebarAccountPopover } from './SidebarAccountPopover'

const navIc = { size: 18 as const, 'aria-hidden': true as const }

const iconDashboard = <HiSquares2X2 {...navIc} />
const iconRel = <HiChartBar {...navIc} />
const iconProjetos = <HiFolder {...navIc} />
const iconUsuarios = <HiUsers {...navIc} />
const iconAlocacoes = <HiCalendarDays {...navIc} />
const iconKanban = <HiViewColumns {...navIc} />
const iconDaily = <HiClipboardDocumentList {...navIc} />
const iconAbsences = <HiCalendarDateRange {...navIc} />
const iconApprovals = <HiClipboardDocumentCheck {...navIc} />
const iconTeams = <HiUserGroup {...navIc} />
const iconNotifs = <HiBell {...navIc} />
const iconOrg = <HiBuildingOffice2 {...navIc} />
const iconAudit = <HiDocumentMagnifyingGlass {...navIc} />
const iconAccess = <HiShieldCheck {...navIc} />
/* Organograma pausado — descomente HiShare em react-icons/hi2 e o <SidebarLink> abaixo.
const iconOrganogram = <HiShare {...navIc} />
*/

type Props = {
  collapsed: boolean
  /** Em telas estreitas: sidebar vira gaveta controlada por `mobileOpen`. */
  mobileDrawer?: boolean
  mobileOpen?: boolean
  onNavigate?: () => void
}

export function Sidebar({
  collapsed,
  mobileDrawer = false,
  mobileOpen = false,
  onNavigate,
}: Props) {
  const { userEmail } = useAuth()
  const [brandTitle, setBrandTitle] = useState(() => loadOrganizationSettings().displayName)
  const [notifUnread, setNotifUnread] = useState(0)
  useEffect(() => {
    const sync = () => setBrandTitle(loadOrganizationSettings().displayName)
    window.addEventListener('flow-organization-settings-changed', sync)
    return () => window.removeEventListener('flow-organization-settings-changed', sync)
  }, [])
  useEffect(() => {
    if (!userEmail) {
      setNotifUnread(0)
      return
    }
    ensureNotificationsForUser(userEmail)
    const sync = () => setNotifUnread(unreadCountForUser(userEmail))
    sync()
    window.addEventListener('flow-notifications-changed', sync)
    return () => window.removeEventListener('flow-notifications-changed', sync)
  }, [userEmail])

  const showLabels = mobileDrawer || !collapsed
  const closeIfDrawer = () => {
    if (mobileDrawer) onNavigate?.()
  }

  return (
    <Aside
      id={mobileDrawer ? 'admin-mobile-nav' : undefined}
      $collapsed={collapsed}
      $mobileDrawer={mobileDrawer}
      $mobileOpen={mobileOpen}
      aria-label="Menu principal"
      aria-hidden={mobileDrawer && !mobileOpen ? true : undefined}
    >
      <Brand
        $collapsed={collapsed}
        $mobileDrawer={mobileDrawer}
        aria-label={!showLabels ? brandTitle : undefined}
      >
        <MarkWrap>
          <FlowMark size={showLabels ? 28 : 24} />
        </MarkWrap>
        {showLabels ? <BrandLabel>{brandTitle}</BrandLabel> : null}
      </Brand>
      <NavScroll $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
        <Can I="read" a="Dashboard">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/"
            end
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconDashboard}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Dashboard
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="Project">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/projects"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconProjetos}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Projetos
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="User">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/users"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconUsuarios}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Usuários
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="Timeline">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/allocations"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconAlocacoes}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Timeline
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="TaskBoard">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/tasks"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconKanban}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Tarefas
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="DailyStatus">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/daily-status"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconDaily}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Status diário
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="Absence">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/people/absences"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconAbsences}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Férias e ausências
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="ApprovalQueue">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/people/approvals"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconApprovals}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Aprovações
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="Team">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/people/teams"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconTeams}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Equipes
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="NotificationCenter">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/notifications"
            onClick={closeIfDrawer}
            title={
              notifUnread > 0 ? `Avisos — ${notifUnread} não lidos` : 'Avisos'
            }
            aria-label={
              notifUnread > 0 ? `Avisos, ${notifUnread} não lidos` : 'Avisos'
            }
          >
            <NavIcon>{iconNotifs}</NavIcon>
            <NavLabelRow $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              <NavEllipsis>Avisos</NavEllipsis>
              {notifUnread > 0 ? <NavBadge>{notifUnread > 99 ? '99+' : notifUnread}</NavBadge> : null}
            </NavLabelRow>
          </SidebarLink>
        </Can>
        <Can I="read" a="Report">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/reports"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconRel}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Relatórios
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="Organization">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/settings/organization"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconOrg}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Organização
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="AuditLog">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/audit"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconAudit}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Auditoria
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="manage" a="Security">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/access-control"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconAccess}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Acesso
            </NavLabel>
          </SidebarLink>
        </Can>
        {/* Organograma: rota /organogram ainda existe; descomente ícone + link no topo do arquivo.
        <SidebarLink $collapsed={collapsed} to="/organogram">
          <NavIcon>{iconOrganogram}</NavIcon>
          <NavLabel $collapsed={collapsed}>Organograma</NavLabel>
        </SidebarLink>
        */}
      </NavScroll>
      <Footer>
        <FooterAccountRow>
          <SidebarAccountPopover
            collapsed={collapsed}
            mobileDrawer={mobileDrawer}
            onNavigate={onNavigate}
          />
        </FooterAccountRow>
      </Footer>
    </Aside>
  )
}
