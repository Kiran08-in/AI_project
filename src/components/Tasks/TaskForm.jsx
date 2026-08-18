import { useState } from "react";
import { Modal } from "../Common/Modal";

// Reusable form for creating or editing a task.
// `projects` is the list of available projects for the select dropdown.
export function TaskForm({ initial, projects, onSave, onCancel, title }) {
  const [projectId, setProjectId] = useState(
    initial?.projectId ?? (projects[0]?.id ?? "")
  );
  const [title2, setTitle2] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [priority, setPriority] = useState(initial?.priority || "Medium");
  const [status, setStatus] = useState(initial?.status || "Pending");
  const [aiGenerated, setAiGenerated] = useState(initial?.aiGenerated || false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!projectId) next.projectId = "Please select a project.";
    if (!title2.trim()) next.title = "Task title is required.";
    if (!description.trim()) next.description = "Description is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      projectId: Number(projectId),
      title: title2.trim(),
      description: description.trim(),
      priority,
      status,
      aiGenerated,
    });
  };

  const footer = (
    <>
      <button type="button" className="btn btn--secondary" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" form="task-form" className="btn btn--primary">
        Save Task
      </button>
    </>
  );

  return (
    <Modal title={title} onClose={onCancel} footer={footer}>
      <form id="task-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="task-project">
            Project <span className="req">*</span>
          </label>
          <select
            id="task-project"
            className={`form-control ${errors.projectId ? "form-control--error" : ""}`}
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Select a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <span className="form-error">{errors.projectId}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-title">
            Task Title <span className="req">*</span>
          </label>
          <input
            id="task-title"
            className={`form-control ${errors.title ? "form-control--error" : ""}`}
            value={title2}
            onChange={(e) => setTitle2(e.target.value)}
            placeholder="e.g. Build login API endpoint"
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-desc">
            Task Description <span className="req">*</span>
          </label>
          <textarea
            id="task-desc"
            className={`form-control ${errors.description ? "form-control--error" : ""}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this task involves..."
          />
          {errors.description && (
            <span className="form-error">{errors.description}</span>
          )}
        </div>

        <div className="two-col" style={{ gap: "var(--space-4)" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-status">
              Status
            </label>
            <select
              id="task-status"
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-row">
            <input
              id="task-ai"
              type="checkbox"
              checked={aiGenerated}
              onChange={(e) => setAiGenerated(e.target.checked)}
            />
            <label className="form-label" htmlFor="task-ai" style={{ margin: 0 }}>
              AI Generated task
            </label>
          </div>
          <span className="form-hint">
            Tick this if the task was suggested by the AI Mentor.
          </span>
        </div>
      </form>
    </Modal>
  );
}

export default TaskForm;
