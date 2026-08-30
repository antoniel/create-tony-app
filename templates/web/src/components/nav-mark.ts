import { useEffect, useState } from 'react'

export type NavMark = 'tick' | 'recess' | 'fill'

export const navMarks = [
  {
    id: 'tick' as const,
    title: 'tick',
    copy: 'scribe on the left. hover fills the row. selected is the line, not a box.',
  },
  {
    id: 'recess' as const,
    title: 'recess',
    copy: 'inset well. hover is only the catchlight. no rectangle.',
  },
  {
    id: 'fill' as const,
    title: 'fill',
    copy: 'metal plate. hover and selected share the same fill. parent only brightens.',
  },
] as const

let savedMark: NavMark = 'fill'
const markListeners = new Set<(mark: NavMark) => void>()

export function getNavMark() {
  return savedMark
}

export function setNavMark(mark: NavMark) {
  savedMark = mark
  for (const listen of markListeners) {
    listen(mark)
  }
}

export function parseNavMarkMenuValue(value: string) {
  const prefix = 'mark:'
  if (!value.startsWith(prefix)) {
    return null
  }

  const id = value.slice(prefix.length)
  return navMarks.find((option) => option.id === id)?.id ?? null
}

export function subscribeNavMark(listen: (mark: NavMark) => void) {
  markListeners.add(listen)
  return () => {
    markListeners.delete(listen)
  }
}

export function useNavMark() {
  const [mark, setMark] = useState(savedMark)
  useEffect(() => subscribeNavMark(setMark), [])
  return [mark, setNavMark] as const
}

export function navRowProps(mark: NavMark, selected: boolean, inherited = false) {
  const on = selected || inherited

  if (mark === 'tick') {
    return {
      bg: 'transparent',
      borderColor: 'transparent',
      borderLeftColor: selected ? 'app.focus' : inherited ? 'app.border' : 'transparent',
      borderLeftWidth: '2px',
      borderWidth: '0',
      color: on ? 'fg' : 'fg.muted',
      shadow: 'none',
      _hover: { bg: 'app.spot', color: 'fg' },
      _focusVisible: { bg: 'app.spot', color: 'fg' },
    } as const
  }

  if (mark === 'recess') {
    return {
      bg: selected ? 'app.spot' : 'transparent',
      borderColor: 'transparent',
      borderWidth: '0',
      color: on ? 'fg' : 'fg.muted',
      shadow: selected ? 'xs' : 'none',
      _hover: { shadow: 'xs', color: 'fg' },
      _focusVisible: { shadow: 'xs', color: 'fg' },
    } as const
  }

  return {
    bg: selected ? 'app.spot' : 'transparent',
    borderColor: 'transparent',
    borderWidth: '0',
    color: on ? 'fg' : 'fg.muted',
    shadow: selected ? 'xs' : 'none',
    _hover: { bg: 'app.spot', color: 'fg' },
    _focusVisible: { bg: 'app.spot', color: 'fg' },
  } as const
}
