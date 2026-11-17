import type { ReactNode } from 'react'

export default function HeadingExample() {
  return <Heading>Design system</Heading>
}

export function Heading({ children }: { children: ReactNode }) {
  return (
    <h3 className="sdk-heading" data-design-component="heading" data-design-surface>
      {children}
    </h3>
  )
}
