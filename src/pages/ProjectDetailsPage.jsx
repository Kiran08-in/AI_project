import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useData } from "../components/Common/DataContext";
import { ProgressBar } from "../components/Common/ProgressBar";
import { ProjectForm } from "../components/Projects/ProjectForm";
import { TaskForm } from "../components/Tasks/TaskForm";
import { ConfirmDialog } from "../components/Common/ConfirmDialog";
import { StatusBadge, PriorityBadge, AIBadge } from "../components/Common/Badges";
import {
  SuccessMessage,
  ErrorMessage,
  EmptyState,
} from "../components/Common/Messages";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    tasks,
    createTask,
    updateProject,
    deleteProject,
    getProjectById,
    deleteTask,
  } = useData();

  const project = getProjectById(id);

  const [showEdit, setShowEdit] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState(false);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!project) {
    return (
      <div>
        <div className="card">
          <EmptyState
            title="Project could not be found"
            message="The project you are looking for does not exist or has been deleted."
            action={
              <Link to="/projects" className="btn btn--primary btn--sm">
                Back to Projects
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const done = projectTasks.filter((t) => t.status === "Completed").length;
  const pct = projectTasks.length === 0 ? 0 : (done / projectTasks.length) * 100;

  const handleAskAI = () => {
    // Pre-fill the AI Mentor by navigating there; it reads state if present.
    navigate("/ai-mentor", { state: { projectId: project.id } });
  };

  const handleDeleteProject = () => {
    try {
      deleteProject(project.id);
      navigate("/projects");
    } catch {
      setError("Project could not be deleted. Please try again.");
    }
    setConfirmDeleteProject(false);
  };

  const handleDeleteTask = () => {
    if (confirmDeleteTaskId == null) return;
    deleteTask(confirmDeleteTaskId);
    setSuccess("Task deleted successfully.");
    setConfirmDeleteTaskId(null);
  };

  return (
    <div>
      <nav className="text-sm" style={{ marginBottom: "var(--space-4)" }} aria-label="Breadcrumb">
        <Link to="/projects">Projects</Link>
        <span className="muted"> / </span>
        <span className="muted">{project.name}</span>
      </nav>

      {success && <SuccessMessage message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      {/* Project details card */}
      <div className="card section">
        <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", marginBottom: "var(--space-1)" }}>{project.name}</h2>
            <span className="text-sm muted">Created {project.createdAt} · ID #{project.id}</span>
          </div>
          <div className="flex-row" style={{ flexWrap: "wrap" }}>
            <button type="button" className="btn btn--primary btn--sm" onClick={() => setShowTaskForm(true)}>
              + Add Task
            </button>
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => setShowEdit(true)}>
              Edit Project
            </button>
            <button type="button" className="btn btn--secondary btn--sm" onClick={handleAskAI}>
              Ask AI Mentor
            </button>
            <Link to="/projects" className="btn btn--ghost btn--sm">
              Back to Projects
            </Link>
          </div>
        </div>

        <div className="two-col" style={{ gap: "var(--space-6)" }}>
          <div>
            <span className="text-sm muted">Description</span>
            <p style={{ marginTop: "var(--space-1)" }}>{project.description}</p>
          </div>
          <div className="stack">
            <div>
              <span className="text-sm muted">Technology Stack</span>
              <div className="wrap" style={{ marginTop: "var(--space-1)" }}>
                {project.techStack.map((t) => (
                  <span className="tech-badge" key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="two-col" style={{ gap: "var(--space-4)" }}>
              <div>
                <span className="text-sm muted">Total Tasks</span>
                <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{projectTasks.length}</div>
              </div>
              <div>
                <span className="text-sm muted">Completed</span>
                <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>{done}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "var(--space-4)" }}>
          <div className="flex-between" style={{ marginBottom: "var(--space-2)" }}>
            <span className="text-sm" style={{ fontWeight: 600 }}>Overall Progress</span>
            <span className="text-sm muted">{Math.round(pct)}%</span>
          </div>
          <ProgressBar value={pct} success={pct === 100} />
        </div>

        <div style={{ marginTop: "var(--space-4)" }}>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => setConfirmDeleteProject(true)}
          >
            Delete Project
          </button>
        </div>
      </div>

      {/* Tasks belonging to this project */}
      <div className="card section">
        <div className="card__header">
          <span className="card__title">Tasks</span>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setShowTaskForm(true)}>
            + Add Task
          </button>
        </div>

        {projectTasks.length === 0 ? (
          <EmptyState title="No tasks yet" message="Add the first task for this project." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>AI</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{t.title}</div>
                      <div className="text-sm muted">{t.description}</div>
                    </td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td><AIBadge generated={t.aiGenerated} /></td>
                    <td className="text-sm muted">{t.updatedAt}</td>
                    <td>
                      <div className="cell-actions">
                        <button
                          type="button"
                          className="btn btn--danger btn--sm"
                          onClick={() => setConfirmDeleteTaskId(t.id)}
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
      </div>

      {showEdit && (
        <ProjectForm
          title="Edit Project"
          initial={project}
          onSave={(data) => {
            updateProject(project.id, data);
            setShowEdit(false);
            setSuccess("Project updated successfully.");
          }}
          onCancel={() => setShowEdit(false)}
        />
      )}

      {showTaskForm && (
        <TaskForm
          title="Add Task"
          projects={[project]}
          onSave={(data) => {
            createTask(data);
            setShowTaskForm(false);
            setSuccess("Task added successfully.");
          }}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {confirmDeleteProject && (
        <ConfirmDialog
          title="Delete project?"
          message="This will permanently remove the project and all of its tasks. This cannot be undone."
          onConfirm={handleDeleteProject}
          onCancel={() => setConfirmDeleteProject(false)}
        />
      )}

      {confirmDeleteTaskId != null && (
        <ConfirmDialog
          title="Delete task?"
          message="This task will be permanently removed from the project."
          onConfirm={handleDeleteTask}
          onCancel={() => setConfirmDeleteTaskId(null)}
        />
      )}
    </div>
  );
}
