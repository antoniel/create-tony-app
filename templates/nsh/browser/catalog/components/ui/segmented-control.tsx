import { SegmentedControl, SegmentedControlItem } from '@ui-sdk/react/segmented-control'

export default function SegmentedControlPreview() {
  return (
    <SegmentedControl defaultValue="list" aria-label="Layout" className="sdk-row">
      <SegmentedControlItem className="sdk-button" value="list">
        List
      </SegmentedControlItem>
      <SegmentedControlItem className="sdk-button" value="grid">
        Grid
      </SegmentedControlItem>
    </SegmentedControl>
  )
}
