import { NavLink } from "react-router-dom";

// Navigation links shown in the sidebar.
const navItems = [
  { to: "/", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { to: "/projects", label: "Projects", icon: "M3 7h18M3 12h18M3 17h18" },
  { to: "/tasks", label: "Tasks", icon: "M4 6h16M4 12h10M4 18h7" },
  { to: "/ai-mentor", label: "AI Mentor", icon: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" },
  { to: "/ai-history", label: "AI History", icon: "M12 8v4l3 2M12 3a9 9 0 100 18 9 9 0 000-18z" },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar__brand">
          <span className="sidebar__brand-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" />
            </svg>
          </span>
          AI Project Mentor
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={item.icon} />
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          Frontend prototype v1.0
          <br />
          Mock data mode
        </div>
      </aside>

      {/* Dark backdrop shown when the mobile sidebar is open */}
      <div
        className={`sidebar__backdrop ${open ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
    </>
  );
}

export default Sidebar;
