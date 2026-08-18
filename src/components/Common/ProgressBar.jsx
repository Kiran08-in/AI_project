// A simple progress bar with an optional percentage label.
export function ProgressBar({ value = 0, showLabel = false, success = false }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
      <div
        className={`progress__bar ${success ? "progress__bar--success" : ""}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default ProgressBar;
