import { createContext, useContext, useMemo, useState } from "react";
import {
  mockProjects,
  mockTasks,
  mockAIHistory,
} from "../../data/mockData";

const DataContext = createContext(null);

// This provider holds all projects, tasks and AI interactions in React state.
// For now it is seeded from mock data. When the FastAPI backend is ready,
// replace the inline operations below with calls to src/services/api.js.
export function DataProvider({ children }) {
  const [projects, setProjects] = useState(mockProjects);
  const [tasks, setTasks] = useState(mockTasks);
  const [aiHistory, setAiHistory] = useState(mockAIHistory);

  // ---- Project helpers ----
  const createProject = (data) => {
    const id = projects.reduce((m, p) => Math.max(m, p.id), 0) + 1;
    const today = new Date().toISOString().slice(0, 10);
    const project = { id, createdAt: today, ...data };
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const updateProject = (id, data) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  };

  // ---- Task helpers ----
  const createTask = (data) => {
    const id = tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1;
    const today = new Date().toISOString().slice(0, 10);
    const task = {
      id,
      createdAt: today,
      updatedAt: today,
      aiGenerated: false,
      ...data,
    };
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const updateTask = (id, data) => {
    const today = new Date().toISOString().slice(0, 10);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: today } : t
      )
    );
  };

  const updateTaskStatus = (id, status) => {
    const today = new Date().toISOString().slice(0, 10);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: today } : t
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ---- AI history helpers ----
  const addAIInteraction = (interaction) => {
    const id = aiHistory.reduce((m, h) => Math.max(m, h.id), 0) + 1;
    const today = new Date().toISOString().slice(0, 10);
    const record = { id, createdAt: today, ...interaction };
    setAiHistory((prev) => [record, ...prev]);
    return record;
  };

  const deleteAIInteraction = (id) => {
    setAiHistory((prev) => prev.filter((h) => h.id !== id));
  };

  // Tasks belonging to a single project.
  const tasksByProject = (projectId) =>
    tasks.filter((t) => t.projectId === projectId);

  // Project lookup helper.
  const getProjectById = (id) => projects.find((p) => p.id === Number(id));

  const value = useMemo(
    () => ({
      projects,
      tasks,
      aiHistory,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
      addAIInteraction,
      deleteAIInteraction,
      tasksByProject,
      getProjectById,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, tasks, aiHistory]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Custom hook so components can access the shared data easily.
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used inside a DataProvider");
  }
  return ctx;
}
