import { Button as SdkButton } from '@ui-sdk/react/button'
import { useState, type ComponentProps } from 'react'

export default function ButtonExample() {
  const [count, setCount] = useState(0)
  return (
    <div className="sdk-row">
      <Button className="sdk-solid" onClick={() => setCount(count + 1)}>
        Run {count || ''}
      </Button>
      <Button onClick={() => setCount(0)}>Reset</Button>
    </div>
  )
}

export function Button({ className = '', ...props }: ComponentProps<typeof SdkButton>) {
  return (
    <SdkButton
      data-design-component="button"
      data-design-surface
      {...props}
      className={`sdk-button ${className}`}
    />
  )
}
