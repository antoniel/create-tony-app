import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui-sdk/react/hover-card'

export default function HoverCardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger className="sdk-button" render={<a href="#/components" />}>
        Tony Studio
      </HoverCardTrigger>
      <HoverCardContent className="sdk-popup">
        <strong>Tony Studio</strong>
        <p>Design system workspace</p>
      </HoverCardContent>
    </HoverCard>
  )
}
