import { copyFileSync, mkdirSync } from "node:fs";
// Test an exact copy so package resolution is isolated from the CLI's dependencies.
mkdirSync(new URL("./.fixture/", import.meta.url), { recursive: true });
for (const extension of ["tsx", "css"]) {
  const name = `sdk-framework-picker.${extension}`;
  copyFileSync(
    new URL(`../../templates/web/src/components/ui/${name}`, import.meta.url),
    new URL(`./.fixture/${name}`, import.meta.url),
  );
}
