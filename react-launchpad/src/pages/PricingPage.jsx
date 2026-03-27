import { useNavigate } from "react-router-dom";

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="page-title">Pricing</h1>
      <p className="page-copy">
        Student-friendly pricing built to attract learners, increase retention, and deliver a sustainable employer-backed business.
      </p>

      <div className="pricing-grid">
        <div className="price-card tier-free">
          <div className="card-header">
            <span className="card-label">🟢 Free Tier</span>
            <span className="card-pill">Starter</span>
          </div>

          <h3>Accessible to all students</h3>
          <div className="price-block">
            <span className="price">R0</span>
            <span className="price-sub">Free forever</span>
          </div>

          <ul className="feature-list">
            <li>3–5 CV vs Job Match analyses per month</li>
            <li>Basic match score</li>
            <li>Limited skill gap insights</li>
            <li>Starter recommendations</li>
          </ul>

          <p className="card-note">Goal: attract students, build user base, create habit.</p>
          <button className="cta-btn cta-secondary" onClick={() => navigate("/signup")}>Start for free</button>
        </div>

        <div className="price-card tier-premium">
          <div className="card-header">
            <span className="card-label">🔵 Student Premium</span>
            <span className="card-pill">Popular</span>
          </div>

          <h3>Unlimited student access</h3>
          <div className="price-block">
            <span className="price">R49</span>
            <span className="price-sub">/ month</span>
          </div>
          <p className="price-note">Affordable pricing for serious learners.</p>

          <ul className="feature-list">
            <li>Unlimited CV analyses</li>
            <li>Detailed skill gap breakdown</li>
            <li>CV improvement suggestions</li>
            <li>Recommended learning resources</li>
            <li>Priority AI analysis</li>
          </ul>

          <p className="card-note">Cheaper than most tools and built for student value.</p>
          <button className="cta-btn" onClick={() => navigate("/signup")}>Upgrade now</button>
        </div>

        <div className="price-card tier-bundle featured">
          <div className="card-header">
            <span className="card-label">🟣 Student Bundle</span>
            <span className="card-pill pill-accent">Best value</span>
          </div>

          <h3>3-month student bundle</h3>
          <div className="price-block">
            <span className="price">R99</span>
            <span className="price-sub">for 3 months</span>
          </div>
          <p className="price-note">Only ~R33 per month with full premium access.</p>

          <ul className="feature-list">
            <li>Everything in Premium</li>
            <li>Discounted long-term access</li>
            <li>More time to build career momentum</li>
          </ul>

          <p className="card-note">Purpose: increase retention with student-friendly long-term pricing.</p>
          <button className="cta-btn" onClick={() => navigate("/signup")}>Choose bundle</button>
        </div>

        <div className="price-card tier-employer">
          <div className="card-header">
            <span className="card-label">🟠 Employer Plan</span>
            <span className="card-pill">B2B</span>
          </div>

          <h3>Team hiring and talent match</h3>
          <div className="price-block">
            <span className="price">R199–R499</span>
            <span className="price-sub">/ month per company</span>
          </div>
          <p className="price-note">Powerful employer features with student-friendly access.</p>

          <ul className="feature-list">
            <li>Create job profiles</li>
            <li>View matched candidates</li>
            <li>Rank applicants by match %</li>
            <li>Access candidate insights</li>
          </ul>

          <p className="card-note">Employers pay more, students stay cheap or free.</p>
          <button className="cta-btn cta-secondary" onClick={() => navigate("/signup")}>Contact sales</button>
        </div>
      </div>
    </div>
  );
}
