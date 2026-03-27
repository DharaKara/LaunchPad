import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCareerResult } from "../data/mockCareerResult";

const questions = [
  {
    name: "background",
    label: "Your professional background",
    placeholder: "Describe your education, experience, or current role.",
    hint: "This helps us match you to careers that fit your journey.",
  },
  {
    name: "field_of_study",
    label: "Field of study or focus",
    placeholder: "What did you study? What topics excite you most?",
    hint: "Use keywords like Product, Design, Engineering, Marketing, Finance.",
  },
  {
    name: "interests",
    label: "Core interests",
    placeholder: "What activities or subjects energize you?",
    hint: "Examples: technology, people, analytics, creativity, strategy.",
  },
  {
    name: "strengths",
    label: "Top strengths",
    placeholder: "What are you naturally good at?",
    hint: "Include skills like problem solving, communication, leadership.",
  },
  {
    name: "preferences",
    label: "Work preferences",
    placeholder: "What environment, schedule, or team style fits you?",
    hint: "Remote, collaborative, fast-paced, independent, impact-driven.",
  },
  {
    name: "goal",
    label: "Career goal",
    placeholder: "What outcome do you want from your next step?",
    hint: "Share your ambition: growth, stability, leadership, transition.",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    background: "",
    field_of_study: "",
    interests: "",
    strengths: "",
    preferences: "",
    goal: "",
  });

  const completed = useMemo(
    () => Object.values(form).filter((value) => value.trim().length > 0).length,
    [form],
  );

  const progress = Math.round((completed / questions.length) * 100);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = () => {
    navigate("/career-results", { state: mockCareerResult });
  };

  return (
    <main className="onboarding-page">
      <section className="onboarding-header">
        <div>
          <span className="onboarding-tag">Career questionnaire</span>
          <h1 className="onboarding-title">Build your tailored career profile</h1>
          <p className="onboarding-copy">
            Answer a few quick questions so we can recommend the best roles, skills, and next steps for your career.
          </p>
        </div>
        <div className="onboarding-summary">
          <strong>{completed}/6 completed</strong>
          <p>Fast, focused insights based on your answers.</p>
        </div>
      </section>

      <section className="onboarding-card">
        <div className="onboarding-progress">
          <span className="progress-label">Progress: {progress}%</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="question-grid">
          {questions.map((question) => {
            const isLong = question.name !== "background" && question.name !== "field_of_study";
            const value = form[question.name];

            return (
              <label className="question-field" key={question.name} htmlFor={question.name}>
                <span>{question.label}</span>
                {isLong ? (
                  <textarea
                    id={question.name}
                    name={question.name}
                    placeholder={question.placeholder}
                    value={value}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    id={question.name}
                    type="text"
                    name={question.name}
                    placeholder={question.placeholder}
                    value={value}
                    onChange={handleChange}
                  />
                )}
                <span className="question-hint">{question.hint}</span>
              </label>
            );
          })}
        </div>

        <div className="onboarding-actions">
          <button
            type="button"
            className="onboarding-btn secondary-outline"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Review questions
          </button>
          <button type="button" className="onboarding-btn" onClick={handleSubmit}>
            See career matches
          </button>
        </div>
      </section>
    </main>
  );
}
