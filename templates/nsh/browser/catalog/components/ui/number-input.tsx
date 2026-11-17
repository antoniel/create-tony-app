import {
  NumberInput as SdkNumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputIncrement,
} from '@ui-sdk/react/number-input'
import type { ComponentProps } from 'react'

export default function NumberInput(props: ComponentProps<typeof SdkNumberInput>) {
  return (
    <SdkNumberInput
      defaultValue={3}
      min={0}
      max={99}
      className="sdk-row sdk-number"
      data-design-component="number-input"
      {...props}
    >
      <NumberInputDecrement className="sdk-button" aria-label="Decrease">
        −
      </NumberInputDecrement>
      <NumberInputControl className="sdk-input" aria-label="Quantity" />
      <NumberInputIncrement className="sdk-button" aria-label="Increase">
        +
      </NumberInputIncrement>
    </SdkNumberInput>
  )
}
