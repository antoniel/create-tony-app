import { Progress, ProgressValue } from '@ui-sdk/react/progress'

export default function ProgressCircle() {
  return (
    <Progress
      aria-label="Completion"
      className="sdk-progress-circle"
      data-design-surface
      value={65}
    >
      <ProgressValue />
    </Progress>
  )
}
