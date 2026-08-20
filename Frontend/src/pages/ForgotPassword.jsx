import "./Login.css";
import { useState, useRef } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "error" | "success", text }

  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - py) * 14, y: (px - 0.5) * 14 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    console.log("Forgot password submitted for:", email);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      console.log("Status:", response.status);
      console.log("Response:", data);

      if (response.ok) {
        setStatus({
          type: "success",
          text: "If that email is registered, a reset link has been sent.",
        });
      } else {
        setStatus({ type: "error", text: data.message || "Something went wrong." });
      }
    } catch (error) {
      console.log(error);
      setStatus({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <span className="bubble b1" aria-hidden="true" />
      <span className="bubble b2" aria-hidden="true" />

      <form
        className="login-box"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onSubmit={handleForgotPassword}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className="eyebrow">Account recovery</div>
        <h1>Forgot password?</h1>
        <h2>We'll email you a reset link</h2>

        {status && <div className={`status-banner ${status.type}`}>{status.text}</div>}

        <label htmlFor="forgot-email">Email</label>
        <input
          id="forgot-email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </button>

        <p>
          Remembered it? <a href="/login">Back to Login</a>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;