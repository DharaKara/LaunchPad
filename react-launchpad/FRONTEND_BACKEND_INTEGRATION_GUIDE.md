# Frontend-Backend Integration Guide

This file contains the exact endpoints, request structures, and UI notes for the Career Intelligence OS frontend integration.

## 1. Connection Details

- Base URL: `http://localhost:8000`
- Content-Type: `application/json`
- CORS: Enabled (Supports React running on any port)

## 2. Feature: Career Diagnostic (The Onboarding)

- Endpoint: `POST /api/analyze-career-diagnostic`

### Request

React needs to collect the Aptitude answers (`q1`-`q5`) and Character traits (Likert `1`-`5`).

```json
{
  "user_status": "student", // Pattern: "student", "professional", or "unemployed"
  "current_role_or_degree": "BSc Computer Science",
  "interests": ["Data Scientist"],
  "strengths": ["Logic", "Python"],
  "preferences": ["Remote", "Structured"],
  "aptitude_answers": [
    {"question_id": "q1", "selected_option": "A"},
    {"question_id": "q2", "selected_option": "C"},
    {"question_id": "q3", "selected_option": "B"},
    {"question_id": "q4", "selected_option": "D"},
    {"question_id": "q5", "selected_option": "A"}
  ],
  "character_answers": [
    {"trait_id": "leadership", "score": 3},
    {"trait_id": "logic", "score": 5},
    {"trait_id": "detail", "score": 5},
    {"trait_id": "creativity", "score": 4},
    {"trait_id": "risk", "score": 2},
    {"trait_id": "extroversion", "score": 3}
  ]
}
```

### Response

- UI Tip: Use `intelligence_report` to build progress bars or spider charts.
- `career_match.confidence`: Build a gauge chart.
- `cognitive_depth`: Build a 3-bar chart (Logic, Math, Verbal).
- `psychometric_alignment`: Shows personality fit vs industry standard.

## 3. Feature: The Hiring Simulator (Phase 1: Initiation)

- Endpoint: `POST /api/simulate-cv-initiate`

### Request

React should provide two textareas (one for CV, one for JD) and a dropdown for the role.

```json
{
  "cv_text": "...",
  "job_description": "...",
  "target_role": "Software Engineer"
}
```

### Response

The backend returns 10 Interrogation Questions. React should show these one-by-one or in a list.

```json
{
  "session_id": "uuid-string-here",
  "questions": [
    { "id": 1, "category": "Behavioral", "question_text": "..." },
    { "id": 6, "category": "Technical", "question_text": "..." }
  ]
}
```

## 4. Feature: The Hiring Simulator (Phase 2: The Verdict)

- Endpoint: `POST /api/simulate-cv-verdict`

### Request

React sends back the 10 user answers.

```json
{
  "session_id": "uuid-string-here",
  "cv_text": "...",
  "job_description": "...",
  "target_role": "Software Engineer",
  "answers": [
    { "question_id": 1, "answer_text": "..." },
    { "question_id": 2, "answer_text": "..." }
  ]
}
```

### Response (The "Wow" Factor)

- UI Tip: Use `funnel_stages` to build a visual hiring pipeline.
- Green checkmarks for `CLEARED` stages.
- Red X for `DROPPED` stages.
- `post_mortem`: Display this as a "Brutally Honest Feedback" section.

## 5. Feature: CV Optimizer (ATS High-Scorer)

- Endpoint: `POST /api/improve-cv`

### Request

```json
{
  "cv_text": "...",
  "job_description": "..."
}
```

### Response

React should show the "Old CV" vs "Improved CV" side-by-side.

```json
{
  "improved_summary": "...",
  "improved_bullets": ["Bullet 1", "Bullet 2"],
  "new_score": 85,
  "new_decision": "Shortlisted"
}
```

## 6. Logic Keys for React (Aptitude Test)

Your React dev can use this key to inform the user of the correct answers after they finish the diagnostic:

- `q1`: A (Logic)
- `q2`: C (Math)
- `q3`: B (Verbal)
- `q4`: D (Pattern)
- `q5`: A (Tech Logic)

## 7. Global Error Handling

If the backend returns a `500` error, it will include an `audit_note` field. React should catch this and show a `Logic Error: Data Mismatch` message.

## Summary for the Frontend Dev

- Onboarding: Gather user data -> call `/api/analyze-career-diagnostic` -> show the Intelligence Report Dashboard.
- Simulator: Upload CV/JD -> call `/api/simulate-cv-initiate` -> show 10 questions -> gather answers -> call `/api/simulate-cv-verdict` -> show the Funnel Autopsy.
- Optimization: Paste CV/JD -> call `/api/improve-cv` -> show optimized text.
