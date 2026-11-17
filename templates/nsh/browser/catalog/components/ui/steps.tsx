import { useState } from 'react'
import { Button } from './button'

export default function Steps() {
  const [step, setStep] = useState(0)
  const steps = ['Details', 'Review', 'Done']
  return (
    <div className="sdk-stack">
      <ol className="sdk-list sdk-row">
        {steps.map((name, index) => (
          <li className="sdk-badge" key={name} aria-current={step === index ? 'step' : undefined}>
            {name}
          </li>
        ))}
      </ol>
      <div className="sdk-row">
        <Button disabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button disabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}
