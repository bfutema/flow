import { useCallback, useState, type ReactNode } from 'react'
import { HiChevronDown } from 'react-icons/hi2'
import {
  GroupBody,
  GroupChevron,
  GroupHeaderBtn,
  GroupTitle,
  GroupWrap,
} from './SidebarNavGroup.styles'

const PREFIX = 'flow-sidebar-group-'

function readOpen(key: string, defaultOpen: boolean): boolean {
  try {
    const v = localStorage.getItem(PREFIX + key)
    if (v === '0') return false
    if (v === '1') return true
  } catch {
    /* ignore */
  }
  return defaultOpen
}

function persistOpen(key: string, open: boolean): void {
  try {
    localStorage.setItem(PREFIX + key, open ? '1' : '0')
  } catch {
    /* ignore */
  }
}

type Props = {
  title: string
  storageKey: string
  collapsed: boolean
  mobileDrawer?: boolean
  /** Aberto por padrão na primeira visita. */
  defaultOpen?: boolean
  children: ReactNode
}

export function SidebarNavGroup({
  title,
  storageKey,
  collapsed,
  mobileDrawer = false,
  defaultOpen = true,
  children,
}: Props) {
  const showHeader = mobileDrawer || !collapsed
  const [open, setOpen] = useState(() => readOpen(storageKey, defaultOpen))

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev
      persistOpen(storageKey, next)
      return next
    })
  }, [storageKey])

  const visible = !showHeader || open

  return (
    <GroupWrap>
      {showHeader ? (
        <GroupHeaderBtn
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={`sidebar-group-${storageKey}`}
          id={`sidebar-group-trigger-${storageKey}`}
        >
          <GroupTitle>{title}</GroupTitle>
          <GroupChevron $open={open} aria-hidden>
            <HiChevronDown size={14} />
          </GroupChevron>
        </GroupHeaderBtn>
      ) : null}
      {visible ? (
        <GroupBody
          id={`sidebar-group-${storageKey}`}
          role="group"
          aria-labelledby={showHeader ? `sidebar-group-trigger-${storageKey}` : undefined}
        >
          {children}
        </GroupBody>
      ) : null}
    </GroupWrap>
  )
}
