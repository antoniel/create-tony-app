import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
} from '@ui-sdk/react/color-picker'

export default function ColorPickerPreview() {
  return (
    <ColorPicker defaultValue="#4f46e5" className="sdk-stack">
      <ColorPickerArea aria-label="Saturation and brightness" className="sdk-color-area">
        <ColorPickerAreaCanvas />
        <ColorPickerAreaThumb className="sdk-thumb" />
      </ColorPickerArea>
      <ColorPickerSlider channel="hue" aria-label="Hue" className="sdk-color-hue">
        <ColorPickerSliderThumb className="sdk-thumb" />
      </ColorPickerSlider>
      <div className="sdk-row">
        <ColorPickerSwatch className="sdk-swatch" />
        <ColorPickerInput className="sdk-input" aria-label="Hex color" />
      </div>
    </ColorPicker>
  )
}
