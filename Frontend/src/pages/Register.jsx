import "./Register.css";
import { useState, useRef } from "react";

function Register() {
  const [name, setName] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    console.log("Register button clicked");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        setStatus({ type: "success", text: "Registration successful. You can log in now." });
      } else {
        setStatus({ type: "error", text: data.message || "Registration failed." });
      }
    } catch (error) {
      console.log("Error:", error);
      setStatus({ type: "error", text: "Backend connect nahi ho raha." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <span className="bubble b1" aria-hidden="true" />
      <span className="bubble b2" aria-hidden="true" />

      <form
        className="register-box"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onSubmit={handleRegister}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className="eyebrow">Real-time messaging</div>
        <h1>Create your account</h1>

        {status && <div className={`status-banner ${status.type}`}>{status.text}</div>}

        <label htmlFor="reg-name">Name</label>
        <input
          id="reg-name"
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </button>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;