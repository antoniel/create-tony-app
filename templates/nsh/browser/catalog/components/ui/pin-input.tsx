import { OTPInput, OTPInputGroup, OTPInputSlot } from '@ui-sdk/react/otp-input'

export default function PinInput() {
  return (
    <OTPInput maxLength={4} aria-label="Four-digit code">
      <OTPInputGroup className="sdk-row">
        {[0, 1, 2, 3].map((index) => (
          <OTPInputSlot className="sdk-pin" key={index} index={index} />
        ))}
      </OTPInputGroup>
    </OTPInput>
  )
}
