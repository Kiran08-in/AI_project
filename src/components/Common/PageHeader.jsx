import { Link } from "react-router-dom";

// A clean wrapper for page content with an optional title and action button.
export function PageHeader({ title, action }) {
  return (
    <div className="flex-between" style={{ marginBottom: "var(--space-5)" }}>
      <h1 className="page-title" style={{ marginBottom: 0 }}>{title}</h1>
      {action}
    </div>
  );
}

// A small breadcrumb link used at the top of detail pages.
export function Breadcrumb({ items }) {
  return (
    <nav className="text-sm" style={{ marginBottom: "var(--space-4)" }} aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span className="muted">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="muted"> / </span>}
        </span>
      ))}
    </nav>
  );
}

export default PageHeader;
