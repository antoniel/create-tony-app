import { ChakraProvider } from "@chakra-ui/react";
import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import { buildSystem } from "../theme/build";
import { draftFromSeed } from "../theme/draft";
import { appearanceCSS, fontStack } from "./model";
import { useDesignDocument } from "./use-document";
import "./component-overrides.css";

const DesignContext = createContext<ReturnType<typeof useDesignDocument> | null>(null);
export function DesignProvider({ children }: PropsWithChildren) {
  const design = useDesignDocument();
  const { seed, accent, font } = design.document;
  const theme = useMemo(
    () =>
      buildSystem(
        draftFromSeed(seed, { accent, fonts: { heading: fontStack(font), body: fontStack(font), mono: "monospace" } }),
      ),
    [seed, accent, font],
  );
  return (
    <DesignContext.Provider value={design}>
      <ChakraProvider value={theme}>
        <style>{appearanceCSS(design.document.appearance)}</style>
        {children}
      </ChakraProvider>
    </DesignContext.Provider>
  );
}
export function useDesign() {
  const design = useContext(DesignContext);
  if (!design) throw new Error("DesignProvider is required");
  return design;
}
