import { useState } from "react";
import { Modal } from "../Common/Modal";

// Reusable form for creating or editing a project.
// `initial` is provided when editing; omitted when creating.
export function ProjectForm({ initial, onSave, onCancel, title }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [techStack, setTechStack] = useState(
    Array.isArray(initial?.techStack) ? initial.techStack.join(", ") : ""
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Project name is required.";
    if (!description.trim()) next.description = "Description is required.";
    if (!techStack.trim()) next.techStack = "Technology stack is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Convert the comma-separated string into a clean list.
    const stack = techStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({ name: name.trim(), description: description.trim(), techStack: stack });
  };

  const footer = (
    <>
      <button type="button" className="btn btn--secondary" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" form="project-form" className="btn btn--primary">
        Save Project
      </button>
    </>
  );

  return (
    <Modal title={title} onClose={onCancel} footer={footer}>
      <form id="project-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="project-name">
            Project Name <span className="req">*</span>
          </label>
          <input
            id="project-name"
            className={`form-control ${errors.name ? "form-control--error" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Student Placement Portal"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-desc">
            Project Description <span className="req">*</span>
          </label>
          <textarea
            id="project-desc"
            className={`form-control ${errors.description ? "form-control--error" : ""}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what the project does..."
          />
          {errors.description && (
            <span className="form-error">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-stack">
            Technology Stack <span className="req">*</span>
          </label>
          <input
            id="project-stack"
            className={`form-control ${errors.techStack ? "form-control--error" : ""}`}
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="e.g. React, FastAPI, SQL Server"
          />
          <span className="form-hint">Separate technologies with commas.</span>
          {errors.techStack && (
            <span className="form-error">{errors.techStack}</span>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default ProjectForm;
