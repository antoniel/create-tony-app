import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  redirect,
  RouterProvider,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import type { Design } from '../design'
import { ComponentCollection, ComponentDetail } from './catalog/components/catalog-pages'
import { isComponentIndex } from './catalog/lib/pages'
import componentStyles from './catalog/studio/component-overrides.css?inline'
import { DesignProvider } from './catalog/studio/design-provider'
import { initialDocument, parseDocument, storageKey } from './catalog/studio/model'
import type { DesignNode } from './catalog/studio/registry'
import studioStyles from './catalog/studio/studio.css?inline'
import { DesignStudio } from './catalog/studio/studio'
import catalogStyles from './catalog/sdk.css?inline'

const sourceRoot = 'browser/catalog'

export function createHost() {
  let active: { slot: HTMLElement; dispose: () => void } | undefined

  return {
    call(name: string, legacy: Design | null) {
      if (name !== 'studio.mount') throw new Error(`Unknown Studio host call: ${name}`)
      const slot = document.querySelector<HTMLElement>('#app [aria-label="Tony Studio web mount"]')
      if (!slot) throw new Error('Studio could not find its web mount point.')
      if (active?.slot === slot) return null
      active?.dispose()
      restoreDraft(legacy)

      const surface = document.createElement('div')
      surface.dataset.nshStudio = ''
      surface.style.cssText = 'position:absolute;inset:0;overflow:auto;pointer-events:auto'
      slot.append(surface)

      const root = createRoot(surface)
      const observer = new MutationObserver(() => {
        if (!surface.isConnected) dispose()
      })
      const dispose = () => {
        observer.disconnect()
        root.unmount()
        surface.remove()
        if (active?.slot === slot) active = undefined
      }
      observer.observe(document.body, { childList: true, subtree: true })
      active = { slot, dispose }
      root.render(<RouterProvider router={createStudioRouter()} />)
      return null
    },
  }
}

function createStudioRouter() {
  const root = createRootRoute({
    component: () => (
      <DesignProvider>
        <style>{studioStyles}</style>
        <style>{catalogStyles}</style>
        <style>{componentStyles}</style>
        <Outlet />
      </DesignProvider>
    ),
  })
  const studio = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: () => <DesignStudio sourcePath={catalogSource} />,
  })
  const gallery = createRoute({
    getParentRoute: () => root,
    path: '/components',
    component: () => (
      <CatalogFrame>
        <ComponentCollection />
      </CatalogFrame>
    ),
  })
  const detail = createRoute({
    getParentRoute: () => root,
    path: '/components/$index',
    loader: ({ params }) => {
      if (!isComponentIndex(params.index)) throw redirect({ to: '/components' })
      return params.index
    },
    component: () => (
      <CatalogFrame>
        <ComponentDetail index={detail.useLoaderData()} />
      </CatalogFrame>
    ),
  })
  return createRouter({
    routeTree: root.addChildren([studio, gallery, detail]),
    history: createHashHistory(),
  })
}

function restoreDraft(legacy: Design | null) {
  if (!legacy) return
  try {
    if (localStorage.getItem(storageKey)) return
    const draft = parseDocument(
      JSON.stringify({
        ...initialDocument,
        seed: legacy.brand,
        appearance: Object.fromEntries(
          (['button', 'input', 'switch'] as const).flatMap((id) => {
            const previous = legacy.overrides[id]
            return previous ? [[id, { radius: previous.radius, background: previous.color }]] : []
          }),
        ),
      }),
    )
    localStorage.setItem(storageKey, JSON.stringify(draft))
  } catch {
    // The Studio reports unavailable storage through its own persistence layer.
  }
}

function CatalogFrame({ children }: { children: ReactNode }) {
  return (
    <main className="sdk-catalog">
      <nav className="sdk-row" aria-label="Design workspace">
        <Link to="/">Design studio</Link>
        <Link to="/components">Component gallery</Link>
      </nav>
      {children}
    </main>
  )
}

function catalogSource(node: DesignNode) {
  if (node.level === 'Templates' || node.level === 'Pages')
    return `${sourceRoot}/components/catalog-pages.tsx`
  return node.source.replace(/^src\//, `${sourceRoot}/`)
}
