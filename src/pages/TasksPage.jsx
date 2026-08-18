import { useMemo, useState } from "react";
import { useData } from "../components/Common/DataContext";
import { TaskForm } from "../components/Tasks/TaskForm";
import { ConfirmDialog } from "../components/Common/ConfirmDialog";
import { PriorityBadge, AIBadge } from "../components/Common/Badges";
import {
  SuccessMessage,
  ErrorMessage,
  EmptyState,
} from "../components/Common/Messages";

export default function TasksPage() {
  const {
    projects,
    tasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const projectName = (id) => projects.find((p) => p.id === id)?.name || "—";

  // Apply filters and search to the task list.
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterProject && t.projectId !== Number(filterProject)) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!t.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filterProject, filterPriority, filterStatus, search]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setShowForm(true);
  };

  const handleSave = (data) => {
    try {
      if (editing) {
        updateTask(editing.id, data);
        setSuccess("Task updated successfully.");
      } else {
        createTask(data);
        setSuccess("Task created successfully.");
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      setError("Task could not be saved. Please check your input and try again.");
    }
  };

  const handleDelete = () => {
    if (confirmId == null) return;
    deleteTask(confirmId);
    setSuccess("Task deleted successfully.");
    setConfirmId(null);
  };

  const clearFilters = () => {
    setSearch("");
    setFilterProject("");
    setFilterPriority("");
    setFilterStatus("");
  };

  const hasFilters = search || filterProject || filterPriority || filterStatus;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "var(--space-5)" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Tasks</h1>
        <button type="button" className="btn btn--primary" onClick={openCreate}>
          + Add Task
        </button>
      </div>

      {success && <SuccessMessage message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      {/* Filters toolbar */}
      <div className="toolbar">
        <div className="toolbar__search">
          <span className="toolbar__search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search task titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search tasks"
          />
        </div>

        <select
          className="toolbar__select"
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          aria-label="Filter by project"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          className="toolbar__select"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          className="toolbar__select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        {hasFilters && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No tasks found"
            message={hasFilters ? "Try changing or clearing the filters." : "Add your first task to get started."}
            action={
              !hasFilters ? (
                <button type="button" className="btn btn--primary btn--sm" onClick={openCreate}>
                  + Add Task
                </button>
              ) : (
                <button type="button" className="btn btn--secondary btn--sm" onClick={clearFilters}>
                  Clear filters
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>AI</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="text-sm muted">#{t.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    <div className="text-sm muted">{t.description}</div>
                  </td>
                  <td>{projectName(t.projectId)}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td>
                    {/* Change Status: inline select that updates immediately */}
                    <select
                      className="toolbar__select"
                      style={{ minWidth: 130 }}
                      value={t.status}
                      onChange={(e) => {
                        updateTaskStatus(t.id, e.target.value);
                        setSuccess("Task status updated successfully.");
                      }}
                      aria-label={`Change status for ${t.title}`}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </td>
                  <td><AIBadge generated={t.aiGenerated} /></td>
                  <td className="text-sm muted">{t.createdAt}</td>
                  <td className="text-sm muted">{t.updatedAt}</td>
                  <td>
                    <div className="cell-actions">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => openEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => setConfirmId(t.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <TaskForm
          title={editing ? "Edit Task" : "Add Task"}
          initial={editing}
          projects={projects}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {confirmId != null && (
        <ConfirmDialog
          title="Delete task?"
          message="This task will be permanently removed. This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
