import { Link } from '@tanstack/react-router'
import { componentPages, type ComponentIndex } from '../lib/pages'
import { catalogPreview } from '../routes/components/-catalog'
import { Code } from './ui/code'

export function ComponentCollection() {
  return (
    <>
      <h1>Components</h1>
      <ul className="sdk-gallery sdk-list">
        {componentPages.map(({ index, label }) => (
          <li className="sdk-panel sdk-stack" key={index}>
            <Link to="/components/$index" params={{ index }}>
              {label} ↗
            </Link>
            {catalogPreview(index)}
          </li>
        ))}
      </ul>
    </>
  )
}

export function ComponentDetail({ index }: { index: ComponentIndex }) {
  const page = componentPages.findIndex((item) => item.index === index)
  const adjacent = [componentPages[page - 1], componentPages[page + 1]]

  return (
    <article className="sdk-stack">
      <h1>{componentPages[page].label}</h1>
      <p>
        <Code>browser/catalog/components/ui/{index}.tsx</Code>
      </p>
      <div className="sdk-panel">{catalogPreview(index)}</div>
      <nav className="sdk-row" aria-label="Adjacent components">
        {adjacent.filter(Boolean).map(({ index, label }) => (
          <Link to="/components/$index" params={{ index }} key={index}>
            {label} ↗
          </Link>
        ))}
      </nav>
    </article>
  )
}
