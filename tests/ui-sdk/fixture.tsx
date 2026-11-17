import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { SdkFrameworkPicker, type Framework } from "./.fixture/sdk-framework-picker";

export function Fixture() {
  const [value, setValue] = React.useState<Framework | null>("react");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        document.querySelector("output")!.textContent =
          new FormData(event.currentTarget).get("framework")?.toString() ?? "";
      }}
    >
      <h1>SDK framework selection</h1>
      <SdkFrameworkPicker value={value} onValueChange={setValue} />
      <p role="status">Selected: {value ?? "none"}</p>
      <button type="submit">Submit</button>
      <output />
      <button type="button" onClick={() => setValue("vue")}>
        Set Vue externally
      </button>
    </form>
  );
}

// HTML is inserted by the test from renderToString, so this also exercises hydration.
if (typeof document !== "undefined") hydrateRoot(document.getElementById("root")!, <Fixture />);
