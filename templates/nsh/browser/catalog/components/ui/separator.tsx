import { Separator as SdkSeparator } from '@ui-sdk/react/separator'

export default function Separator() {
  return (
    <div className="sdk-stack">
      <span>Design</span>
      <SdkSeparator className="sdk-separator" data-design-surface />
      <span>Workspace</span>
    </div>
  )
}
