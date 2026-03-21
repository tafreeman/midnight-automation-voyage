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
    <div className="max-w-4xl mx-auto py-8 px-6">
      <h1 data-testid="dashboard-heading" className="text-[22px] font-bold mb-5 text-slate-900">Welcome, {user.name}</h1>
      <p className="text-gray-500 mb-8">You're logged in as {user.email}</p>
      <div className="flex gap-4 flex-wrap">
        <Link to="/products" className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer no-underline transition-all font-sans hover:bg-gray-50 hover:border-gray-400">Products</Link>
        <Link to="/contact" className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer no-underline transition-all font-sans hover:bg-gray-50 hover:border-gray-400">Contact</Link>
        <Link to="/orders" className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer no-underline transition-all font-sans hover:bg-gray-50 hover:border-gray-400">Orders</Link>
        <Link to="/checkout/shipping" className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer no-underline transition-all font-sans hover:bg-gray-50 hover:border-gray-400">Checkout</Link>
      </div>
    </div>
  );
}
