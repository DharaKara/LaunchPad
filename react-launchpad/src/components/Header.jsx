import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../AuthContext";

export default function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="header">
      <div className="header-left">
        <Link to="/" className="header-brand">CareerLaunchpad</Link>
        <div className="header-links">
          <Link to="/">Home</Link>
          {isAuthenticated && <Link to="/onboarding">Assessment</Link>}
          {isAuthenticated && <Link to="/cv-simulator">CV Tool</Link>}
          <Link to="/pricing">Pricing</Link>
        </div>
      </div>

      <div className="header-actions">
        {isAuthenticated ? (
          <button type="button" onClick={handleLogout} className="button-link">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="button-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}