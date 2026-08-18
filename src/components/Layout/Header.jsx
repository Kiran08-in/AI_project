import { useLocation } from "react-router-dom";

// Map route paths to a human-readable page title for the header.
const titleMap = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/ai-mentor": "AI Mentor",
  "/ai-history": "AI History",
};

export function Header({ onToggleSidebar }) {
  const { pathname } = useLocation();

  // Derive the page title. Project details pages show "Project Details".
  let title = titleMap[pathname];
  if (!title) {
    if (pathname.startsWith("/projects/")) {
      title = "Project Details";
    } else {
      title = "Page";
    }
  }

  return (
    <header className="app-header">
      <button
        type="button"
        className="app-header__mobile-toggle"
        aria-label="Open navigation menu"
        onClick={onToggleSidebar}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h2 className="app-header__title">{title}</h2>

      <div className="app-header__search">
        <span className="app-header__search-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </span>
        <input type="search" placeholder="Search..." aria-label="Search" />
      </div>

      <div className="app-header__actions">
        <button
          type="button"
          className="app-header__icon-btn"
          aria-label="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z" />
            <path d="M10 21a2 2 0 004 0" />
          </svg>
          <span className="badge-dot" />
        </button>

        <div className="app-header__profile" title="Student user">
          <span className="app-header__avatar">ST</span>
          <span className="app-header__profile-name">Student</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
