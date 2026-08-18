// A reusable modal wrapper. Children become the body content.
export function Modal({ title, onClose, children, footer, size }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`modal ${size === "sm" ? "modal--sm" : ""}`}>
        <div className="modal__header">
          <span className="modal__title">{title}</span>
          <button
            type="button"
            className="btn--ghost btn btn--icon"
            aria-label="Close dialog"
            onClick={onClose}
          >
            x
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
