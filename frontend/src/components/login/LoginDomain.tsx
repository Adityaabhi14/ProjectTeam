import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { signInToCarePoint } from "./loginService";

interface LoginDomainProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginDomain: React.FC<LoginDomainProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => {
        usernameRef.current?.focus();
      }, 120);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await signInToCarePoint({
        username,
        password,
      });

      if (response.success) {
        setIsError(false);
        setMessage(
          "You are signed in. Opening the Operations Center..."
        );

        window.setTimeout(() => {
          onLoginSuccess();
        }, 700);
      } else {
        setIsError(true);
        setMessage(response.message);
      }
    } catch {
      setIsError(true);
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoAccount = () => {
    setUsername("admin");
    setPassword("admin123");

    setMessage(
      "Demo credentials added. Select Sign in securely to continue."
    );

    setIsError(false);
  };

  return (
    <section
      className="login-domain"
      role="dialog"
      aria-modal="true"
      aria-label="CarePoint sign in"
    >
      {/* Background */}
      <div
        className="login-domain-backdrop"
        onClick={onClose}
      />

      {/* Login Panel */}
      <div className="login-domain-panel">

        {/* Back Button */}
        <button
          type="button"
          className="login-domain-back"
          onClick={onClose}
        >
          <ArrowLeft size={17} />
          Back to CarePoint
        </button>

        {/* Close Button */}
        <button
          type="button"
          className="login-domain-close"
          onClick={onClose}
          aria-label="Close sign in"
        >
          <X size={21} />
        </button>

        {/* LEFT SIDE */}
        <div className="login-domain-intro">

          <div className="login-domain-logo">
            <HeartPulse size={30} />
          </div>

          <span className="login-domain-kicker">
            CarePoint Health System
          </span>

          <h1>Welcome back.</h1>

          <p>
            Securely access the CarePoint Operations Center
            to manage clinical care and hospital services.
          </p>

          <div className="login-domain-trust">

            <span>
              <ShieldCheck size={17} />
              Protected staff access
            </span>

            <span>
              <CheckCircle2 size={17} />
              Role-based workspace
            </span>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-domain-form-area">

          <div className="login-domain-heading">

            <p className="login-domain-eyebrow">
              Staff sign in
            </p>

            <h2>
              Enter your account details
            </h2>

            <p>
              Use the demo account below to access
              the CarePoint frontend.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* Message */}
            {message && (
              <div
                className={`login-domain-message ${
                  isError
                    ? "login-domain-message-error"
                    : "login-domain-message-success"
                }`}
              >
                {isError ? (
                  <X size={17} />
                ) : (
                  <CheckCircle2 size={17} />
                )}

                <span>{message}</span>
              </div>
            )}

            {/* Username */}
            <label htmlFor="login-domain-username">
              Username
            </label>

            <div className="login-domain-input">

              <UserRound size={18} />

              <input
                ref={usernameRef}
                id="login-domain-username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter your username"
                required
              />

            </div>

            {/* Password */}
            <div className="login-domain-label-row">

              <label htmlFor="login-domain-password">
                Password
              </label>

              <span>
                Frontend demo login
              </span>

            </div>

            <div className="login-domain-input">

              <LockKeyhole size={18} />

              <input
                id="login-domain-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-domain-submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing you in..."
                : "Sign in securely"}

              <span>→</span>
            </button>

          </form>

          {/* Demo Login */}
          <div className="login-domain-demo">

            <div>
              <strong>
                Demo workspace
              </strong>

              <span>
                No backend required.
              </span>
            </div>

            <button
              type="button"
              onClick={useDemoAccount}
            >
              Use demo login
            </button>

          </div>

          {/* Notice */}
          <p className="login-domain-notice">
            <ShieldCheck size={14} />
            This is a frontend demonstration login.
          </p>

        </div>
      </div>

      {/* CSS */}
      <style>{`

        .login-domain {
          position: fixed;
          inset: 0;
          z-index: 1300;
          display: grid;
          place-items: center;
          padding: 22px;
          font-family: var(--font-sans);
        }

        .login-domain-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(8, 31, 27, 0.58);
          backdrop-filter: blur(5px);
        }

        .login-domain-panel {
          position: relative;
          width: min(930px, 100%);
          min-height: min(
            610px,
            calc(100dvh - 44px)
          );

          display: grid;

          grid-template-columns:
            minmax(290px, 0.9fr)
            minmax(390px, 1.1fr);

          overflow: auto;

          border: 1px solid
            rgba(255, 255, 255, 0.34);

          border-radius: 24px;

          background: #fff;

          box-shadow:
            0 30px 80px
            rgba(4, 28, 23, 0.34);

          animation:
            login-domain-enter
            0.25s ease-out;
        }

        .login-domain-back,
        .login-domain-close {
          position: absolute;
          z-index: 1;

          border: 0;
          background: transparent;

          cursor: pointer;

          font:
            700 0.78rem
            var(--font-sans);
        }

        .login-domain-back {
          top: 22px;
          left: 24px;

          display: inline-flex;
          align-items: center;

          gap: 7px;

          color: rgba(255, 255, 255, 0.86);
        }

        .login-domain-back:hover {
          color: #fff;
        }

        .login-domain-close {
          top: 18px;
          right: 18px;

          width: 36px;
          height: 36px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #5d6d68;
        }

        .login-domain-close:hover {
          color: #164a41;
          background: #f0f5f3;
        }

        .login-domain-intro {
          display: flex;
          flex-direction: column;
          justify-content: center;

          padding:
            78px 54px 42px;

          color: #fff;

          background:
            radial-gradient(
              circle at 82% 13%,
              rgba(110, 193, 169, 0.28),
              transparent 27%
            ),
            linear-gradient(
              145deg,
              #0c332d,
              #1e6558
            );
        }

        .login-domain-logo {
          width: 58px;
          height: 58px;

          display: grid;
          place-items: center;

          margin-bottom: 30px;

          border:
            1px solid
            rgba(255, 255, 255, 0.25);

          border-radius: 18px;

          background:
            rgba(255, 255, 255, 0.13);
        }

        .login-domain-kicker,
        .login-domain-eyebrow {
          font-size: 0.71rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .login-domain-kicker {
          color: #bce8d8;
        }

        .login-domain-intro h1 {
          margin: 12px 0;

          color: #fff;

          font:
            500
            clamp(2.25rem, 4vw, 3.25rem)
            var(--font-serif);

          letter-spacing: -0.04em;
        }

        .login-domain-intro p {
          max-width: 30ch;

          color:
            rgba(255, 255, 255, 0.8);

          line-height: 1.7;
        }

        .login-domain-trust {
          display: grid;
          gap: 12px;

          margin-top: 34px;
          padding-top: 24px;

          border-top:
            1px solid
            rgba(255, 255, 255, 0.18);
        }

        .login-domain-trust span {
          display: flex;
          align-items: center;

          gap: 9px;

          color: #d7f0e7;

          font-size: 0.79rem;
          font-weight: 700;
        }

        .login-domain-form-area {
          align-self: center;

          padding:
            68px
            clamp(28px, 6vw, 68px)
            38px;
        }

        .login-domain-heading {
          margin-bottom: 27px;
        }

        .login-domain-eyebrow {
          color: #2f7d6d;
        }

        .login-domain-heading h2 {
          margin: 7px 0 8px;

          color: #164a41;

          font-size: 1.52rem;
        }

        .login-domain-heading p:last-child {
          color: #6c7d77;

          font-size: 0.83rem;
          line-height: 1.6;
        }

        .login-domain-form-area label {
          display: block;

          margin: 16px 0 7px;

          color: #31433e;

          font-size: 0.8rem;
          font-weight: 800;
        }

        .login-domain-label-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;

          gap: 12px;
        }

        .login-domain-label-row span {
          color: #82918c;

          font-size: 0.66rem;

          text-align: right;
        }

        .login-domain-input {
          display: flex;
          align-items: center;

          gap: 9px;

          padding: 0 12px;

          border:
            1px solid #d2ddd9;

          border-radius: 12px;

          color: #75908a;

          background: #fff;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .login-domain-input:focus-within {
          border-color: #2f7d6d;

          box-shadow:
            0 0 0 3px
            rgba(47, 125, 109, 0.12);
        }

        .login-domain-input input {
          width: 100%;

          padding: 13px 0;

          border: 0;
          outline: 0;

          color: #17201d;

          background: transparent;

          font:
            0.86rem
            var(--font-sans);
        }

        .login-domain-input input::placeholder {
          color: #a0aca8;
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

          margin-top: 23px;

          border:
            1px solid #164a41;

          border-radius: 12px;

          padding: 14px 16px;

          color: #fff;

          background: #164a41;

          font:
            800
            0.87rem
            var(--font-sans);

          cursor: pointer;

          transition:
            transform 0.18s ease,
            background 0.18s ease;
        }

        .login-domain-submit:hover:not(:disabled) {
          background: #1d6255;
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

          margin-bottom: 14px;

          padding: 10px 11px;

          border: 1px solid;

          border-radius: 10px;

          font-size: 0.76rem;

          line-height: 1.45;
        }

        .login-domain-message-error {
          border-color: #efc1c1;

          color: #a53838;

          background: #fff5f5;
        }

        .login-domain-message-success {
          border-color: #baddcd;

          color: #1e6c51;

          background: #f0faf5;
        }

        .login-domain-demo {
          display: flex;

          justify-content: space-between;
          align-items: center;

          gap: 16px;

          margin-top: 22px;

          padding: 13px;

          border:
            1px solid #e2e9e6;

          border-radius: 12px;

          background: #f8faf9;
        }

        .login-domain-demo strong,
        .login-domain-demo span {
          display: block;
        }

        .login-domain-demo strong {
          color: #244740;
          font-size: 0.76rem;
        }

        .login-domain-demo span {
          margin-top: 2px;

          color: #78908a;

          font-size: 0.66rem;
        }

        .login-domain-demo button {
          flex: 0 0 auto;

          border:
            1px solid #b9d8ce;

          border-radius: 8px;

          padding: 8px 10px;

          color: #176252;

          background: #fff;

          font:
            800
            0.7rem
            var(--font-sans);

          cursor: pointer;
        }

        .login-domain-demo button:hover {
          background: #e8f5f1;
        }

        .login-domain-notice {
          display: flex;
          justify-content: center;
          align-items: center;

          gap: 5px;

          margin-top: 16px;

          color: #84938e;

          font-size: 0.65rem;

          text-align: center;
        }

        @keyframes login-domain-enter {
          from {
            opacity: 0;
            transform:
              translateY(13px)
              scale(0.985);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @media (max-width: 720px) {

          .login-domain {
            padding: 0;
          }

          .login-domain-panel {
            min-height: 100dvh;
            max-height: 100dvh;

            border: 0;
            border-radius: 0;

            grid-template-columns: 1fr;
          }

          .login-domain-intro {
            min-height: 260px;

            justify-content: flex-end;

            padding:
              68px 28px 29px;
          }

          .login-domain-intro h1 {
            margin: 7px 0;

            font-size: 2.3rem;
          }

          .login-domain-intro p {
            font-size: 0.82rem;
          }

          .login-domain-trust {
            display: flex;
            flex-wrap: wrap;

            gap: 10px 17px;

            margin-top: 17px;
            padding-top: 15px;
          }

          .login-domain-form-area {
            padding:
              30px 28px 38px;
          }

          .login-domain-back {
            top: 20px;
            left: 22px;
          }

          .login-domain-close {
            color: #fff;
          }

          .login-domain-close:hover {
            color: #fff;
            background:
              rgba(255, 255, 255, 0.12);
          }
        }

        @media (max-width: 420px) {

          .login-domain-label-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 0;
          }

          .login-domain-label-row span {
            text-align: left;
          }

          .login-domain-demo {
            align-items: flex-start;
            flex-direction: column;
          }

          .login-domain-demo button {
            width: 100%;
          }
        }

      `}</style>
    </section>
  );
};