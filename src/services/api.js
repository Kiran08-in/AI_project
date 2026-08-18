// ===========================================================
// AI Project Mentor — Axios API service
// This file prepares reusable functions for the future
// Python (FastAPI) backend. While VITE_USE_MOCK_DATA is "true",
// the app uses src/data/mockData.js instead of these calls.
//
// To switch to the real backend later:
//   1. Set VITE_USE_MOCK_DATA=false in your .env file.
//   2. Make sure VITE_API_BASE_URL points to your FastAPI server.
//   3. The functions below will then be called by the pages.
//
// IMPORTANT: Never put AI API keys or database credentials here.
// Those belong only in the Python backend.
// ===========================================================

import axios from "axios";

// Read backend URL from the environment. Falls back to local dev URL.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Whether the app should use mock data instead of real API calls.
export const USE_MOCK_DATA =
  String(import.meta.env.VITE_USE_MOCK_DATA ?? "true").toLowerCase() === "true";

// Shared axios instance so every request uses the same base URL.
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ---------- Backend health ----------

export async function checkBackendHealth() {
  const res = await apiClient.get("/api/health");
  return res.data;
}

// ---------- Dashboard ----------

export async function getDashboardStatistics() {
  const res = await apiClient.get("/api/dashboard");
  return res.data;
}

// ---------- Projects ----------

export async function getProjects() {
  const res = await apiClient.get("/api/projects");
  return res.data;
}

export async function getProjectById(projectId) {
  const res = await apiClient.get(`/api/projects/${projectId}`);
  return res.data;
}

export async function createProject(projectData) {
  const res = await apiClient.post("/api/projects", projectData);
  return res.data;
}

export async function updateProject(projectId, projectData) {
  const res = await apiClient.put(`/api/projects/${projectId}`, projectData);
  return res.data;
}

export async function deleteProject(projectId) {
  const res = await apiClient.delete(`/api/projects/${projectId}`);
  return res.data;
}

// ---------- Tasks ----------

export async function getTasks() {
  const res = await apiClient.get("/api/tasks");
  return res.data;
}

export async function getTaskById(taskId) {
  const res = await apiClient.get(`/api/tasks/${taskId}`);
  return res.data;
}

export async function createTask(taskData) {
  const res = await apiClient.post("/api/tasks", taskData);
  return res.data;
}

export async function updateTask(taskId, taskData) {
  const res = await apiClient.put(`/api/tasks/${taskId}`, taskData);
  return res.data;
}

export async function updateTaskStatus(taskId, status) {
  const res = await apiClient.patch(`/api/tasks/${taskId}/status`, { status });
  return res.data;
}

export async function deleteTask(taskId) {
  const res = await apiClient.delete(`/api/tasks/${taskId}`);
  return res.data;
}

// ---------- AI Mentor ----------

export async function generateAIPlan(requestData) {
  const res = await apiClient.post("/api/ai/plan", requestData);
  return res.data;
}

export async function recommendNextTask(requestData) {
  const res = await apiClient.post("/api/ai/next-task", requestData);
  return res.data;
}

export async function getAIHistory(projectId) {
  const url = projectId
    ? `/api/ai/history/${projectId}`
    : "/api/ai/history";
  const res = await apiClient.get(url);
  return res.data;
}

export { BASE_URL };
