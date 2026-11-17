import type { ReactNode } from 'react'

export default function CodeExample() {
  return <Code>bun dev</Code>
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="sdk-code" data-design-component="code" data-design-surface>
      {children}
    </code>
  )
}
