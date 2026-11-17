import { Tabs, TabsList, TabsPanel, TabsTab } from '@ui-sdk/react/tabs'

export default function TabsPreview() {
  return (
    <Tabs className="sdk-stack" defaultValue="overview">
      <TabsList className="sdk-row" aria-label="Project views">
        <TabsTab className="sdk-button" value="overview">
          Overview
        </TabsTab>
        <TabsTab className="sdk-button" value="history">
          History
        </TabsTab>
      </TabsList>
      <TabsPanel value="overview">Project and team information.</TabsPanel>
      <TabsPanel value="history">Latest updates appear here.</TabsPanel>
    </Tabs>
  )
}
