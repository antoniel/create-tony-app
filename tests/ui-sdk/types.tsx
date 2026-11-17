import { SdkFrameworkPicker } from "../../templates/web/src/components/ui/sdk-framework-picker";
import { Combobox } from "@ui-sdk/react/combobox";

const valid = (
  <SdkFrameworkPicker
    value="react"
    onValueChange={(value) => {
      const typed: "react" | "vue" | "svelte" | "angular" | null = value;
      void typed;
    }}
  />
);
// @ts-expect-error Domain wrapper rejects values outside its union.
const invalidValue = <SdkFrameworkPicker value="typo" onValueChange={() => {}} />;
// @ts-expect-error Null is part of the cleared value contract.
const invalidCallback = <SdkFrameworkPicker value="react" onValueChange={(value: string) => {}} />;
// @ts-expect-error SDK generic rejects a value outside the chosen domain.
const invalidSdkValue = <Combobox<"react" | "vue"> value="typo" />;
