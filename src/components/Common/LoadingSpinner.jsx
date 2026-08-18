export function LoadingSpinner({ message }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <div className="spinner__circle" aria-hidden="true" />
      {message && <span>{message}</span>}
    </div>
  );
}

export default LoadingSpinner;
