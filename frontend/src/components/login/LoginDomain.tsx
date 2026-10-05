import React, { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserCheck,
  UserRound,
  X,
  Sparkles
} from "lucide-react";
import { authService } from "../../services/auth";
import { AuthUser } from "../../types";

interface LoginDomainProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: "patient" | "staff";
}

export const LoginDomain: React.FC<LoginDomainProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = "patient"
}) => {
  const [authMode, setAuthMode] = useState<"patient" | "staff">(initialMode);
  const [patientTab, setPatientTab] = useState<"signin" | "signup">("signin");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [gender, setGender] = useState<string>("Male");
  const [dob, setDob] = useState<string>("1995-06-15");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setMessage("");
      setIsError(false);
      window.setTimeout(() => {
        emailRef.current?.focus();
      }, 120);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Handle Google OAuth Login
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setMessage("Connecting to Google Authentication...");
    authService.loginWithGoogle();
  };

  // Handle Email/Password Submit
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      if (authMode === "staff") {
        // Staff Login
        const res = await authService.loginWithEmail(email, password);
        if (res.success && res.user) {
          setMessage("Welcome to CarePoint Operations Center!");
          setIsError(false);
          window.setTimeout(() => {
            onLoginSuccess(res.user!);
          }, 600);
        } else {
          setIsError(true);
          setMessage(res.message || "Invalid staff credentials.");
        }
      } else if (patientTab === "signin") {
        // Patient Sign In
        const res = await authService.loginWithEmail(email, password);
        if (res.success && res.user) {
          setMessage(`Welcome back, ${res.user.name || "Patient"}!`);
          setIsError(false);
          window.setTimeout(() => {
            onLoginSuccess(res.user!);
          }, 600);
        } else {
          setIsError(true);
          setMessage(res.message || "Invalid email or password.");
        }
      } else {
        // Patient Sign Up
        const res = await authService.registerPatient({
          FirstName: firstName || "Patient",
          LastName: lastName || "",
          Email: email,
          Password: password,
          Phone: phone || "+91 9876543210",
          BloodGroup: bloodGroup as any,
          Gender: gender as any,
          DOB: dob
        });

        if (res.success && res.user) {
          setMessage("Account created successfully! Loading your profile...");
          setIsError(false);
          window.setTimeout(() => {
            onLoginSuccess(res.user!);
          }, 600);
        } else {
          setIsError(true);
          setMessage(res.message || "Registration failed. Please check your information.");
        }
      }
    } catch {
      setIsError(true);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Logins
  const useDemoPatient = () => {
    const demoUser = authService.loginDemoPatient();
    setMessage("Demo Patient account activated. Opening profile...");
    setIsError(false);
    window.setTimeout(() => {
      onLoginSuccess(demoUser);
    }, 600);
  };

  const useDemoStaff = () => {
    setEmail("admin");
    setPassword("admin123");
    setMessage("Staff demo credentials loaded. Click Sign In to continue.");
    setIsError(false);
  };

  return (
    <section className="login-domain" role="dialog" aria-modal="true" aria-label="CarePoint Authentication">
      {/* Background Overlay */}
      <div className="login-domain-backdrop" onClick={onClose} />

      {/* Login Panel */}
      <div className="login-domain-panel">
        {/* Back Button */}
        <button type="button" className="login-domain-back" onClick={onClose}>
          <ArrowLeft size={16} />
          Back to Hospital
        </button>

        {/* Close Button */}
        <button type="button" className="login-domain-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* ── LEFT SIDE BRANDING HERO ─────────────────────────────── */}
        <div className="login-domain-intro">
          <div className="login-domain-logo">
            <HeartPulse size={30} color="#FFFFFF" />
          </div>

          <span className="login-domain-kicker">CarePoint Health Portal</span>

          <h1>{authMode === "patient" ? "Your Health. One Profile." : "Hospital Operations."}</h1>

          <p>
            {authMode === "patient"
              ? "Access your unified clinical health records, diagnostic reports, biometric tracker, prescriptions, and telehealth consultations."
              : "Secure enterprise gateway for clinical faculty, doctors, and administrative hospital staff."}
          </p>

          <div className="login-domain-trust">
            <span>
              <ShieldCheck size={16} />
              HIPAA & NABH Compliant Security
            </span>
            <span>
              <CheckCircle2 size={16} />
              Instant Google OAuth & Verified Access
            </span>
          </div>

          {/* Quick Switch Button at bottom left */}
          <div style={{ marginTop: "auto", paddingTop: "28px" }}>
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "patient" ? "staff" : "patient");
                setMessage("");
                setIsError(false);
              }}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "10px",
                color: "#FFFFFF",
                padding: "8px 14px",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s"
              }}
            >
              {authMode === "patient" ? (
                <>
                  <UserCheck size={14} />
                  <span>Hospital Staff Login →</span>
                </>
              ) : (
                <>
                  <User size={14} />
                  <span>← Patient Sign In & Google Auth</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT SIDE AUTH FORM ────────────────────────────────── */}
        <div className="login-domain-form-area">
          {/* Top Role Segment Selector */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <button
              type="button"
              onClick={() => {
                setAuthMode("patient");
                setMessage("");
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "10px",
                border: authMode === "patient" ? "1px solid #164A41" : "1px solid #E5E0D6",
                backgroundColor: authMode === "patient" ? "#164A41" : "#FAF8F4",
                color: authMode === "patient" ? "#FFFFFF" : "#5F6E68",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.2s"
              }}
            >
              <User size={14} />
              <span>Patient Access</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("staff");
                setMessage("");
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "10px",
                border: authMode === "staff" ? "1px solid #164A41" : "1px solid #E5E0D6",
                backgroundColor: authMode === "staff" ? "#164A41" : "#FAF8F4",
                color: authMode === "staff" ? "#FFFFFF" : "#5F6E68",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 0.2s"
              }}
            >
              <ShieldCheck size={14} />
              <span>Staff / Clinical</span>
            </button>
          </div>

          {authMode === "patient" ? (
            <>
              {/* Patient Header & Google CTA */}
              <div className="login-domain-heading" style={{ marginBottom: "16px" }}>
                <h2 style={{ fontSize: "1.4rem", color: "#164A41", margin: 0 }}>
                  {patientTab === "signin" ? "Patient Sign In" : "Register Patient Account"}
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.84rem", color: "#5F6E68" }}>
                  {patientTab === "signin"
                    ? "Sign in with Google or your email to view medical records."
                    : "Create a new medical record account to manage your care."}
                </p>
              </div>

              {/* ── Official Google OAuth Button ─────────────────────── */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "12px 18px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D2DDD9",
                  borderRadius: "12px",
                  color: "#1F2937",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                  marginBottom: "16px"
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
              >
                {/* Official Google SVG Logo */}
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  margin: "14px 0",
                  color: "#8A9993",
                  fontSize: "0.76rem",
                  textTransform: "uppercase",
                  fontWeight: 700
                }}
              >
                <span style={{ flex: 1, height: "1px", backgroundColor: "#E5E0D6" }} />
                <span>or continue with email</span>
                <span style={{ flex: 1, height: "1px", backgroundColor: "#E5E0D6" }} />
              </div>

              {/* Toggle Tab: Sign In vs Sign Up */}
              <div
                style={{
                  display: "flex",
                  backgroundColor: "#FAF8F4",
                  border: "1px solid #E5E0D6",
                  borderRadius: "10px",
                  padding: "3px",
                  marginBottom: "14px"
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setPatientTab("signin");
                    setMessage("");
                  }}
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: patientTab === "signin" ? "#FFFFFF" : "transparent",
                    color: patientTab === "signin" ? "#164A41" : "#5F6E68",
                    fontWeight: patientTab === "signin" ? 700 : 500,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    boxShadow: patientTab === "signin" ? "0 1px 4px rgba(0,0,0,0.06)" : "none"
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPatientTab("signup");
                    setMessage("");
                  }}
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: patientTab === "signup" ? "#FFFFFF" : "transparent",
                    color: patientTab === "signup" ? "#164A41" : "#5F6E68",
                    fontWeight: patientTab === "signup" ? 700 : 500,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    boxShadow: patientTab === "signup" ? "0 1px 4px rgba(0,0,0,0.06)" : "none"
                  }}
                >
                  Create New Account
                </button>
              </div>
            </>
          ) : (
            <div className="login-domain-heading">
              <p className="login-domain-eyebrow">CarePoint Operations</p>
              <h2>Staff & Clinical Sign In</h2>
              <p>Sign in with your hospital staff ID or use demo admin credentials below.</p>
            </div>
          )}

          {/* Alert Message */}
          {message && (
            <div
              className={`login-domain-message ${
                isError ? "login-domain-message-error" : "login-domain-message-success"
              }`}
            >
              {isError ? <X size={16} /> : <CheckCircle2 size={16} />}
              <span>{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {authMode === "patient" && patientTab === "signup" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label htmlFor="patient-fn">First Name</label>
                  <div className="login-domain-input">
                    <UserRound size={16} />
                    <input
                      id="patient-fn"
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="e.g. David"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="patient-ln">Last Name</label>
                  <div className="login-domain-input">
                    <UserRound size={16} />
                    <input
                      id="patient-ln"
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="e.g. Harrison"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email / Username */}
            <label htmlFor="auth-email">
              {authMode === "patient" ? "Email Address" : "Staff Username or Email"}
            </label>
            <div className="login-domain-input">
              {authMode === "patient" ? <Mail size={16} /> : <UserRound size={16} />}
              <input
                ref={emailRef}
                id="auth-email"
                type={authMode === "patient" ? "email" : "text"}
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={authMode === "patient" ? "your.email@gmail.com" : "admin"}
                required
              />
            </div>

            {/* Sign-up extra fields */}
            {authMode === "patient" && patientTab === "signup" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label htmlFor="patient-phone">Phone Number</label>
                  <div className="login-domain-input">
                    <Phone size={16} />
                    <input
                      id="patient-phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="patient-blood">Blood Group</label>
                  <div className="login-domain-input" style={{ padding: "0 8px" }}>
                    <select
                      id="patient-blood"
                      value={bloodGroup}
                      onChange={e => setBloodGroup(e.target.value)}
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        padding: "12px 0",
                        fontSize: "0.86rem",
                        color: "#17201D"
                      }}
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Password */}
            <div className="login-domain-label-row">
              <label htmlFor="auth-password">Password</label>
              {authMode === "staff" && <span>Demo: admin123</span>}
            </div>

            <div className="login-domain-input">
              <LockKeyhole size={16} />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete={patientTab === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-domain-submit" disabled={isLoading}>
              {isLoading
                ? "Processing..."
                : authMode === "staff"
                ? "Sign into Operations Center"
                : patientTab === "signup"
                ? "Create Patient Account"
                : "Sign In Securely"}
              <span>→</span>
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="login-domain-demo">
            <div>
              <strong>Quick Demo Access</strong>
              <span>Instant test access with sample clinical data</span>
            </div>

            {authMode === "patient" ? (
              <button type="button" onClick={useDemoPatient}>
                <Sparkles size={12} style={{ display: "inline", marginRight: "4px" }} />
                Demo Patient (David)
              </button>
            ) : (
              <button type="button" onClick={useDemoStaff}>
                Fill Staff Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Embedded CSS */}
      <style>{`
        .login-domain {
          position: fixed;
          inset: 0;
          z-index: 1300;
          display: grid;
          place-items: center;
          padding: 20px;
          font-family: var(--font-sans);
        }

        .login-domain-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(8, 31, 27, 0.62);
          backdrop-filter: blur(6px);
        }

        .login-domain-panel {
          position: relative;
          width: min(940px, 100%);
          max-height: calc(100dvh - 40px);
          display: grid;
          grid-template-columns: minmax(300px, 0.9fr) minmax(400px, 1.15fr);
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 24px;
          background: #FFFFFF;
          box-shadow: 0 30px 80px rgba(4, 28, 23, 0.35);
          animation: login-domain-enter 0.22s ease-out;
        }

        @media (max-width: 768px) {
          .login-domain-panel {
            grid-template-columns: 1fr;
          }
          .login-domain-intro {
            display: none !important;
          }
        }

        .login-domain-back,
        .login-domain-close {
          position: absolute;
          z-index: 2;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .login-domain-back {
          top: 20px;
          left: 22px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.88);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .login-domain-back:hover {
          color: #FFFFFF;
        }

        .login-domain-close {
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #5D6D68;
        }

        .login-domain-close:hover {
          color: #164A41;
          background: #F0F5F3;
        }

        .login-domain-intro {
          display: flex;
          flex-direction: column;
          padding: 64px 44px 36px;
          color: #FFFFFF;
          background: linear-gradient(145deg, #0C332D, #1E6558);
        }

        .login-domain-logo {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.14);
        }

        .login-domain-kicker,
        .login-domain-eyebrow {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .login-domain-kicker {
          color: #BCE8D8;
        }

        .login-domain-intro h1 {
          margin: 10px 0;
          color: #FFFFFF;
          font-family: var(--font-serif);
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.03em;
        }

        .login-domain-intro p {
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.88rem;
          line-height: 1.6;
        }

        .login-domain-trust {
          display: grid;
          gap: 10px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
        }

        .login-domain-trust span {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #D7F0E7;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .login-domain-form-area {
          padding: 40px clamp(24px, 5vw, 48px) 32px;
          overflow-y: auto;
        }

        .login-domain-eyebrow {
          color: #2F7D6D;
          margin-bottom: 4px;
        }

        .login-domain-heading h2 {
          margin: 4px 0 6px;
          color: #164A41;
          font-size: 1.4rem;
        }

        .login-domain-heading p {
          color: #6C7D77;
          font-size: 0.84rem;
        }

        .login-domain-form-area label {
          display: block;
          margin: 12px 0 5px;
          color: #31433E;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .login-domain-label-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
        }

        .login-domain-label-row span {
          color: #82918C;
          font-size: 0.7rem;
        }

        .login-domain-input {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border: 1px solid #D2DDD9;
          border-radius: 10px;
          color: #75908A;
          background: #FFFFFF;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .login-domain-input:focus-within {
          border-color: #2F7D6D;
          box-shadow: 0 0 0 3px rgba(47, 125, 109, 0.12);
        }

        .login-domain-input input {
          width: 100%;
          padding: 10px 0;
          border: 0;
          outline: 0;
          color: #17201D;
          background: transparent;
          font-size: 0.86rem;
          font-family: var(--font-sans);
        }

        .login-domain-input button {
          display: grid;
          place-items: center;
          border: 0;
          color: #527169;
          background: transparent;
          cursor: pointer;
        }

        .login-domain-submit {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          border: 1px solid #164A41;
          border-radius: 10px;
          padding: 12px 16px;
          color: #FFFFFF;
          background: #164A41;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .login-domain-submit:hover:not(:disabled) {
          background: #1D6255;
          transform: translateY(-1px);
        }

        .login-domain-submit:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .login-domain-message {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 12px;
          padding: 9px 12px;
          border: 1px solid;
          border-radius: 10px;
          font-size: 0.78rem;
          line-height: 1.4;
        }

        .login-domain-message-error {
          border-color: #EFC1C1;
          color: #A53838;
          background: #FFF5F5;
        }

        .login-domain-message-success {
          border-color: #BADDCD;
          color: #1E6C51;
          background: #F0FAF5;
        }

        .login-domain-demo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
          padding: 11px 14px;
          border: 1px solid #E2E9E6;
          border-radius: 10px;
          background: #F8FAF9;
        }

        .login-domain-demo strong {
          display: block;
          color: #244740;
          font-size: 0.76rem;
        }

        .login-domain-demo span {
          display: block;
          margin-top: 2px;
          color: #78908A;
          font-size: 0.68rem;
        }

        .login-domain-demo button {
          flex: 0 0 auto;
          border: 1px solid #B9D8CE;
          border-radius: 8px;
          padding: 7px 11px;
          color: #176252;
          background: #FFFFFF;
          font-weight: 700;
          font-size: 0.72rem;
          cursor: pointer;
        }

        @keyframes login-domain-enter {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </section>
  );
};