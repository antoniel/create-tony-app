import { OverlayHost } from '@ui-sdk/react/overlays'
import { createContext, useContext, type PropsWithChildren } from 'react'
import { draftFromSeed } from '../theme/draft'
import { appearanceCSS, fontStack } from './model'
import { useDesignDocument } from './use-document'

const DesignContext = createContext<ReturnType<typeof useDesignDocument> | null>(null)

export function DesignProvider({ children }: PropsWithChildren) {
  const design = useDesignDocument()
  const { seed, accent, font, appearance } = design.document
  const { brand } = draftFromSeed(seed)

  return (
    <DesignContext.Provider value={design}>
      <style>{`:root { --sdk-accent: ${accent}; --sdk-ink: ${brand['950']}; --sdk-strong: ${brand['800']}; --sdk-tint: ${brand['50']}; --sdk-border: ${brand['200']}; --sdk-focus: ${brand['600']}; --sdk-font: ${fontStack(font)}; }`}</style>
      <style>{appearanceCSS(appearance)}</style>
      <OverlayHost toast={{ className: 'sdk-toast-region' }} />
      {children}
    </DesignContext.Provider>
  )
}

export function useDesign() {
  const design = useContext(DesignContext)
  if (!design) throw new Error('DesignProvider is required')
  return design
}
