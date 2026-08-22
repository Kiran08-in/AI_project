import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useData } from "../components/Common/DataContext";
import { LoadingSpinner } from "../components/Common/LoadingSpinner";
import { ErrorMessage, SuccessMessage } from "../components/Common/Messages";
import { aiTaskTypes } from "../data/mockData";
import { generateAIPlan } from "../services/api";

// Renders one section of the structured AI response.
function AISection({ title, items }) {
  return (
    <div className="ai-response__section">
      <h4>{title}</h4>
      {Array.isArray(items) ? (
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">{items}</p>
      )}
    </div>
  );
}

export default function AIMentorPage() {
  const { projects, createTask } = useData();
  const location = useLocation();

  // If navigated from Project Details, pre-select that project.
  const initialProject =
    location.state?.projectId ?? projects[0]?.id ?? "";

  const [projectId, setProjectId] = useState(initialProject);
  const [requirement, setRequirement] = useState("");
  const [taskType, setTaskType] = useState(aiTaskTypes[1]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerate = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResponse(null);

    if (!projectId) {
      setError("Please select a project.");
      return;
    }
    if (!requirement.trim()) {
      setError("Please enter a requirement or question.");
      return;
    }

    setLoading(true);
    generateAIPlan({
      projectId: Number(projectId),
      aiTaskType: taskType,
      requirement: requirement.trim(),
    })
      .then(setResponse)
      .catch((requestError) =>
        setError(
          requestError.response?.data?.detail ||
            "The AI recommendation could not be generated."
        )
      )
      .finally(() => setLoading(false));
  };

  const handleSave = () => {
    if (!response) return;
    setSuccess("Recommendation saved to AI History.");
  };

  // Turn each AI task suggestion into a real task in the selected project.
  const handleCreateTasks = async () => {
    if (!response) return;
    const projectIdNum = Number(projectId);
    // Use the frontend task lines as concrete tasks.
    const lines = [
      ...(response.frontendTasks || []),
      ...(response.backendTasks || []),
      ...(response.databaseTasks || []),
    ];
    await Promise.all(lines.map((line) => createTask({
        projectId: projectIdNum,
        title: line.length > 70 ? line.slice(0, 67) + "..." : line,
        description: line,
        priority: "Medium",
        status: "Pending",
        aiGenerated: true,
      })));
    setSuccess(`${lines.length} tasks created from the recommendation.`);
  };

  const handleClear = () => {
    setResponse(null);
    setRequirement("");
    setError("");
    setSuccess("");
  };

  return (
    <div>
      <h1 className="page-title">AI Mentor</h1>

      {success && <SuccessMessage message={success} onClose={() => setSuccess("")} />}
      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      <div className="two-col" style={{ alignItems: "flex-start" }}>
        {/* Request form */}
        <div className="card">
          <h3 className="card__title" style={{ marginBottom: "var(--space-4)" }}>
            Ask the AI Mentor
          </h3>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label" htmlFor="ai-project">
                Select Project
              </label>
              <select
                id="ai-project"
                className="form-control"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ai-requirement">
                Requirement or Question
              </label>
              <textarea
                id="ai-requirement"
                className="form-control"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Describe a feature you want to build or a question you have..."
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ai-task-type">
                AI Task Type
              </label>
              <select
                id="ai-task-type"
                className="form-control"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
              >
                {aiTaskTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
              Generate AI Recommendation
            </button>
          </form>

          <p className="form-hint" style={{ marginTop: "var(--space-3)" }}>
            The AI Mentor saves generated recommendations to the backend history.
          </p>
        </div>

        {/* Response area */}
        <div className="card">
          <h3 className="card__title" style={{ marginBottom: "var(--space-4)" }}>
            AI Response
          </h3>

          {loading && (
            <div className="ai-loading">
              <LoadingSpinner />
              <span className="ai-loading__text">
                AI Mentor is analysing your project...
              </span>
            </div>
          )}

          {!loading && !response && (
            <div className="empty-state">
              <div className="empty-state__icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
                </svg>
              </div>
              <div className="empty-state__title">No response yet</div>
              <div className="empty-state__text">
                Fill in the form and click "Generate AI Recommendation".
              </div>
            </div>
          )}

          {!loading && response && (
            <>
              <div className="flex-between" style={{ marginBottom: "var(--space-4)" }}>
                <span className="badge badge--ai">Model: {response.modelName}</span>
                <span className="text-sm muted">{taskType}</span>
              </div>

              <div className="ai-response">
                <AISection title="Requirement Understanding" items={response.requirementUnderstanding} />
                <AISection title="Frontend Tasks" items={response.frontendTasks} />
                <AISection title="Backend Tasks" items={response.backendTasks} />
                <AISection title="Database Tasks" items={response.databaseTasks} />
                <AISection title="Testing Steps" items={response.testingSteps} />
                <AISection title="Possible Blockers" items={response.possibleBlockers} />
                <AISection title="Recommended Next Action" items={response.recommendedNextAction} />
              </div>

              <div className="flex-row" style={{ marginTop: "var(--space-5)", flexWrap: "wrap" }}>
                <button type="button" className="btn btn--secondary btn--sm" onClick={handleSave}>
                  Save Recommendation
                </button>
                <button type="button" className="btn btn--primary btn--sm" onClick={handleCreateTasks}>
                  Create Tasks from Recommendation
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={handleClear}>
                  Clear Response
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
