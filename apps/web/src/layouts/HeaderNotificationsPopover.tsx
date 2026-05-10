import { useAbility } from '@casl/react'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { HiBell, HiEye } from 'react-icons/hi2'
import { AbilityContext } from '../contexts/AbilityContext'
import { useAuth } from '../contexts/AuthContext'
import { getUserByEmail } from '../data/directoryUsers'
import type { NotificationCategory, NotificationPriority } from '../persistence/notificationCenterStorage'
import {
  ensureNotificationsForUser,
  listNotificationsForUser,
  markAllRead,
  markRead,
  notificationCategoryOf,
  notificationPriorityOf,
  unreadCountForUser,
} from '../persistence/notificationCenterStorage'
import { IconButton } from './Header.styles'
import {
  EmptyBell,
  EmptyState,
  FilterSelect,
  FooterLink,
  InlineRouterLink,
  NotifBackdrop,
  NotifItemBody,
  NotifItemTitle,
  NotifMain,
  NotifMeta,
  NotifPanel,
  NotifRow,
  PanelFilters,
  PanelFooter,
  PanelHeader,
  PanelScroll,
  PanelTitle,
  PanelTitleRow,
  ReadDotSpacer,
  RowGhostBtn,
  TextLinkButton,
  TriggerBadge,
  TriggerWrap,
  IconLinkButton,
  UnreadDot,
} from './HeaderNotificationsPopover.styles'

const GAP = 8
const VIEW_MARGIN = 10

const CATEGORY_OPTIONS: { value: 'all' | NotificationCategory; label: string }[] = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'prazo', label: 'Prazos' },
  { value: 'digest', label: 'Digest' },
  { value: 'pessoa', label: 'Pessoas' },
  { value: 'sistema', label: 'Sistema' },
  { value: 'geral', label: 'Geral' },
]

const PRIORITY_OPTIONS: { value: 'all' | NotificationPriority; label: string }[] = [
  { value: 'all', label: 'Todas as prioridades' },
  { value: 'high', label: 'Alta' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Baixa' },
]

type PopoverPos = { top: number; left: number }

export function HeaderNotificationsPopover() {
  const menuId = useId()
  const { userEmail } = useAuth()
  const ability = useAbility(AbilityContext)
  const viewer = userEmail ? getUserByEmail(userEmail) : undefined
  const viewerId = viewer?.id

  const canUpdate = ability.can('update', 'NotificationCenter')

  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<PopoverPos | null>(null)
  const [tick, setTick] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState<'all' | NotificationCategory>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | NotificationPriority>('all')
  /** Evita que o mouseup/clique do mesmo gesto que abre caia no backdrop e feche na hora. */
  const [backdropArmed, setBackdropArmed] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const b = () => setTick((n) => n + 1)
    window.addEventListener('flow-notifications-changed', b)
    return () => window.removeEventListener('flow-notifications-changed', b)
  }, [])

  useEffect(() => {
    if (viewerId) ensureNotificationsForUser(viewerId)
  }, [viewerId])

  useEffect(() => {
    if (!open) {
      setBackdropArmed(false)
      return
    }
    const t = window.setTimeout(() => setBackdropArmed(true), 0)
    return () => window.clearTimeout(t)
  }, [open])

  const items = useMemo(
    () => (viewerId ? listNotificationsForUser(viewerId) : []),
    [viewerId, tick],
  )

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const c = notificationCategoryOf(n)
      const p = notificationPriorityOf(n)
      if (categoryFilter !== 'all' && c !== categoryFilter) return false
      if (priorityFilter !== 'all' && p !== priorityFilter) return false
      return true
    })
  }, [items, categoryFilter, priorityFilter])

  const unread = viewerId ? unreadCountForUser(viewerId) : 0

  const layoutPopover = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) return

    const br = btn.getBoundingClientRect()
    const panel = panelRef.current
    /** Primeira pintura: painel ainda não existe no ciclo `open && pos` antigo — usar fallback. */
    const pw =
      panel && panel.offsetWidth > 0 ? panel.offsetWidth : Math.min(352, window.innerWidth - 24)
    const ph =
      panel && panel.offsetHeight > 0 ? panel.offsetHeight : Math.min(400, window.innerHeight - 48)

    let left = br.right - pw
    left = Math.max(VIEW_MARGIN, Math.min(left, window.innerWidth - pw - VIEW_MARGIN))

    let top = br.bottom + GAP
    if (top + ph > window.innerHeight - VIEW_MARGIN) {
      top = br.top - ph - GAP
    }
    top = Math.max(VIEW_MARGIN, Math.min(top, window.innerHeight - ph - VIEW_MARGIN))

    setPos({ top, left })
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    layoutPopover()
    let raf0 = 0
    let raf1 = 0
    raf0 = requestAnimationFrame(() => {
      layoutPopover()
      raf1 = requestAnimationFrame(layoutPopover)
    })
    const onResize = () => layoutPopover()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      cancelAnimationFrame(raf0)
      cancelAnimationFrame(raf1)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open, layoutPopover, tick, filtered.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const t = e.target as Node
      if (buttonRef.current?.contains(t) || panelRef.current?.contains(t)) return
      close()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open, close])

  const handleMarkAll = () => {
    if (!viewerId || !canUpdate) return
    markAllRead(viewerId)
  }

  if (!viewerId) {
    return null
  }

  const portal =
    open &&
    createPortal(
      <>
        <NotifBackdrop
          aria-label="Fechar notificações"
          onClick={close}
          style={{ pointerEvents: backdropArmed ? 'auto' : 'none' }}
        />
        <NotifPanel
          ref={panelRef}
          id={menuId}
          role="dialog"
          aria-label="Notificações"
          style={{
            top: pos?.top ?? VIEW_MARGIN,
            left: pos?.left ?? VIEW_MARGIN,
            opacity: pos ? 1 : 0,
            pointerEvents: pos ? 'auto' : ('none' as const),
          }}
        >
          <PanelHeader>
            <PanelTitleRow>
              <PanelTitle>Notificações</PanelTitle>
              <IconLinkButton
                to="/notifications"
                title="Ver centro completo"
                aria-label="Ver centro completo de avisos"
                onClick={close}
              >
                <HiEye aria-hidden />
              </IconLinkButton>
            </PanelTitleRow>
            <TextLinkButton onClick={handleMarkAll} disabled={!canUpdate || unread === 0}>
              Marcar todas como lidas
            </TextLinkButton>
          </PanelHeader>
          <PanelFilters>
            <FilterSelect
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as 'all' | NotificationCategory)
              }
              aria-label="Filtrar por categoria"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as 'all' | NotificationPriority)
              }
              aria-label="Filtrar por prioridade"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </FilterSelect>
          </PanelFilters>
          <PanelScroll>
            {filtered.length === 0 ? (
              <EmptyState>
                <EmptyBell aria-hidden>
                  <HiBell />
                </EmptyBell>
                Nenhuma notificação encontrada
              </EmptyState>
            ) : (
              filtered.map((n) => (
                <NotifRow key={n.id} $unread={!n.read}>
                  {!n.read ? <UnreadDot aria-hidden /> : <ReadDotSpacer aria-hidden />}
                  <NotifMain>
                    <NotifItemTitle $unread={!n.read}>{n.title}</NotifItemTitle>
                    <NotifItemBody>{n.body}</NotifItemBody>
                    <NotifMeta>
                      {new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      }).format(new Date(n.createdAt))}
                      {n.href ? (
                        <>
                          {' · '}
                          <InlineRouterLink to={n.href} onClick={close}>
                            Abrir
                          </InlineRouterLink>
                        </>
                      ) : null}
                    </NotifMeta>
                  </NotifMain>
                  {canUpdate && !n.read ? (
                    <RowGhostBtn type="button" onClick={() => markRead(viewerId, n.id)}>
                      Lida
                    </RowGhostBtn>
                  ) : null}
                </NotifRow>
              ))
            )}
          </PanelScroll>
          <PanelFooter>
            <FooterLink to="/notifications" onClick={close}>
              Abrir centro de avisos
            </FooterLink>
          </PanelFooter>
        </NotifPanel>
      </>,
      document.body,
    )

  return (
    <>
      <TriggerWrap>
        <IconButton
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={unread > 0 ? `Notificações, ${unread} não lidas` : 'Notificações'}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls={menuId}
        >
          <HiBell style={{ width: '1.15rem', height: '1.15rem' }} aria-hidden />
        </IconButton>
        {unread > 0 ? (
          <TriggerBadge aria-hidden>{unread > 99 ? '99+' : unread}</TriggerBadge>
        ) : null}
      </TriggerWrap>
      {portal}
    </>
  )
}
