import { Checkbox, CheckboxIndicator } from '@ui-sdk/react/checkbox'

export default function CheckboxPreview() {
  return (
    <Checkbox className="sdk-button" defaultChecked={false}>
      <CheckboxIndicator className="sdk-check">✓</CheckboxIndicator> Notifications
    </Checkbox>
  )
}
