"use client";

import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/react/combobox";
import "./sdk-framework-picker.css";

export type Framework = "react" | "vue" | "svelte" | "angular";

const frameworks: { value: Framework; label: string; disabled?: boolean }[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular", disabled: true },
];

interface SdkFrameworkPickerProps {
  value: Framework | null;
  onValueChange: (value: Framework | null) => void;
  disabled?: boolean;
}

// Keep the SDK's choices behind a small, domain-typed interface.
export function SdkFrameworkPicker({ value, onValueChange, disabled }: SdkFrameworkPickerProps) {
  return (
    <div className="sdk-framework-picker">
      <Combobox<Framework>
        name="framework"
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        itemToLabel={(value) => frameworks.find((item) => item.value === value)?.label ?? value}
      >
        <ComboboxLabel>Framework (UI SDK)</ComboboxLabel>
        <div className="sdk-framework-control">
          <ComboboxInput placeholder="Search frameworks" />
          <ComboboxClear aria-label="Clear framework">×</ComboboxClear>
          <ComboboxTrigger aria-label="Show frameworks">▾</ComboboxTrigger>
        </div>
        <ComboboxContent className="sdk-framework-popup">
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            {frameworks.map((item) => (
              <ComboboxItem
                key={item.value}
                value={item.value}
                label={item.label}
                disabled={item.disabled}
              >
                {item.label} <ComboboxItemIndicator>✓</ComboboxItemIndicator>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
