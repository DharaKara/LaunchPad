import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../AuthContext";
import { isValidEmail } from "../utils/validation";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    login();
    navigate("/onboarding");
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Login</h1>
      <div className="auth-card">
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
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="button" onClick={handleSignIn}>
          Sign in
        </button>
      </div>
    </div>
  );
}
