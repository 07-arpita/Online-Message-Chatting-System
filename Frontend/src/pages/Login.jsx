import "./Login.css";
import { useState, useRef } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    console.log("Login button clicked");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("Status:", response.status);
      console.log("Response:", data);

      if (response.ok) {
        // Save logged in user
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Login User:", data.user);

        setStatus({ type: "success", text: "Login successful. Redirecting…" });

        // Chat page
        window.location.href = "/chat";
      } else {
        setStatus({ type: "error", text: data.message || "Login failed." });
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
        onSubmit={handleLogin}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className="eyebrow">Real-time messaging</div>
        <h1>Online Message Chatting</h1>
        <h2>Login</h2>

        {status && <div className={`status-banner ${status.type}`}>{status.text}</div>}

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="forgot-link">
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>

        <p>
          Don't have an account?
          <a href="/register"> Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;