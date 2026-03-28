import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Dummy backend data ───────────────────────────────────────────
const plans = [
  {
    id: "free",
    tier: "tier-free",
    name: "Starter",
    pill: "Free Forever",
    pillClass: "",
    headline: "Step in, zero risk",
    monthly: 0,
    annual: 0,
    sub: "Free forever",
    note: "No credit card. No catch.",
    features: [
      "5 CV vs Job Match analyses / month",
      "Basic match score",
      "Starter skill gap insights",
      "Community-level support",
    ],
    incentive: {
      icon: "🎁",
      label: "Referral Reward",
      text: "Earn R50 credit for every friend who upgrades to Pro",
    },
    cta: "Start for free",
    ctaClass: "cta-btn cta-secondary",
  },
  {
    id: "pro",
    tier: "tier-premium",
    name: "Pro",
    pill: "Popular",
    pillClass: "",
    headline: "Unlimited momentum",
    monthly: 49,
    annual: 39,
    sub: "/ month",
    note: "Affordable. Cancel anytime.",
    features: [
      "Unlimited CV analyses",
      "Detailed skill gap breakdown",
      "CV improvement suggestions",
      "Personalised learning resources",
      "Priority AI analysis",
    ],
    incentive: {
      icon: "🔒",
      label: "Loyalty Discount",
      text: "Price locks in — the longer you stay, the cheaper it gets",
    },
    cta: "Upgrade now",
    ctaClass: "cta-btn",
  },
  {
    id: "bundle",
    tier: "tier-bundle",
    name: "Bundle",
    pill: "Best Value",
    pillClass: "pill-accent",
    headline: "3 months of runway",
    monthly: 99,
    annual: 79,
    sub: "for 3 months",
    note: "~R33/month. Annually only ~R26/month.",
    featured: true,
    features: [
      "Everything in Pro",
      "Long-term career tracking",
      "Employer visibility badge",
      "Group pricing eligibility",
    ],
    incentive: {
      icon: "💰",
      label: "Revenue Share",
      text: "Earn 2% of referred user revenue every month for 12 months",
    },
    cta: "Choose bundle",
    ctaClass: "cta-btn",
  },
  {
    id: "employer",
    tier: "tier-employer",
    name: "Employer",
    pill: "B2B",
    pillClass: "",
    headline: "Hire smarter, faster",
    monthly: "R199–R499",
    annual: "R149–R399",
    sub: "/ month per company",
    note: "Includes student sponsorship credits.",
    features: [
      "Create & manage job profiles",
      "View AI-matched candidates",
      "Rank applicants by match %",
      "Candidate skill insights",
      "Sponsor student Pro access",
    ],
    incentive: {
      icon: "🏢",
      label: "Employer Subsidy",
      text: "Pay for student subscriptions — get first-look hiring + brand placement",
    },
    cta: "Contact sales",
    ctaClass: "cta-btn cta-secondary",
  },
];

const incentiveModels = [
  {
    icon: "🎯",
    title: "Achievement Unlock Pricing",
    desc: "Complete milestones — upload your CV, apply for 3 jobs, get matched — and unlock permanently reduced rates. Gamified growth that rewards real engagement.",
    metric: "Avg. 34% discount earned",
    color: "#059669",
    bg: "rgba(5,150,105,0.07)",
    border: "rgba(5,150,105,0.2)",
  },
  {
    icon: "👥",
    title: "Cohort Buying",
    desc: "Get 4 friends to sign up together and everyone pays 50% less — auto-applied. No codes. No friction. Group momentum drives acquisition at near-zero cost.",
    metric: "214 active cohort groups",
    color: "#2563eb",
    bg: "rgba(37,99,235,0.07)",
    border: "rgba(37,99,235,0.2)",
  },
  {
    icon: "💼",
    title: "Employer-Subsidised Access",
    desc: "Employers pay student subscriptions in exchange for first-look hiring and brand placement. Students get free Pro access. Employers get a pre-qualified pipeline.",
    metric: "619 students sponsored",
    color: "#ea580c",
    bg: "rgba(234,88,12,0.07)",
    border: "rgba(234,88,12,0.2)",
  },
  {
    icon: "📈",
    title: "Revenue Share Referrals",
    desc: "Refer a user who upgrades and earn 2% of their monthly subscription revenue for a full year. Not a one-time credit — a recurring income stream from your network.",
    metric: "R142,300 paid out to date",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.2)",
  },
];

const liveStats = [
  { label: "Monthly Active Subscribers", value: 3847, prefix: "",  color: "#2563eb" },
  { label: "Referral Revenue (MTD)",       value: 142300, prefix: "R", color: "#059669" },
  { label: "Credits Issued (MTD)",          value: 28900,  prefix: "R", color: "#7c3aed" },
  { label: "Employer-Sponsored Students",  value: 619,    prefix: "",  color: "#ea580c" },
  { label: "Active Cohort Groups",          value: 214,    prefix: "",  color: "#0ea5e9" },
  { label: "Avg. Subscriber LTV",           value: 1840,   prefix: "R", color: "#e11d48" },
];

// ─── Animated counter ─────────────────────────────────────────────
function AnimatedStat({ value, prefix = "" }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const duration = 1600;
    const step = value / (duration / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= value) { setCount(value); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [value]);
  return <>{prefix}{count.toLocaleString()}</>;
}

export default function PricingPage() {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);

  const getPrice = (plan) => {
    if (plan.id === "employer") return annual ? "R149–R399" : "R199–R499";
    if (plan.monthly === 0) return "R0";
    return annual ? `R${plan.annual}` : `R${plan.monthly}`;
  };

  return (
    <div className="pricing-page">

      {/* ── HERO ──────────────────────────────────────────── */}
      <div className="pricing-hero">
        <span className="pricing-eyebrow">Revenue Model · Incentive-First</span>
        <h1 className="pricing-headline">
          More than a subscription.<br />
          <span className="pricing-headline-accent">You earn while you grow.</span>
        </h1>
        <p className="pricing-subtext">
          LaunchPad doesn't just charge — it rewards. Referrals pay real money,
          employers sponsor students, every milestone you hit cuts your price.
          Built to attract, retain, and generate revenue differently.
        </p>
        <div className="pricing-social-row">
          <span className="social-proof-pill">🟢 3,847 active subscribers</span>
          <span className="social-proof-pill">💰 R142,300 paid out in referrals</span>
          <span className="social-proof-pill">🏢 619 employer-sponsored students</span>
        </div>
      </div>

      {/* ── BILLING TOGGLE ────────────────────────────────── */}
      <div className="billing-toggle-wrap">
        <span className={!annual ? "toggle-label active" : "toggle-label"}>Monthly</span>
        <button
          className={`billing-toggle${annual ? " on" : ""}`}
          onClick={() => setAnnual(!annual)}
          aria-label="Toggle annual billing"
        >
          <span className="toggle-thumb" />
        </button>
        <span className={annual ? "toggle-label active" : "toggle-label"}>Annual</span>
        {annual && <span className="savings-badge">Save up to 20%</span>}
      </div>

      <div className="page-container" style={{ paddingTop: "8px" }}>

        {/* ── PLAN CARDS ──────────────────────────────────── */}
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`price-card ${plan.tier}${plan.featured ? " featured" : ""}`}
            >
              <div className="card-header">
                <span className="card-label">{plan.name}</span>
                <span className={`card-pill${plan.pillClass ? ` ${plan.pillClass}` : ""}`}>{plan.pill}</span>
              </div>
              <h3>{plan.headline}</h3>
              <div className="price-block">
                <span className="price">{getPrice(plan)}</span>
                <span className="price-sub">{plan.sub}</span>
              </div>
              <p className="price-note">{plan.note}</p>
              <ul className="feature-list">
                {plan.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <div className="incentive-badge">
                <span className="incentive-icon">{plan.incentive.icon}</span>
                <div>
                  <strong>{plan.incentive.label}</strong>
                  <p>{plan.incentive.text}</p>
                </div>
              </div>
              <button
                className={plan.ctaClass}
                style={{ width: "100%", marginTop: 18 }}
                onClick={() => navigate("/signup")}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* ── UNIQUE INCENTIVE MODELS ─────────────────────── */}
        <section className="incentive-section">
          <div className="incentive-section-header">
            <span className="section-eyebrow">Beyond Subscriptions</span>
            <h2 className="section-title">Four ways to make money work harder</h2>
            <p className="section-sub">
              These aren't gimmicks. Each model compounds user acquisition, reduces churn,
              and creates revenue streams traditional SaaS completely ignores.
            </p>
          </div>
          <div className="incentive-models-grid">
            {incentiveModels.map((m, i) => (
              <div
                key={i}
                className="incentive-model-card"
                style={{ background: m.bg, borderColor: m.border }}
              >
                <span className="im-icon">{m.icon}</span>
                <h4 className="im-title" style={{ color: m.color }}>{m.title}</h4>
                <p className="im-desc">{m.desc}</p>
                <span className="im-metric" style={{ color: m.color, borderColor: m.border }}>{m.metric}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── LIVE METRICS DASHBOARD ──────────────────────── */}
        <section className="metrics-strip">
          <span className="metrics-live-pill">● Live Metrics</span>
          <h2 className="section-title" style={{ marginBottom: 8 }}>Revenue simulation dashboard</h2>
          <p className="section-sub" style={{ marginBottom: 30 }}>
            Dummy backend data showing how incentive monetisation impacts LTV, churn, and growth.
          </p>
          <div className="metrics-grid">
            {liveStats.map((stat, i) => (
              <div className="metric-card" key={i}>
                <p className="metric-label">{stat.label}</p>
                <p className="metric-value" style={{ color: stat.color }}>
                  <AnimatedStat value={stat.value} prefix={stat.prefix} />
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COHORT BANNER ───────────────────────────────── */}
        <section className="cohort-banner">
          <div className="cohort-inner">
            <div>
              <span className="section-eyebrow" style={{ color: "#2563eb" }}>Squad Pricing</span>
              <h2 className="section-title" style={{ margin: "8px 0" }}>
                Bring 4 friends. Everyone saves 50%.
              </h2>
              <p className="cohort-desc">
                Group up and we auto-apply a 50% discount to every member's subscription —
                no codes, no back-and-forth. 214 groups have already saved together.
              </p>
            </div>
            <button className="cta-btn cohort-btn" onClick={() => navigate("/signup")}>
              Start a cohort group →
            </button>
          </div>
        </section>

        {/* ── FINAL CTA ───────────────────────────────────── */}
        <section className="pricing-final-cta">
          <h2 className="section-title">Ready to earn, grow, and get hired?</h2>
          <p className="section-sub">
            Start free. Upgrade when it makes sense. Earn referral revenue while you study.
          </p>
          <div className="final-cta-row">
            <button className="cta-btn" style={{ minWidth: 160 }} onClick={() => navigate("/signup")}>
              Get started free
            </button>
            <button className="cta-btn cta-secondary" style={{ minWidth: 160 }} onClick={() => navigate("/signup")}>
              See how it works
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
