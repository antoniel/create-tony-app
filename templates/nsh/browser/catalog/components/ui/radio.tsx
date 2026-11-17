import { Radio as SdkRadio, RadioGroup, RadioIndicator } from '@ui-sdk/react/radio'

export default function Radio() {
  return (
    <RadioGroup defaultValue="small" aria-label="Size" className="sdk-row">
      {['small', 'large'].map((value) => (
        <SdkRadio className="sdk-button" key={value} value={value}>
          <RadioIndicator>●</RadioIndicator>
          {value}
        </SdkRadio>
      ))}
    </RadioGroup>
  )
}
