// ===========================================================
// AI Project Mentor — Mock data for the frontend prototype
// Later this will be replaced by real FastAPI API calls.
// ===========================================================

export const mockProjects = [
  {
    id: 1,
    name: "Student Placement Portal",
    description:
      "A web portal where students can register, upload their resumes, and apply for campus placement drives. Admins can post openings and shortlist candidates.",
    techStack: ["React", "FastAPI", "SQL Server", "Ollama"],
    createdAt: "2026-07-04",
  },
  {
    id: 2,
    name: "Hospital Appointment System",
    description:
      "An appointment booking system that lets patients book slots with doctors, receive reminders, and lets doctors manage their daily schedules.",
    techStack: ["React", "FastAPI", "SQL Server"],
    createdAt: "2026-07-21",
  },
  {
    id: 3,
    name: "AI Resume Mentor",
    description:
      "An AI-powered resume review tool that analyses a student's resume and gives personalised improvement suggestions using a GPT-OSS model.",
    techStack: ["React", "FastAPI", "SQL Server", "GPT-OSS"],
    createdAt: "2026-08-02",
  },
];

export const mockTasks = [
  {
    id: 1,
    projectId: 1,
    title: "Design student registration form",
    description: "Create the React form for student signup with validation.",
    priority: "High",
    status: "Completed",
    aiGenerated: false,
    createdAt: "2026-07-05",
    updatedAt: "2026-07-09",
  },
  {
    id: 2,
    projectId: 1,
    title: "Build resume upload API endpoint",
    description: "FastAPI endpoint that accepts PDF resume uploads and stores them.",
    priority: "High",
    status: "In Progress",
    aiGenerated: false,
    createdAt: "2026-07-10",
    updatedAt: "2026-08-12",
  },
  {
    id: 3,
    projectId: 1,
    title: "Create admin placement drive page",
    description: "Dashboard page for admins to create and manage placement drives.",
    priority: "Medium",
    status: "Pending",
    aiGenerated: true,
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15",
  },
  {
    id: 4,
    projectId: 1,
    title: "Implement shortlisting logic",
    description: "Backend logic to shortlist students based on eligibility criteria.",
    priority: "Medium",
    status: "Pending",
    aiGenerated: true,
    createdAt: "2026-07-18",
    updatedAt: "2026-07-18",
  },
  {
    id: 5,
    projectId: 2,
    title: "Design doctor availability calendar",
    description: "Calendar UI showing available and booked slots for each doctor.",
    priority: "High",
    status: "In Progress",
    aiGenerated: false,
    createdAt: "2026-07-22",
    updatedAt: "2026-08-14",
  },
  {
    id: 6,
    projectId: 2,
    title: "Build patient login and signup",
    description: "Authentication screens for patients using email and password.",
    priority: "Medium",
    status: "Completed",
    aiGenerated: false,
    createdAt: "2026-07-24",
    updatedAt: "2026-08-01",
  },
  {
    id: 7,
    projectId: 2,
    title: "Create appointment booking API",
    description: "FastAPI endpoint to create, update and cancel appointments.",
    priority: "High",
    status: "Pending",
    aiGenerated: true,
    createdAt: "2026-07-28",
    updatedAt: "2026-07-28",
  },
  {
    id: 8,
    projectId: 3,
    title: "Integrate GPT-OSS resume analysis",
    description: "Connect the FastAPI backend to the GPT-OSS model for resume feedback.",
    priority: "High",
    status: "In Progress",
    aiGenerated: true,
    createdAt: "2026-08-03",
    updatedAt: "2026-08-15",
  },
  {
    id: 9,
    projectId: 3,
    title: "Build resume feedback UI",
    description: "Display structured AI feedback in a clean, readable layout.",
    priority: "Low",
    status: "Pending",
    aiGenerated: false,
    createdAt: "2026-08-06",
    updatedAt: "2026-08-06",
  },
  {
    id: 10,
    projectId: 3,
    title: "Add resume history page",
    description: "Let students view their previously analysed resumes and scores.",
    priority: "Low",
    status: "Completed",
    aiGenerated: false,
    createdAt: "2026-08-08",
    updatedAt: "2026-08-16",
  },
];

export const mockAIHistory = [
  {
    id: 1,
    projectId: 1,
    projectName: "Student Placement Portal",
    taskType: "Break Requirement into Tasks",
    userPrompt:
      "I need a feature where students can track the status of each application they submit.",
    responsePreview:
      "Frontend: application status tracker page. Backend: GET /applications/status. Database: status column on applications table...",
    modelName: "gpt-oss-20b",
    createdAt: "2026-07-20",
    fullResponse: {
      requirementUnderstanding:
        "The student should see a live status (Submitted, Under Review, Shortlisted, Rejected) for every application.",
      frontendTasks: [
        "Create an 'Application Status' page in the student dashboard.",
        "Add a status badge component for each application row.",
        "Poll the backend every 30 seconds for status updates.",
      ],
      backendTasks: [
        "Add GET /api/applications/status?student_id=... endpoint.",
        "Return the latest status for each application.",
      ],
      databaseTasks: [
        "Add a 'status' column to the applications table.",
        "Create an application_status_log table for history.",
      ],
      testingSteps: [
        "Verify status updates when an admin shortlists a student.",
        "Test the page with 0, 1 and many applications.",
      ],
      possibleBlockers: [
        "Real-time updates may need websockets for large scale.",
        "Status values must be agreed with the admin team.",
      ],
      recommendedNextAction:
        "Start with the backend endpoint so the frontend has data to display.",
    },
  },
  {
    id: 2,
    projectId: 2,
    projectName: "Hospital Appointment System",
    taskType: "Identify Project Blockers",
    userPrompt:
      "What could go wrong with the appointment booking flow when many patients book at the same time?",
    responsePreview:
      "Concurrency: two patients booking the same slot. Database: missing unique constraint. UX: no loading state...",
    modelName: "gpt-oss-20b",
    createdAt: "2026-08-01",
    fullResponse: {
      requirementUnderstanding:
        "Identify risks in the booking flow under concurrent usage.",
      frontendTasks: [
        "Add a loading state on the 'Book' button to prevent double clicks.",
        "Show a clear error if the slot was just taken.",
      ],
      backendTasks: [
        "Use a database transaction when creating an appointment.",
        "Return a clear 409 Conflict if the slot is already booked.",
      ],
      databaseTasks: [
        "Add a unique constraint on (doctor_id, slot_datetime).",
        "Index the appointments table by slot_datetime.",
      ],
      testingSteps: [
        "Simulate two concurrent bookings for the same slot.",
        "Test cancelling and rebooking a slot.",
      ],
      possibleBlockers: [
        "Race conditions if transactions are not used.",
        "Time zone mismatches between patient and doctor.",
      ],
      recommendedNextAction:
        "Add the unique constraint first, it is the cheapest safety net.",
    },
  },
  {
    id: 3,
    projectId: 3,
    projectName: "AI Resume Mentor",
    taskType: "Generate Testing Checklist",
    userPrompt: "Give me a testing checklist for the resume analysis feature.",
    responsePreview:
      "Unit tests for parsing, integration test for the GPT-OSS call, UI test for feedback display, load test...",
    modelName: "gpt-oss-20b",
    createdAt: "2026-08-10",
    fullResponse: {
      requirementUnderstanding:
        "Produce a complete testing checklist for the resume analysis feature.",
      frontendTasks: [
        "Verify the feedback card renders all sections.",
        "Test loading and error states when the model is slow.",
      ],
      backendTasks: [
        "Unit test the PDF parsing function.",
        "Integration test the GPT-OSS call with a mock response.",
      ],
      databaseTasks: [
        "Test that analysis results are saved and retrievable.",
        "Test history pagination.",
      ],
      testingSteps: [
        "Upload a valid PDF and check feedback is displayed.",
        "Upload a non-PDF file and confirm an error is shown.",
        "Load test with 10 concurrent uploads.",
      ],
      possibleBlockers: [
        "Model response time may exceed the API timeout.",
        "Large PDFs may fail to parse.",
      ],
      recommendedNextAction:
        "Write the PDF parsing unit tests first as they are quick to add.",
    },
  },
  {
    id: 4,
    projectId: 1,
    projectName: "Student Placement Portal",
    taskType: "Recommend Next Task",
    userPrompt: "What should I work on next for the placement portal?",
    responsePreview:
      "Resume upload API is in progress and blocks the resume screen. Focus on finishing it next...",
    modelName: "gpt-oss-20b",
    createdAt: "2026-08-15",
    fullResponse: {
      requirementUnderstanding:
        "Recommend the most valuable next task based on current project state.",
      frontendTasks: [
        "After the upload API, build the student resume list page.",
      ],
      backendTasks: [
        "Finish the resume upload endpoint, it is currently in progress.",
      ],
      databaseTasks: [
        "Ensure the resumes table has a file path and uploaded_at column.",
      ],
      testingSteps: [
        "Test uploading a 1MB and a 5MB PDF.",
        "Test retrieving a previously uploaded resume.",
      ],
      possibleBlockers: [
        "File storage location must be decided before the endpoint ships.",
      ],
      recommendedNextAction:
        "Complete the resume upload API endpoint, it unblocks two other tasks.",
    },
  },
];

// The options shown in the AI Mentor "AI Task Type" dropdown.
export const aiTaskTypes = [
  "Generate Project Plan",
  "Break Requirement into Tasks",
  "Recommend Next Task",
  "Identify Project Blockers",
  "Explain Implementation",
  "Generate Testing Checklist",
];

// The model name shown in the UI for mock responses.
export const mockModelName = "gpt-oss-20b";

// Build a realistic mock AI response based on the requirement text.
export function buildMockAIResponse(requirement, taskType) {
  const req = requirement || "the selected requirement";
  return {
    requirementUnderstanding: `You asked the AI Mentor to "${taskType}" for: ${req}. Below is a structured, beginner-friendly breakdown.`,
    frontendTasks: [
      "Create a clean, responsive page for this feature using React.",
      "Add form validation and clear error messages for user inputs.",
      "Show loading indicators while waiting for the backend response.",
    ],
    backendTasks: [
      "Add a FastAPI route that accepts the request and validates inputs.",
      "Write a service function that performs the core business logic.",
      "Return consistent JSON responses with a success or error flag.",
    ],
    databaseTasks: [
      "Create or update the required table with proper columns.",
      "Add a primary key, foreign keys and indexes where needed.",
      "Use parameterised queries to prevent SQL injection.",
    ],
    testingSteps: [
      "Test the happy path with valid input.",
      "Test edge cases such as empty or very long input.",
      "Test error handling when the database is unavailable.",
    ],
    possibleBlockers: [
      "External API rate limits may slow down the feature.",
      "Large inputs may need pagination or chunked processing.",
    ],
    recommendedNextAction:
      "Start with the backend route so the frontend has real data to display.",
  };
}
