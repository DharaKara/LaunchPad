import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import CareerResultsPage from "./pages/CareerResultsPage";
import CvSimulatorPage from "./pages/CvSimulatorPage";
import PricingPage from "./pages/PricingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/Header";
import { AuthProvider } from "./AuthContext";
import AuthContext from "./AuthContext";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/onboarding"
            element={
              <PrivateRoute>
                <OnboardingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/career-results"
            element={
              <PrivateRoute>
                <CareerResultsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cv-simulator"
            element={
              <PrivateRoute>
                <CvSimulatorPage />
              </PrivateRoute>
            }
          />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;