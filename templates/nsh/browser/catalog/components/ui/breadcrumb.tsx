import { Link } from '@tanstack/react-router'

export default function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="sdk-row sdk-list">
        <li>
          <Link to="/components">Components</Link>
        </li>
        <li aria-current="page">/ Breadcrumb</li>
      </ol>
    </nav>
  )
}
