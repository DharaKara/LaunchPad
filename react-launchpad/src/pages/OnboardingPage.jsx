import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "../utils/api";

const questions = [
  {
    name: "user_status",
    label: "Current status",
    type: "select",
    options: ["student", "professional", "unemployed"],
    hint: "Choose the category that best describes your current status.",
  },
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
    user_status: "student",
    background: "",
    field_of_study: "",
    interests: "",
    strengths: "",
    preferences: "",
    goal: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const completed = useMemo(
    () => Object.values(form).filter((value) => value.trim().length > 0).length,
    [form],
  );

  const progress = Math.round((completed / questions.length) * 100);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const splitValues = (value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const defaultAptitudeAnswers = [
    { question_id: "q1", selected_option: "A" },
    { question_id: "q2", selected_option: "C" },
    { question_id: "q3", selected_option: "B" },
    { question_id: "q4", selected_option: "D" },
    { question_id: "q5", selected_option: "A" },
  ];

  const defaultCharacterAnswers = [
    { trait_id: "leadership", score: 3 },
    { trait_id: "logic", score: 5 },
    { trait_id: "detail", score: 5 },
    { trait_id: "creativity", score: 4 },
    { trait_id: "risk", score: 2 },
    { trait_id: "extroversion", score: 3 },
  ];

  const handleSubmit = async () => {
    const requestPayload = {
      user_status: form.user_status,
      current_role_or_degree: form.field_of_study || form.background,
      interests: splitValues(form.interests),
      strengths: splitValues(form.strengths),
      preferences: splitValues(form.preferences),
      aptitude_answers: defaultAptitudeAnswers,
      character_answers: defaultCharacterAnswers,
    };

    try {
      setSubmitting(true);
      setSubmitError("");
      const response = await postJson("/api/analyze-career-diagnostic", requestPayload);
      navigate("/career-results", { state: response });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
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

        {submitError && (
          <div className="alert-banner" role="alert" aria-live="assertive">
            {submitError}
          </div>
        )}

        <div className="question-grid">
          {questions.map((question) => {
            const isLong = question.name !== "background" && question.name !== "field_of_study" && question.type !== "select";
            const isSelect = question.type === "select";
            const value = form[question.name];

            return (
              <label className="question-field" key={question.name} htmlFor={question.name}>
                <span>{question.label}</span>
                {isSelect ? (
                  <select id={question.name} name={question.name} value={value} onChange={handleChange}>
                    {question.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : isLong ? (
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
          <button type="button" className="onboarding-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "See career matches"}
          </button>
        </div>
      </section>
    </main>
  );
}
