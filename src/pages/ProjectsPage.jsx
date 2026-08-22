import { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../components/Common/DataContext";
import { ProjectForm } from "../components/Projects/ProjectForm";
import { ConfirmDialog } from "../components/Common/ConfirmDialog";
import { SuccessMessage, ErrorMessage, EmptyState } from "../components/Common/Messages";

// Helpers for stats shown on each project card.
function projectStats(tasks, projectId) {
  const list = tasks.filter((t) => t.projectId === projectId);
  const done = list.filter((t) => t.status === "Completed").length;
  return { total: list.length, done };
}

export default function ProjectsPage() {
  const { projects, tasks, createProject, updateProject, deleteProject } = useData();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setShowForm(true);
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateProject(editing.id, data);
        setSuccess("Project updated successfully.");
      } else {
        await createProject(data);
        setSuccess("Project created successfully.");
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      setError("Project could not be saved. Please check your input and try again.");
    }
  };

  const handleDelete = async () => {
    if (confirmId == null) return;
    try {
      await deleteProject(confirmId);
      setSuccess("Project deleted successfully.");
    } catch {
      setError("Project could not be deleted. Please try again.");
    }
    setConfirmId(null);
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "var(--space-5)" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Projects</h1>
        <button type="button" className="btn btn--primary" onClick={openCreate}>
          + Create Project
        </button>
      </div>

      {success && <SuccessMessage message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      {projects.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No projects yet"
            message="Create your first software project to get started."
            action={
              <button type="button" className="btn btn--primary" onClick={openCreate}>
                + Create Project
              </button>
            }
          />
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((p) => {
            const stats = projectStats(tasks, p.id);
            return (
              <div className="project-card" key={p.id}>
                <div>
                  <div className="project-card__name">{p.name}</div>
                  <div className="project-card__desc">{p.description}</div>
                </div>

                <div className="wrap">
                  {p.techStack.map((t) => (
                    <span className="tech-badge" key={t}>{t}</span>
                  ))}
                </div>

                <div className="project-card__meta">
                  <span>ID: #{p.id}</span>
                  <span>Tasks: {stats.done}/{stats.total} completed</span>
                  <span>Created: {p.createdAt}</span>
                </div>

                <div className="project-card__actions">
                  <Link to={`/projects/${p.id}`} className="btn btn--secondary btn--sm">
                    View
                  </Link>
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => setConfirmId(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ProjectForm
          title={editing ? "Edit Project" : "Create Project"}
          initial={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {confirmId != null && (
        <ConfirmDialog
          title="Delete project?"
          message="This will permanently remove the project and all of its tasks. This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
