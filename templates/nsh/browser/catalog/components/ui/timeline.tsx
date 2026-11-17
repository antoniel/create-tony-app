import { Timeline, TimelineDescription, TimelineItem, TimelineTitle } from '@ui-sdk/react/timeline'

export default function TimelinePreview() {
  return (
    <Timeline aria-label="Project activity" className="sdk-stack">
      <TimelineItem className="sdk-panel">
        <TimelineTitle>Created</TimelineTitle>
        <TimelineDescription>The first draft was saved.</TimelineDescription>
      </TimelineItem>
      <TimelineItem className="sdk-panel">
        <TimelineTitle>Published</TimelineTitle>
        <TimelineDescription>The design system is available.</TimelineDescription>
      </TimelineItem>
    </Timeline>
  )
}
