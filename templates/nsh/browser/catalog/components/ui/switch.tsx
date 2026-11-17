import { Switch as SdkSwitch, SwitchThumb } from '@ui-sdk/react/switch'

export default function Switch() {
  return (
    <SdkSwitch className="sdk-button sdk-switch">
      <SwitchThumb className="sdk-switch-thumb" /> Notifications
    </SdkSwitch>
  )
}
