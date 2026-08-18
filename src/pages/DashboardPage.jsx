import { Link } from "react-router-dom";
import { useData } from "../components/Common/DataContext";
import { ProgressBar } from "../components/Common/ProgressBar";
import { StatusBadge, PriorityBadge } from "../components/Common/Badges";
import { EmptyState } from "../components/Common/Messages";

// Helper: percentage of tasks in a project that are completed.
function completedPercent(tasks) {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === "Completed").length;
  return (done / tasks.length) * 100;
}

// Helper: build the "AI Recommended Next Task" card from current tasks.
function pickRecommendedNextTask(projects, tasks) {
  for (const project of projects) {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    const inProgress = projectTasks.find((t) => t.status === "In Progress");
    const pending = projectTasks.find((t) => t.status === "Pending");
    const candidate = inProgress || pending;
    if (candidate) {
      const reason = inProgress
        ? "This task is already in progress and blocks other work. Finishing it first will unblock the next steps."
        : "This is the highest-impact pending task for this project right now.";
      return { project, task: candidate, reason };
    }
  }
  return null;
}

export default function DashboardPage() {
  const { projects, tasks } = useData();

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;

  // Recent tasks: sort by updatedAt descending and take 5.
  const recentTasks = [...tasks]
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 5);

  const recommendation = pickRecommendedNextTask(projects, tasks);

  const stats = [
    { label: "Total Projects", value: totalProjects, icon: "blue", svg: "M3 7h18v13H3zM8 7V4h8v3" },
    { label: "Total Tasks", value: totalTasks, icon: "indigo", svg: "M4 6h16M4 12h16M4 18h16" },
    { label: "Pending", value: pendingTasks, icon: "warning", svg: "M12 9v4M12 17h.01M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z" },
    { label: "In Progress", value: inProgressTasks, icon: "cyan", svg: "M12 3a9 9 0 100 18 9 9 0 000-18z M12 7v5l3 2" },
    { label: "Completed", value: completedTasks, icon: "success", svg: "M5 13l4 4L19 7" },
  ];

  const projectName = (id) => projects.find((p) => p.id === id)?.name || "—";

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      {/* Summary stat cards */}
      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-card__icon stat-card__icon--${s.icon}`} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.svg} />
              </svg>
            </div>
            <span className="stat-card__label">{s.label}</span>
            <span className="stat-card__value">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="two-col">
        {/* Project Progress */}
        <div className="card section">
          <div className="card__header">
            <span className="card__title">Project Progress</span>
            <Link to="/projects" className="text-sm">View all</Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState title="No projects yet" message="Create your first project to see progress here." />
          ) : (
            <div className="stack">
              {projects.map((p) => {
                const ptasks = tasks.filter((t) => t.projectId === p.id);
                const pct = completedPercent(ptasks);
                return (
                  <div key={p.id}>
                    <div className="flex-between" style={{ marginBottom: "var(--space-2)" }}>
                      <Link to={`/projects/${p.id}`} className="text-sm" style={{ fontWeight: 600, color: "var(--color-neutral-800)" }}>
                        {p.name}
                      </Link>
                      <span className="text-sm muted">{ptasks.length} tasks</span>
                    </div>
                    <div className="wrap" style={{ marginBottom: "var(--space-2)" }}>
                      {p.techStack.map((t) => (
                        <span className="tech-badge" key={t}>{t}</span>
                      ))}
                    </div>
                    <ProgressBar value={pct} success={pct === 100} />
                    <div className="text-sm muted" style={{ marginTop: "var(--space-1)" }}>
                      {Math.round(pct)}% completed
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Recommended Next Task */}
        <div className="card section">
          <div className="card__header">
            <span className="card__title">AI Recommended Next Task</span>
            <Link to="/ai-mentor" className="text-sm">Ask AI Mentor</Link>
          </div>
          {recommendation ? (
            <div className="stack">
              <div>
                <span className="text-sm muted">Project</span>
                <div style={{ fontWeight: 600 }}>{recommendation.project.name}</div>
              </div>
              <div>
                <span className="text-sm muted">Recommended task</span>
                <div style={{ fontWeight: 600 }}>{recommendation.task.title}</div>
              </div>
              <div>
                <span className="text-sm muted">Reason</span>
                <div className="text-sm">{recommendation.reason}</div>
              </div>
              <Link to="/tasks" className="btn btn--primary btn--sm" style={{ alignSelf: "flex-start" }}>
                View Recommendation
              </Link>
            </div>
          ) : (
            <EmptyState title="No recommendation available" message="All projects are up to date." />
          )}
        </div>
      </div>

      {/* Recent Tasks table */}
      <div className="card section">
        <div className="card__header">
          <span className="card__title">Recent Tasks</span>
          <Link to="/tasks" className="text-sm">View all tasks</Link>
        </div>
        {recentTasks.length === 0 ? (
          <EmptyState title="No tasks yet" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td>{projectName(t.projectId)}</td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td className="text-sm muted">{t.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
