import {
  Progress as SdkProgress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@ui-sdk/react/progress'
import type { ComponentProps } from 'react'

export default function Progress(props: ComponentProps<typeof SdkProgress>) {
  return (
    <SdkProgress className="sdk-stack" value={60} {...props}>
      <div className="sdk-row">
        <ProgressLabel>Upload</ProgressLabel>
        <ProgressValue />
      </div>
      <ProgressTrack className="sdk-track">
        <ProgressIndicator className="sdk-fill" />
      </ProgressTrack>
    </SdkProgress>
  )
}
