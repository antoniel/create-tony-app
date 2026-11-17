import { Radio, RadioGroup, RadioIndicator } from '@ui-sdk/react/radio'

export default function RadioCard() {
  return (
    <RadioGroup defaultValue="basic" aria-label="Plan" className="sdk-row">
      {['basic', 'pro'].map((value) => (
        <Radio className="sdk-select-card sdk-panel" key={value} value={value}>
          <RadioIndicator>●</RadioIndicator>
          {value}
        </Radio>
      ))}
    </RadioGroup>
  )
}
