import { Switch as SdkSwitch, SwitchThumb } from '@ui-sdk/react/switch'

export default function Switch() {
  return (
    <SdkSwitch className="sdk-button sdk-switch">
      <span className="sdk-switch-track">
        <SwitchThumb className="sdk-switch-thumb" />
      </span>
      Notifications
    </SdkSwitch>
  )
}
