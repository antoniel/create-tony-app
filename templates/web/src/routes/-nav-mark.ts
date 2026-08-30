export function navRowProps(selected: boolean, inherited = false) {
  const on = selected || inherited
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
