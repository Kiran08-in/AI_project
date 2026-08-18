import { useState } from "react";

// Shows a green success alert that the user can dismiss.
export function SuccessMessage({ message, onClose }) {
  return (
    <div className="alert alert--success" role="status">
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          className="alert__close"
          aria-label="Dismiss success message"
          onClick={onClose}
        >
          x
        </button>
      )}
    </div>
  );
}

// Shows a red error alert that the user can dismiss.
export function ErrorMessage({ message, onClose }) {
  return (
    <div className="alert alert--error" role="alert">
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          className="alert__close"
          aria-label="Dismiss error message"
          onClick={onClose}
        >
          x
        </button>
      )}
    </div>
  );
}

// Shown when a list or section has no data.
export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16v12H4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="empty-state__title">{title}</div>
      {message && <div className="empty-state__text">{message}</div>}
      {action}
    </div>
  );
}

// Convenience wrapper that auto-dismisses after a few seconds.
export function AutoSuccess({ message }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return <SuccessMessage message={message} onClose={() => setVisible(false)} />;
}
