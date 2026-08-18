import { useMemo, useState } from "react";
import { useData } from "../components/Common/DataContext";
import { Modal } from "../components/Common/Modal";
import { ConfirmDialog } from "../components/Common/ConfirmDialog";
import { SuccessMessage, EmptyState } from "../components/Common/Messages";
import { aiTaskTypes } from "../data/mockData";

export default function AIHistoryPage() {
  const { aiHistory, projects, deleteAIInteraction } = useData();

  const [filterProject, setFilterProject] = useState("");
  const [filterTaskType, setFilterTaskType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [viewing, setViewing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [success, setSuccess] = useState("");

  const filtered = useMemo(() => {
    return aiHistory.filter((h) => {
      if (filterProject && h.projectId !== Number(filterProject)) return false;
      if (filterTaskType && h.taskType !== filterTaskType) return false;
      if (filterDate && h.createdAt !== filterDate) return false;
      return true;
    });
  }, [aiHistory, filterProject, filterTaskType, filterDate]);

  const handleDelete = () => {
    if (confirmId == null) return;
    deleteAIInteraction(confirmId);
    setSuccess("AI history entry deleted successfully.");
    setConfirmId(null);
  };

  const hasFilters = filterProject || filterTaskType || filterDate;
  const clearFilters = () => {
    setFilterProject("");
    setFilterTaskType("");
    setFilterDate("");
  };

  const renderFullResponse = (resp) => {
    if (!resp) return null;
    const sections = [
      { title: "Requirement Understanding", body: resp.requirementUnderstanding },
      { title: "Frontend Tasks", body: resp.frontendTasks },
      { title: "Backend Tasks", body: resp.backendTasks },
      { title: "Database Tasks", body: resp.databaseTasks },
      { title: "Testing Steps", body: resp.testingSteps },
      { title: "Possible Blockers", body: resp.possibleBlockers },
      { title: "Recommended Next Action", body: resp.recommendedNextAction },
    ];
    return (
      <div className="ai-response">
        {sections.map((s) => (
          <div className="ai-response__section" key={s.title}>
            <h4>{s.title}</h4>
            {Array.isArray(s.body) ? (
              <ul>
                {s.body.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">{s.body}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="page-title">AI History</h1>

      {success && <SuccessMessage message={success} onClose={() => setSuccess("")} />}

      {/* Filters */}
      <div className="toolbar">
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
          value={filterTaskType}
          onChange={(e) => setFilterTaskType(e.target.value)}
          aria-label="Filter by AI task type"
        >
          <option value="">All AI Task Types</option>
          {aiTaskTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <input
          type="date"
          className="toolbar__select"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          aria-label="Filter by date"
        />

        {hasFilters && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No AI interactions found"
            message={hasFilters ? "Try changing or clearing the filters." : "Ask the AI Mentor a question to see interactions here."}
          />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Prompt</th>
                <th>AI Response Preview</th>
                <th>Model</th>
                <th>Task Type</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.id}>
                  <td className="text-sm muted">#{h.id}</td>
                  <td>{h.projectName}</td>
                  <td className="text-sm" style={{ maxWidth: 220 }}>
                    <div style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }} title={h.userPrompt}>
                      {h.userPrompt}
                    </div>
                  </td>
                  <td className="text-sm muted" style={{ maxWidth: 240 }}>
                    {h.responsePreview}
                  </td>
                  <td><span className="badge badge--ai">{h.modelName}</span></td>
                  <td className="text-sm">{h.taskType}</td>
                  <td className="text-sm muted">{h.createdAt}</td>
                  <td>
                    <div className="cell-actions">
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => setViewing(h)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => setConfirmId(h.id)}
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

      {viewing && (
        <Modal
          title={`AI Interaction #${viewing.id}`}
          onClose={() => setViewing(null)}
        >
          <div className="stack">
            <div>
              <span className="text-sm muted">Project</span>
              <div style={{ fontWeight: 600 }}>{viewing.projectName}</div>
            </div>
            <div>
              <span className="text-sm muted">Task Type</span>
              <div style={{ fontWeight: 600 }}>{viewing.taskType}</div>
            </div>
            <div>
              <span className="text-sm muted">User Prompt</span>
              <div className="text-sm">{viewing.userPrompt}</div>
            </div>
            <div>
              <span className="text-sm muted">Model</span>
              <div><span className="badge badge--ai">{viewing.modelName}</span></div>
            </div>
            <div>
              <span className="text-sm muted">Created</span>
              <div className="text-sm">{viewing.createdAt}</div>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid var(--color-border)" }} />
            {renderFullResponse(viewing.fullResponse)}
          </div>
        </Modal>
      )}

      {confirmId != null && (
        <ConfirmDialog
          title="Delete AI history?"
          message="This interaction will be permanently removed from AI History."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
