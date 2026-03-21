import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { USERS } from "../data";

const failCounts: Record<string, number> = {};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string; lockout?: string }>({});

  const hasValues = email.length > 0 && password.length > 0;

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    // Client-side validation
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check lockout
    if ((failCounts[email] || 0) >= 5) {
      setErrors({ lockout: "Account locked. Please try again in 15 minutes." });
      return;
    }

    // Server-side auth check
    const user = USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
      failCounts[email] = (failCounts[email] || 0) + 1;
      if (failCounts[email] >= 5) {
        setErrors({ lockout: "Account locked. Please try again in 15 minutes." });
      } else {
        setErrors({ general: "Invalid email or password" });
      }
      return;
    }

    // Success
    failCounts[email] = 0;
    sessionStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  const isLockedOut = !!errors.lockout;

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 400, margin: "80px auto" }}>
        <h1>Log In</h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            data-testid="email-input"
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
            placeholder="you@example.com"
          />
          {errors.email && <p className="field-error" data-testid="email-error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            data-testid="password-input"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
            placeholder="••••••••"
          />
          {errors.password && <p className="field-error" data-testid="password-error">{errors.password}</p>}
        </div>
        {errors.general && <p className="page-error" data-testid="error-message">{errors.general}</p>}
        {errors.lockout && <p className="page-error lockout" data-testid="lockout-message">{errors.lockout}</p>}
        <button
          data-testid="login-button"
          onClick={handleSubmit}
          disabled={!hasValues || isLockedOut}
          className="btn-primary"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
