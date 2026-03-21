import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { USERS } from "../data";
import { useAuth } from "../AuthContext";

// NOTE: Module-level mutable state is intentional for this test-target app.
// It simulates a server-side lockout counter without actual backend persistence.
// Will not survive HMR in dev — acceptable for Playwright training purposes.
const failCounts: Record<string, number> = {};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
    login({ name: user.name, email: user.email, role: user.role });
    navigate("/dashboard");
  };

  const isLockedOut = !!errors.lockout;

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-[400px] mx-auto mt-20">
        <h1 className="text-[22px] font-bold mb-5 text-slate-900">Log In</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email</label>
          <input
            id="email"
            data-testid="email-input"
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="email-error">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
          <input
            id="password"
            data-testid="password-input"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10"
          />
          {errors.password && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="password-error">{errors.password}</p>}
        </div>
        {errors.general && <p className="text-[13px] text-red-600 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg mb-4 font-medium" data-testid="error-message">{errors.general}</p>}
        {errors.lockout && <p className="text-[13px] text-red-700 px-3.5 py-2.5 bg-red-100 border border-red-300 rounded-lg mb-4 font-medium" data-testid="lockout-message">{errors.lockout}</p>}
        <button
          data-testid="login-button"
          onClick={handleSubmit}
          disabled={!hasValues || isLockedOut}
          className="block w-full py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
