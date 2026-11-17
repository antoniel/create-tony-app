import { InputGroup } from '@ui-sdk/react/input'
import Input from './input'

export default function InputGroupPreview() {
  return (
    <InputGroup className="sdk-row">
      <span aria-hidden>https://</span>
      <Input aria-label="Domain" placeholder="example.com" />
    </InputGroup>
  )
}
