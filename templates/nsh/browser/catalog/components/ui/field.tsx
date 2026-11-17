import { Field as SdkField, FieldDescription, FieldLabel } from '@ui-sdk/react/field'
import Input from './input'

export default function Field() {
  return (
    <SdkField className="sdk-stack">
      <FieldLabel>Email address</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
      <FieldDescription>Used for notifications.</FieldDescription>
    </SdkField>
  )
}
