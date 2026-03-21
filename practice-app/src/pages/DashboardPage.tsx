import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="page">
      <h1 data-testid="dashboard-heading">Welcome, {user.name}</h1>
      <p className="dashboard-subtitle">You're logged in as {user.email}</p>
      <div className="dashboard-links">
        <Link to="/products" className="btn-secondary">Products</Link>
        <Link to="/contact" className="btn-secondary">Contact</Link>
        <Link to="/orders" className="btn-secondary">Orders</Link>
        <Link to="/checkout/shipping" className="btn-secondary">Checkout</Link>
      </div>
    </div>
  );
}
