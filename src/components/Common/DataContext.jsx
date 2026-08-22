import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createProject as createProjectRequest,
  createTask as createTaskRequest,
  deleteAIInteraction as deleteAIInteractionRequest,
  deleteProject as deleteProjectRequest,
  deleteTask as deleteTaskRequest,
  getAIHistory,
  getProjects,
  getTasks,
  saveAIInteraction,
  updateProject as updateProjectRequest,
  updateTask as updateTaskRequest,
  updateTaskStatus as updateTaskStatusRequest,
} from "../../services/api";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [aiHistory, setAiHistory] = useState([]);

  useEffect(() => {
    Promise.all([getProjects(), getTasks(), getAIHistory()]).then(
      ([loadedProjects, loadedTasks, loadedHistory]) => {
        setProjects(loadedProjects);
        setTasks(loadedTasks);
        setAiHistory(loadedHistory);
      }
    );
  }, []);

  // ---- Project helpers ----
  const createProject = async (data) => {
    const project = await createProjectRequest(data);
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const updateProject = async (id, data) => {
    const project = await updateProjectRequest(id, data);
    setProjects((prev) =>
      prev.map((item) => (item.id === id ? project : item))
    );
    return project;
  };

  const deleteProject = async (id) => {
    await deleteProjectRequest(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  };

  // ---- Task helpers ----
  const createTask = async (data) => {
    const task = await createTaskRequest(data);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const updateTask = async (id, data) => {
    const task = await updateTaskRequest(id, data);
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? task : item))
    );
    return task;
  };

  const updateTaskStatus = async (id, status) => {
    const task = await updateTaskStatusRequest(id, status);
    setTasks((prev) =>
      prev.map((item) => (item.id === id ? task : item))
    );
    return task;
  };

  const deleteTask = async (id) => {
    await deleteTaskRequest(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ---- AI history helpers ----
  const addAIInteraction = async (interaction) => {
    const record = await saveAIInteraction(interaction);
    setAiHistory((prev) => [record, ...prev]);
    return record;
  };

  const deleteAIInteraction = async (id) => {
    await deleteAIInteractionRequest(id);
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
