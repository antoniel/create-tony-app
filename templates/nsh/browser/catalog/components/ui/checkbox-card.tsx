import { Checkbox, CheckboxIndicator } from '@ui-sdk/react/checkbox'

export default function CheckboxCard() {
  return (
    <Checkbox className="sdk-panel sdk-select-card">
      <strong>Include reports</strong>
      <small>Attach the weekly summary.</small>
      <CheckboxIndicator className="sdk-check">✓</CheckboxIndicator>
    </Checkbox>
  )
}
