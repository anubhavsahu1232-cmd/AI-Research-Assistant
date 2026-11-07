import { useState } from "react";
import { FaGraduationCap, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, register, loading } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isRegister) {
        await register({ name, email, password });
        setSuccess("Registration successful. Please login.");
        setIsRegister(false);
        setPassword("");
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Something went wrong."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <FaGraduationCap />
          <span>ResearchAI</span>
        </div>

        <div className="auth-content">
          <span className="auth-tag">AI POWERED ACADEMIC WORKSPACE</span>
          <h1>Research smarter.<br />Write better.</h1>
          <p>
            Your intelligent academic research assistant.
            Generate structured research drafts and manage
            your academic work in one place.
          </p>
          <div className="auth-features">
            <div>? AI-powered research writing</div>
            <div>? Organize research papers</div>
            <div>? Save and manage your drafts</div>
          </div>
        </div>

        <small className="auth-footer">
          � 2026 ResearchAI. All rights reserved.
        </small>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <div className="auth-mobile-brand">
            <FaGraduationCap /> ResearchAI
          </div>

          <span className="auth-tag">
            {isRegister ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
          </span>

          <h2>{isRegister ? "Create an account" : "Sign in to your account"}</h2>

          <p className="auth-description">
            {isRegister
              ? "Start your academic research journey."
              : "Enter your credentials to continue."}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="auth-field">
                <label>Full Name</label>
                <div className="auth-input">
                  <FaUser />
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input">
                <FaEnvelope />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input">
                <FaLock />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="auth-switch">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccess("");
            }}>
              {isRegister ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
