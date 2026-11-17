import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from '@ui-sdk/react/password-input'

export default function PasswordInputPreview() {
  return (
    <PasswordInput className="sdk-row" defaultValue="sample-pass">
      <PasswordInputControl className="sdk-input" aria-label="Password" />
      <PasswordInputToggle className="sdk-button">Show</PasswordInputToggle>
    </PasswordInput>
  )
}
