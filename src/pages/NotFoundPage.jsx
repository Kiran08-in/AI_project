import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="empty-state" style={{ paddingTop: "var(--space-12)" }}>
      <div className="empty-state__icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 15s1.5-2 4-2 4 2 4 2M9 9h.01M15 9h.01" />
        </svg>
      </div>
      <div className="empty-state__title" style={{ fontSize: "1.5rem" }}>404</div>
      <div className="empty-state__text">
        The page you are looking for does not exist.
      </div>
      <Link to="/" className="btn btn--primary btn--sm">
        Back to Dashboard
      </Link>
    </div>
  );
}
