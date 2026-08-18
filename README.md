# AI Project Mentor

A beginner-friendly full-stack training application where users can manage
software projects, track development tasks, and ask an AI mentor to break
requirements into actionable tasks.

## Application objective

AI Project Mentor helps students learning full-stack development practise
project and task management. Users can:

- Create and manage software projects.
- Add development tasks to a project.
- Update task priorities and statuses.
- View project progress through a dashboard.
- Ask an AI mentor to break requirements into development tasks.
- View previous AI interactions.

This repository contains the **frontend only**. It runs on mock data so it
works without any backend. It is prepared to connect later to a Python backend.

## Technology stack (frontend)

- HTML5
- CSS3
- JavaScript ES6+
- React.js (functional components and hooks)
- Vite (React build tool)
- React Router DOM (navigation)
- Axios (prepared for future backend API calls)

## Current frontend features

- Responsive sidebar navigation with a collapsible mobile menu.
- Clean top header with page title, search box, notifications and profile.
- Dashboard with summary cards, project progress, recent tasks and an AI
  recommended next task.
- Projects page with create, edit, view and delete (with confirmation dialog).
- Project details page with overall progress and the project's task list.
- Tasks page with filters (project, priority, status), search, inline status
  changes, and create / edit / delete.
- AI Mentor page that produces a structured mock AI response with the
  sections: Requirement Understanding, Frontend Tasks, Backend Tasks, Database
  Tasks, Testing Steps, Possible Blockers and Recommended Next Action.
- AI History page with filters and a full-response viewer.
- Reusable UI components: LoadingSpinner, ErrorMessage, SuccessMessage,
  EmptyState, ConfirmDialog, Modal, ProgressBar, badges.
- Works fully on mock data. No backend or database required.

## Planned backend technologies

- Python
- FastAPI (REST APIs)
- SQL Server (database)
- Ollama Cloud API using a GPT-OSS model

The frontend is already structured to call these future FastAPI endpoints:

```
GET    /api/health
GET    /api/dashboard
GET    /api/projects
POST   /api/projects
GET    /api/projects/{project_id}
PUT    /api/projects/{project_id}
DELETE /api/projects/{project_id}
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/{task_id}
PUT    /api/tasks/{task_id}
PATCH  /api/tasks/{task_id}/status
DELETE /api/tasks/{task_id}
POST   /api/ai/plan
POST   /api/ai/next-task
GET    /api/ai/history/{project_id}
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Folder structure

```
src/
  components/
    Layout/        App shell: sidebar, header, layout wrapper
    Dashboard/     (dashboard sections live inside the dashboard page)
    Projects/      Project form (create / edit)
    Tasks/         Task form (create / edit)
    AI/            (AI UI lives inside the AI Mentor and AI History pages)
    Common/        Reusable UI: badges, spinner, messages, modal, confirm dialog
  pages/
    DashboardPage.jsx
    ProjectsPage.jsx
    ProjectDetailsPage.jsx
    TasksPage.jsx
    AIMentorPage.jsx
    AIHistoryPage.jsx
    NotFoundPage.jsx
  services/
    api.js         Axios functions for the future FastAPI backend
  data/
    mockData.js    Mock projects, tasks and AI interactions
  styles/
    global.css     All application styles and the colour theme
  App.jsx          Routes configuration
  main.jsx         App entry point
```

## Environment variables

Copy `.env.example` to `.env` and adjust if needed:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_USE_MOCK_DATA=true
```

- `VITE_API_BASE_URL` — base URL of the future Python FastAPI backend.
- `VITE_USE_MOCK_DATA` — when `true`, the app uses mock data. Set to `false`
  after the backend is ready so `src/services/api.js` functions are used.

Never put the Ollama API key, database username, database password or SQL
Server connection string in the frontend. Those belong only in the Python
backend.

## Future FastAPI integration plan

1. Build the FastAPI backend with the endpoints listed above.
2. Keep the Ollama / GPT-OSS API key in the backend only. The frontend never
   calls Ollama directly.
3. In the frontend, set `VITE_USE_MOCK_DATA=false`.
4. Replace the mock data operations in `src/components/Common/DataContext.jsx`
   with calls to the functions already prepared in `src/services/api.js`.
5. Add error handling so the UI shows friendly messages such as "Unable to
   connect to the backend." or "AI Mentor is temporarily unavailable."
