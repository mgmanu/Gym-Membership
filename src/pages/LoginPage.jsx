import React, { useState } from "react";
import {
  LockKeyhole,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Users,
  BarChart3,
  UserCheck,
} from "lucide-react";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      onLogin({
        email,
        remember,
      });
    }, 700);
  }

  function handleForgotPassword() {
    setError(
      "Password recovery will be connected to Supabase authentication later."
    );
  }

  return (
    <div className="login-page">

      <section className="login-brand-panel">

        <div className="login-brand">
          <div className="login-logo">
            <LockKeyhole size={21} />
          </div>

          <div>
            <h2>GYM MANAGEMENT</h2>
            <span>ADMIN PORTAL</span>
          </div>
        </div>

        <div className="login-brand-content">

          <div className="login-label">
            PRIVATE MANAGEMENT WORKSPACE
          </div>

          <h1>
            Manage your
            <br />
            <span>gym smarter.</span>
          </h1>

          <p>
            A complete workspace for managing members,
            attendance, payments and membership renewals
            from one elegant dashboard.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <div className="feature-icon">
                <Users size={17} />
              </div>

              <div>
                <strong>Member Management</strong>
                <span>
                  Register and manage every member
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">
                <UserCheck size={17} />
              </div>

              <div>
                <strong>Attendance Tracking</strong>
                <span>
                  Keep track of daily check-ins
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon">
                <BarChart3 size={17} />
              </div>

              <div>
                <strong>Business Overview</strong>
                <span>
                  Monitor revenue and membership activity
                </span>
              </div>
            </div>

          </div>
        </div>

        <div className="login-copyright">
          © 2026 Gym Management System · Secure Admin Workspace
        </div>

      </section>

      <section className="login-form-side">

        <div className="login-card">

          <div className="mobile-login-logo">
            <LockKeyhole size={21} />
          </div>

          <div className="login-heading">
            <h1>Welcome Back</h1>

            <p>
              Sign in to access your gym management workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="login-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="login-input">

                <Mail size={15} />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                />

              </div>

            </div>

            <div className="login-form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>

              </div>

              <div className="login-input">

                <KeyRound size={15} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>

              </div>

            </div>

            <div className="remember-row">

              <label className="remember-label">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) =>
                    setRemember(event.target.checked)
                  }
                />

                Remember me

              </label>

            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>

          <div className="login-security">
            <ShieldCheck size={12} />
            Secure administrator access
          </div>

        </div>

      </section>

    </div>
  );
}

export default LoginPage;