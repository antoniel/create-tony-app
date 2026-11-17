import { Input as SdkInput } from '@ui-sdk/react/input'
import type { ComponentProps } from 'react'

export default function Input({ className = '', ...props }: ComponentProps<typeof SdkInput>) {
  return (
    <SdkInput
      data-design-component="input"
      placeholder="Type here"
      {...props}
      className={`sdk-input ${className}`}
    />
  )
}
