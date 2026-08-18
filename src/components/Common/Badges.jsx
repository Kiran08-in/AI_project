// Maps a status or priority value to a CSS badge class.
const statusMap = {
  Pending: "badge--pending",
  "In Progress": "badge--in-progress",
  Completed: "badge--completed",
};

const priorityMap = {
  High: "badge--high",
  Medium: "badge--medium",
  Low: "badge--low",
};

export function StatusBadge({ status }) {
  const cls = statusMap[status] || "badge--neutral";
  return <span className={`badge ${cls}`}>{status}</span>;
}

export function PriorityBadge({ priority }) {
  const cls = priorityMap[priority] || "badge--neutral";
  return <span className={`badge ${cls}`}>{priority}</span>;
}

export function AIBadge({ generated }) {
  if (!generated) return <span className="muted text-sm">—</span>;
  return <span className="badge badge--ai">AI</span>;
}
