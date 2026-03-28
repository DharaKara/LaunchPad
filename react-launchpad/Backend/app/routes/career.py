from typing import List
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class AptitudeAnswer(BaseModel):
    question_id: str
    selected_option: str


class CharacterAnswer(BaseModel):
    trait_id: str
    score: int


class CareerDiagnosticRequest(BaseModel):
    user_status: str
    current_role_or_degree: str
    interests: List[str]
    strengths: List[str]
    preferences: List[str]
    aptitude_answers: List[AptitudeAnswer]
    character_answers: List[CharacterAnswer]


@router.post("/analyze-career-diagnostic")
def analyze_career_diagnostic(payload: CareerDiagnosticRequest):
    unique_interests = len(set(payload.interests))
    unique_strengths = len(set(payload.strengths))
    preference_bonus = len(set(payload.preferences))
    aptitude_score = 50 + sum(1 for answer in payload.aptitude_answers if answer.selected_option in {"A", "B"}) * 6
    aptitude_score = min(100, max(35, aptitude_score))
    character_score = sum(answer.score for answer in payload.character_answers)
    confidence = min(95, max(55, 50 + unique_interests * 4 + unique_strengths * 3 + preference_bonus * 2 + int(character_score / max(len(payload.character_answers), 1))))

    role = "Data Analyst"
    if payload.user_status == "student":
        role = "Junior Data Analyst"
    elif payload.user_status == "professional":
        role = "Business Analyst"
    elif payload.user_status == "unemployed":
        role = "Growth Analyst"

    if "design" in payload.current_role_or_degree.lower() or "creative" in payload.current_role_or_degree.lower():
        role = "UX Research Analyst"
    if any(tag in " ".join(payload.interests).lower() for tag in ["product", "strategy", "marketing"]):
        role = "Product Analyst"

    return {
        "career_match": {
            "role": role,
            "confidence": confidence,
            "reason": "Your profile shows strong analytical and communication potential for this role.",
            "summary": "Based on your current background and preferences, you are well-positioned to move into a fast-growth business intelligence or analytics role.",
            "aptitude_score": aptitude_score,
        },
        "skill_gaps": [
            {
                "skill": "Advanced data storytelling",
                "priority": "High",
                "detail": "You can strengthen your ability to communicate technical results to non-technical stakeholders.",
                "recommendation": "Build one portfolio case study with narrative insights.",
            },
            {
                "skill": "Modern tooling",
                "priority": "Medium",
                "detail": "Adding experience with analytics tools will improve your career fit.",
                "recommendation": "Practice with SQL, Tableau, or Python analytics projects.",
            },
            {
                "skill": "Stakeholder collaboration",
                "priority": "Low",
                "detail": "Formalizing teamwork habits will make project handoffs smoother.",
                "recommendation": "Volunteer for a cross-functional project or mentoring role.",
            },
        ],
        "roadmap": {
            "immediate": [
                "Write one resume bullet for a measurable analytics result.",
                "Choose a small project to showcase your top strength.",
            ],
            "intermediate": [
                "Complete a short course in data visualization or business intelligence.",
                "Prepare a concise career pitch for networking conversations.",
            ],
        },
    }
