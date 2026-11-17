import { Link } from "@tanstack/react-router";
import { Code } from "../components/ui/code";
import { catalogPreview } from "../routes/components/-catalog";

export function TemplatePreview() {
  return (
    <div className="studio-template-preview">
      <div className="studio-browser-bar">
        <span aria-hidden>● ● ●</span>
        <code>/components/:component</code>
      </div>
      <p className="studio-page-caption">TEMPLATE · REUSABLE PAGE STRUCTURE</p>
      <div className="studio-template-slot">
        <small>01 / INTRODUCTION</small>
        <strong>Component name</strong>
        <p>Description and usage guidance</p>
      </div>
      <div className="studio-template-slot">
        <small>02 / SOURCE</small>
        <Code>src/components/ui/:component.tsx</Code>
      </div>
      <div className="studio-template-slot">
        <small>03 / LIVE PREVIEW</small>
        <p>The chosen component fills this region.</p>
      </div>
      <p className="studio-page-caption">
        A template defines the regions. A page fills them with real content.
      </p>
      <Link to="/components/$index" params={{ index: "button" }}>
        Open a filled example: Button ↗
      </Link>
    </div>
  );
}
export function GalleryPagePreview() {
  return (
    <div className="studio-gallery-preview">
      <div className="studio-browser-bar">
        <span aria-hidden>● ● ●</span>
        <code>/components</code>
      </div>
      <div className="studio-mini-page">
        <div className="studio-mini-navigation">
          <strong>TONY</strong>
          <span>Design system</span>
          <span aria-current="page">Components</span>
          <Link to="/">Open design system ↗</Link>
        </div>
        <div className="studio-mini-main">
          <p className="studio-page-caption">PAGE · COMPONENT GALLERY</p>
          <h3>Components</h3>
          <p>A real page composed from the design system. These previews are interactive.</p>
          <div className="studio-mini-grid">
            {(["button", "badge", "input", "switch"] as const).map((id) => (
              <section key={id}>
                <Link to="/components/$index" params={{ index: id }}>
                  {id} ↗
                </Link>
                <div>{catalogPreview(id)}</div>
              </section>
            ))}
          </div>
          <Link className="studio-open-page" to="/components">
            Open the complete page · 67 components ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
