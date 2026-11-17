import { useState, type ComponentProps } from 'react'
import { Button } from './button'

export default function CloseButtonExample() {
  const [open, setOpen] = useState(true)
  return open ? (
    <CloseButton onClick={() => setOpen(false)} />
  ) : (
    <Button onClick={() => setOpen(true)}>Restore</Button>
  )
}

export function CloseButton(props: ComponentProps<typeof Button>) {
  return (
    <Button aria-label="Close" {...props} data-design-component="close-button">
      ×
    </Button>
  )
}
