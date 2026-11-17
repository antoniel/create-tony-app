import type { ReactNode } from 'react'

export default function Status({ children = 'Online' }: { children?: ReactNode }) {
  return (
    <span className="sdk-status" data-design-component="status" data-design-surface>
      {children}
    </span>
  )
}
