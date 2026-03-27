import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../AuthContext";

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="landing-container">

      {/* HERO SECTION */}
      <section className="hero">
        <h2 className="hero-title">
          From Confusion to Employability
        </h2>

        <p className="hero-subtitle">
          Discover your ideal career path and see exactly why your CV gets rejected — then fix it instantly.
        </p>

        <p className="hero-highlight">
          💥 See why you’re rejected before the interview!
        </p>

        <div className="cta-buttons">
          {isAuthenticated ? (
            <>
              <button 
                className="primary-btn"
                onClick={() => navigate("/onboarding")}
              >
                Start Career Assessment
              </button>

              <button 
                className="secondary-btn"
                onClick={() => navigate("/cv-simulator")}
              >
                Run CV Simulation
              </button>
            </>
          ) : (
            <>
              <button
                className="primary-btn"
                onClick={() => navigate("/login")}
              >
                Log in to get started
              </button>
              <button
                className="secondary-btn"
                onClick={() => navigate("/signup")}
              >
                Sign up to access tools
              </button>
            </>
          )}
        </div>
      </section>

      <section className="landing-overview">
        <div className="overview-text">
          <p className="eyebrow">Built for people ready to move forward</p>
          <h3>One page for clarity, not complexity</h3>
          <p>LaunchPad brings career insight and resume feedback together, so your next job application is grounded in purpose and progress.</p>
        </div>

        <div className="overview-list">
          <div className="overview-item">
            <span>✔</span>
            <p>Practical guidance that explains what to fix and why.</p>
          </div>
          <div className="overview-item">
            <span>✔</span>
            <p>Actionable career insights based on your strengths and goals.</p>
          </div>
          <div className="overview-item">
            <span>✔</span>
            <p>Simple steps so you can improve your application with confidence.</p>
          </div>
        </div>
      </section>

      <section className="landing-benefits">
        <div className="benefit-item">
          <h3>🎯 Clarify your next move</h3>
          <p>Stop guessing and discover the career direction that fits your skills and ambition.</p>
        </div>

        <div className="benefit-item">
          <h3>📄 Understand your CV</h3>
          <p>Know exactly which resume sections are costing you interviews.</p>
        </div>

        <div className="benefit-item">
          <h3>🚀 Take practical action</h3>
          <p>Get clear improvements you can implement immediately.</p>
        </div>
      </section>

      <section className="process-steps">
        <h3>How LaunchPad guides you</h3>
        <p className="section-copy">A focused process that removes guesswork and helps you move from confusion to a stronger application.</p>

        <div className="step-grid">
          <div className="step-block">
            <div className="step-number">1</div>
            <h4>Discover your fit</h4>
            <p>See career paths that match your profile and motivation.</p>
          </div>

          <div className="step-block">
            <div className="step-number">2</div>
            <h4>Review your CV</h4>
            <p>Simulate employer feedback and identify your resume gaps.</p>
          </div>

          <div className="step-block">
            <div className="step-number">3</div>
            <h4>Improve with clarity</h4>
            <p>Apply clear changes that make your profile easier to evaluate.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;