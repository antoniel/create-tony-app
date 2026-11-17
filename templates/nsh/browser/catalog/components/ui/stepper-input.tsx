import NumberInput from './number-input'

export default function StepperInput() {
  return (
    <div className="sdk-stack">
      <strong>Seats</strong>
      <NumberInput min={1} max={10} defaultValue={2} />
    </div>
  )
}
