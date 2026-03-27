import { useLocation } from "react-router-dom";

export default function CareerResultsPage() {
  const { state } = useLocation();

  if (!state) {
    return (
      <main className="career-results">
        <div className="report-empty">
          <h2>Career intelligence report</h2>
          <p>No data available. Please complete the onboarding questions to generate a tailored report.</p>
        </div>
      </main>
    );
  }

  const { career_match, skill_gaps, roadmap } = state;

  return (
    <main className="career-results">
      <section className="report-hero">
        <div className="report-hero__heading">
          <span className="report-badge">Confidence: {career_match.confidence}%</span>
          <h2>{career_match.role}</h2>
          <p>{career_match.reason}</p>
        </div>

        <div className="report-stats">
          <div className="report-stat-card">
            <h4>Aptitude score</h4>
            <p>{career_match.aptitude_score}/100</p>
            <small>Standardized intelligence assessment</small>
          </div>
          <div className="report-stat-card">
            <h4>Match strength</h4>
            <p>{career_match.confidence >= 85 ? "Very strong" : career_match.confidence >= 70 ? "Strong" : "Promising"}</p>
            <small>Based on your profile and skill signals</small>
          </div>
        </div>
      </section>

      <section className="report-summary">
        <h3>Intelligence Report</h3>
        <p>{career_match.summary}</p>

        <div className="report-grid">
          <article className="report-card">
            <h4>Analytical insights</h4>
            <p>Strong data reasoning, pattern recognition, and structured problem solving are the core advantages in this role.</p>
          </article>
          <article className="report-card">
            <h4>Professional aptitude</h4>
            <p>High adaptability and resilience in complex projects make you well-suited for fast-growing analytics environments.</p>
          </article>
        </div>
      </section>

      <section className="skills-gap">
        <div className="section-header">
          <h3>Skills Gap</h3>
          <p>Focus on the highest-impact growth areas first to accelerate your career readiness.</p>
        </div>

        <div className="gap-grid">
          {skill_gaps.map((gap, index) => (
            <article className="gap-card" key={index}>
              <div className="gap-card__header">
                <h4>{gap.skill}</h4>
                <span className={`gap-priority gap-priority--${gap.priority.toLowerCase()}`}>{gap.priority}</span>
              </div>
              <p>{gap.detail}</p>
              <p className="gap-action">Recommended: {gap.recommendation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap">
        <div className="section-header">
          <h3>Road Map</h3>
          <p>Your step-by-step development path with immediate and intermediate actions.</p>
        </div>

        <div className="roadmap-grid">
          <div className="roadmap-column">
            <h4>Immediate</h4>
            <ul>
              {roadmap.immediate.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
          <div className="roadmap-column">
            <h4>Intermediate</h4>
            <ul>
              {roadmap.intermediate.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="report-notes">
        <h3>Why this matters</h3>
        <p>This report combines aptitude, skill readiness, and role fit so you can make confident career choices faster. Use the confidence level as your primary benchmark, then follow the roadmap to close gaps in priority order.</p>
      </section>
    </main>
  );
}
