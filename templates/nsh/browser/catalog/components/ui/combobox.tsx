import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@ui-sdk/react/combobox'
const options = ['React', 'Vue', 'Svelte']

export default function ComboboxPreview() {
  return (
    <Combobox>
      <ComboboxInput
        className="sdk-input"
        aria-label="Framework"
        placeholder="Choose a framework"
      />
      <ComboboxContent className="sdk-popup">
        <ComboboxList>
          {options.map((name) => (
            <ComboboxItem value={name} key={name} className="sdk-option">
              {name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
