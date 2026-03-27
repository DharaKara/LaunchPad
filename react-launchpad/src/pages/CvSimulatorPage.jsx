import { useState } from "react";
import { mockCvSimulation } from "../data/mockCvSimulation";
import { mockCvImprovement } from "../data/mockCvImprovement";
import { generateMockInterviewQuestions } from "../utils/interview";

export default function CvSimulatorPage() {
  const [cvText, setCvText] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [cvDragging, setCvDragging] = useState(false);
  const [jdText, setJdText] = useState("");
  const [jdFileName, setJdFileName] = useState("");
  const [jdDragging, setJdDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [improved, setImproved] = useState(null);

  const formatScoreLabel = (score) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    return "needs-improvement";
  };

  const formatScoreLabelText = (score) => {
    const label = formatScoreLabel(score);
    return label.replace("-", " ");
  };

  const runSimulation = () => {
    if (!cvText.trim() || !jdText.trim()) {
      setErrorMessage("Provide both your CV and the job description to get an accurate score.");
      return;
    }

    setErrorMessage("");
    setImproved(null);
    setCurrentAnswer("");
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setInterviewCompleted(false);
    setInterviewQuestions(generateMockInterviewQuestions(cvText, jdText));
    setResult(mockCvSimulation);
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) {
      setErrorMessage("Please answer the interview question before moving on.");
      return;
    }

    setErrorMessage("");
    setUserAnswers([...userAnswers, currentAnswer.trim()]);
    setCurrentAnswer("");

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= interviewQuestions.length) {
      setInterviewCompleted(true);
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const improveCv = () => {
    if (!result) {
      setErrorMessage("Run the simulation first to generate improvement suggestions.");
      return;
    }

    setErrorMessage("");
    setImproved(mockCvImprovement);
  };

  const readTextFile = (file, setText, setName) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setText(event.target.result);
    reader.onerror = () => {
      setErrorMessage(`Could not read file ${file.name}. Please paste text instead.`);
    };
    reader.readAsText(file);
    setName(file.name);
  };

  const handleFileChange = (event, setText, setName) => {
    const file = event.target.files?.[0];
    if (file) {
      setErrorMessage("");
      readTextFile(file, setText, setName);
    }
  };

  const handleDrop = (event, setText, setName, setDragging) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      setErrorMessage("");
      readTextFile(file, setText, setName);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="page-container cv-simulator-page">
      <section className="cv-simulator-hero">
        <p className="eyebrow">AI resume intelligence</p>
        <h1>CV Simulator</h1>
        <p className="hero-copy">
          Compare your resume to a job description, discover missing keywords, and get an instant
          ATS readiness score with optimization hints.
        </p>
      </section>

      <div className="cv-simulator-grid">
        <section className="input-card">
          <div className="card-header-row">
            <h2>Upload resume</h2>
            <span className="tag">Step 1</span>
          </div>

          <div
            className={`drop-zone ${cvDragging ? "dragging" : ""}`}
            onDrop={(event) => handleDrop(event, setCvText, setCvFileName, setCvDragging)}
            onDragOver={(event) => {
              handleDragOver(event);
              setCvDragging(true);
            }}
            onDragLeave={() => setCvDragging(false)}
          >
            <div>
              <strong>{cvFileName || "Drop CV file here"}</strong>
              <p>Supports .txt, .md, .json — or paste the text below.</p>
            </div>
            <input
              type="file"
              accept=".txt,.md,.json"
              onChange={(event) => handleFileChange(event, setCvText, setCvFileName)}
              aria-label="Upload CV file"
            />
          </div>

          {cvFileName && (
            <div className="file-meta-row">
              <span className="file-name">Uploaded file: {cvFileName}</span>
              <button
                type="button"
                className="file-clear-btn"
                onClick={() => {
                  setCvText("");
                  setCvFileName("");
                }}
              >
                Remove file
              </button>
            </div>
          )}

          <label htmlFor="cvTextArea">Resume text</label>
          <textarea
            id="cvTextArea"
            value={cvText}
            placeholder="Paste your resume content here"
            onChange={(e) => setCvText(e.target.value)}
          />
        </section>

        <section className="input-card">
          <div className="card-header-row">
            <h2>Upload job description</h2>
            <span className="tag accent">Step 2</span>
          </div>

          <div
            className={`drop-zone ${jdDragging ? "dragging" : ""}`}
            onDrop={(event) => handleDrop(event, setJdText, setJdFileName, setJdDragging)}
            onDragOver={(event) => {
              handleDragOver(event);
              setJdDragging(true);
            }}
            onDragLeave={() => setJdDragging(false)}
          >
            <div>
              <strong>{jdFileName || "Drop job description file here"}</strong>
              <p>Supports .txt, .md, .json — or paste the description below.</p>
            </div>
            <input
              type="file"
              accept=".txt,.md,.json"
              onChange={(event) => handleFileChange(event, setJdText, setJdFileName)}
              aria-label="Upload job description file"
            />
          </div>

          {jdFileName && (
            <div className="file-meta-row">
              <span className="file-name">Uploaded file: {jdFileName}</span>
              <button
                type="button"
                className="file-clear-btn"
                onClick={() => {
                  setJdText("");
                  setJdFileName("");
                }}
              >
                Remove file
              </button>
            </div>
          )}

          <label htmlFor="jdTextArea">Job description text</label>
          <textarea
            id="jdTextArea"
            value={jdText}
            placeholder="Paste the job description here"
            onChange={(e) => setJdText(e.target.value)}
          />
        </section>
      </div>

      {errorMessage && (
        <div className="alert-banner" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      <div className="actions-row">
        <button type="button" className="cta-btn" onClick={runSimulation}>
          Run simulation
        </button>
      </div>

      {result && interviewQuestions.length > 0 && !interviewCompleted && (
        <section className="results-card interview-card">
          <div className="card-header-row">
            <div>
              <h2>Mock interview</h2>
              <p className="muted">AI-derived questions generated from your resume and job description.</p>
            </div>
            <span className="result-pill result-good">Question {currentQuestionIndex + 1} / {interviewQuestions.length}</span>
          </div>

          <div className="result-grid">
            <div className="result-metric full-width">
              <h3>Interview question</h3>
              <p>{interviewQuestions[currentQuestionIndex]}</p>
            </div>
          </div>

          <div className="question-field">
            <label htmlFor="interviewAnswer">Your response</label>
            <textarea
              id="interviewAnswer"
              value={currentAnswer}
              placeholder="Type your answer here"
              onChange={(e) => setCurrentAnswer(e.target.value)}
            />
          </div>

          <div className="actions-row">
            <button type="button" className="cta-btn" onClick={handleAnswerSubmit}>
              {currentQuestionIndex + 1 >= interviewQuestions.length ? "Finish interview" : "Next question"}
            </button>
          </div>
        </section>
      )}

      {result && interviewCompleted && (
        <section className="results-card">
          <div className="card-header-row">
            <div>
              <h2>Simulation results</h2>
              <p className="muted">Based on your resume and the job description</p>
            </div>
            <span className={`result-pill result-${formatScoreLabel(result.ats_scan.score)}`}>
              {formatScoreLabelText(result.ats_scan.score)}
            </span>
          </div>

          <div className="score-block">
            <div className="score-value">{result.ats_scan.score}%</div>
            <div className="score-label">ATS readiness score</div>
          </div>

          <div className="result-grid">
            <div className="result-metric">
              <h3>Shortlist decision</h3>
              <p>{result.shortlist_decision}</p>
            </div>
            <div className="result-metric">
              <h3>Missing keywords</h3>
              {result.ats_scan.missing_keywords.length ? (
                <ul className="keyword-list">
                  {result.ats_scan.missing_keywords.map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                  ))}
                </ul>
              ) : (
                <p>None detected</p>
              )}
            </div>
            <div className="result-metric full-width">
              <h3>Rejection reasons</h3>
              <ul className="reason-list">
                {result.rejection_reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="actions-row">
            <button type="button" className="cta-secondary" onClick={improveCv}>
              Generate improved CV advice
            </button>
          </div>
        </section>
      )}

      {improved && (
        <section className="results-card improvement-card">
          <div className="card-header-row">
            <div>
              <h2>Improvement preview</h2>
              <p className="muted">AI-suggested resume enhancements</p>
            </div>
            <span className="result-pill result-excellent">+{improved.new_score - result.ats_scan.score}%</span>
          </div>

          <div className="score-block">
            <div className="score-value">{improved.new_score}%</div>
            <div className="score-label">Projected ATS score</div>
          </div>

          <div className="improvement-summary">
            <p>{improved.improved_summary}</p>
            <p>
              <strong>New recommendation:</strong> {improved.new_decision}
            </p>
          </div>
        </section>
      )}

      <section className="feature-grid">
        <div className="feature-card">
          <h3>Why it works</h3>
          <p>Improve the chance of passing ATS filters by matching your resume to the exact hiring criteria.</p>
        </div>
        <div className="feature-card">
          <h3>Save time</h3>
          <p>Stop guessing which keywords matter and get instant feedback on the resume-job match.</p>
        </div>
        <div className="feature-card">
          <h3>Better outcomes</h3>
          <p>Use recommended changes to shift your resume from rejected to shortlisted.</p>
        </div>
      </section>
    </div>
  );
}
