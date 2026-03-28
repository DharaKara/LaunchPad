from typing import List, Optional
from uuid import uuid4
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class SimulateCvInitiateRequest(BaseModel):
    cv_text: str
    job_description: str
    target_role: str


class InterviewAnswer(BaseModel):
    question_id: str
    answer_text: str


class SimulateCvVerdictRequest(BaseModel):
    session_id: str
    cv_text: str
    job_description: str
    target_role: str
    answers: List[InterviewAnswer]


class ImproveCvRequest(BaseModel):
    cv_text: str
    job_description: str


@router.post("/simulate-cv-initiate")
def simulate_cv_initiate(payload: SimulateCvInitiateRequest):
    session_id = str(uuid4())
    questions = [
        {
            "id": "q1",
            "category": "Experience",
            "question_text": "Describe a time when you solved a difficult problem in your role.",
        },
        {
            "id": "q2",
            "category": "Impact",
            "question_text": "How did your work support the team’s goals or improve outcomes?",
        },
        {
            "id": "q3",
            "category": "Skills",
            "question_text": "What tools or methods do you use to keep your work aligned with this target role?",
        },
    ]
    return {
        "session_id": session_id,
        "questions": questions,
    }


@router.post("/simulate-cv-verdict")
def simulate_cv_verdict(payload: SimulateCvVerdictRequest):
    base_score = 65
    answer_bonus = min(15, len(payload.answers) * 4)
    keyword_bonus = 5 if payload.target_role else 0
    score = max(35, min(95, base_score + answer_bonus + keyword_bonus))

    missing_keywords = [
        keyword
        for keyword in ["collaboration", "stakeholder", "data", "optimization"]
        if keyword not in payload.cv_text.lower() and keyword in payload.job_description.lower()
    ]

    if len(missing_keywords) == 0:
        missing_keywords = ["None detected"]

    rejection_reasons = []
    if score < 70:
        rejection_reasons.append("Resume lacks strong alignment with the target role.")
    if "experience" not in payload.cv_text.lower():
        rejection_reasons.append("Your resume could use more explicit achievement language.")
    if score >= 85:
        rejection_reasons = ["Your resume is well-prepared for initial screening."]

    return {
        "ats_scan": {
            "score": score,
            "missing_keywords": [kw for kw in missing_keywords if kw != "None detected"],
        },
        "shortlist_decision": "Recommend for recruiter review" if score >= 70 else "Needs stronger role fit",
        "rejection_reasons": rejection_reasons or ["No immediate rejection signals detected."],
        "funnel_stages": [
            {"stage": "Resume screen", "status": "Passed" if score >= 60 else "At risk"},
            {"stage": "Telephone screen", "status": "Likely" if score >= 70 else "Uncertain"},
            {"stage": "Hiring manager", "status": "Possible" if score >= 80 else "Challenging"},
        ],
        "post_mortem": "Your CV is a strong starting point. Add keywords from the job description and emphasize impact metrics.",
        "improvement_roadmap": [
            "Add at least two measurable achievements to your experience section.",
            "Match your resume language more closely to the job description.",
        ],
    }


@router.post("/improve-cv")
def improve_cv(payload: ImproveCvRequest):
    new_score = max(75, min(98, 60 + len(payload.cv_text.split()) // 25))
    bullets = [
        "Turn general responsibilities into quantified accomplishments.",
        "Use strong action verbs to lead each bullet.",
        "Highlight project outcomes that match the job description.",
    ]

    return {
        "improved_summary": "Your CV can become more ATS-ready by emphasizing measurable results and role-specific keywords.",
        "improved_bullets": bullets,
        "new_score": new_score,
        "new_decision": "Ready for another screening round" if new_score >= 80 else "Improve resume focus and keywords",
    }
