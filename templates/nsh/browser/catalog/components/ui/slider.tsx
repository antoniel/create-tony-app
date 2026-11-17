import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@ui-sdk/react/slider'

export default function SliderPreview() {
  return (
    <Slider defaultValue={[45]} className="sdk-stack">
      <SliderValue />
      <SliderControl className="sdk-slider">
        <SliderTrack className="sdk-track">
          <SliderIndicator className="sdk-fill" />
        </SliderTrack>
        <SliderThumb aria-label="Volume" className="sdk-thumb" />
      </SliderControl>
    </Slider>
  )
}
