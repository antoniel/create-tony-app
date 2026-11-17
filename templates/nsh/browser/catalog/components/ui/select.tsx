import {
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
} from '@ui-sdk/react/select'
const options = ['Light', 'Dark', 'System']

export default function SelectPreview() {
  return (
    <Select items={options} defaultValue="System">
      <SelectTrigger className="sdk-button" aria-label="Theme">
        <SelectValue /> ▾
      </SelectTrigger>
      <SelectContent className="sdk-popup">
        <SelectList>
          {options.map((name) => (
            <SelectItem key={name} value={name} className="sdk-option">
              {name}
            </SelectItem>
          ))}
        </SelectList>
      </SelectContent>
    </Select>
  )
}
