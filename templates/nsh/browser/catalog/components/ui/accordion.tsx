import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '@ui-sdk/react/accordion'

export default function AccordionPreview() {
  return (
    <Accordion className="sdk-stack" defaultValue={['intro']} collapsible>
      <AccordionItem value="intro">
        <AccordionTrigger className="sdk-button">Introduction</AccordionTrigger>
        <AccordionPanel>Start with the design tokens.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="usage">
        <AccordionTrigger className="sdk-button">Usage</AccordionTrigger>
        <AccordionPanel>Use arrow keys to move between triggers.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
