import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../AuthContext";
import { isValidEmail, isStrongPassword } from "../utils/validation";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    setError("");
    login();
    navigate("/onboarding");
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Create account</h1>
      <div className="auth-card">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          type="text"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Create a strong password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="button" onClick={handleSignUp}>
          Sign up
        </button>
      </div>
    </div>
  );
}
