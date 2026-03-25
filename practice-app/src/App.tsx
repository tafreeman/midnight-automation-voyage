import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { CheckoutProvider } from "./CheckoutContext";
import { AuthProvider, useAuth } from "./AuthContext";
import { ToastProvider } from "./ToastContext";
import NarratorBridge from "./NarratorBridge";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/ContactPage";
import OrdersPage from "./pages/OrdersPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import ReviewPage from "./pages/ReviewPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import SettingsPage from "./pages/SettingsPage";
import AdminPage from "./pages/AdminPage";
import ActivityPage from "./pages/ActivityPage";

function Nav() {
  const { pathname } = useLocation();
  const { role } = useAuth();
  if (pathname === "/login") return null;
  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/products", label: "Products" },
    { to: "/contact", label: "Contact" },
    { to: "/orders", label: "Orders" },
    { to: "/checkout/shipping", label: "Checkout" },
    { to: "/settings", label: "Settings" },
    { to: "/activity", label: "Activity" },
  ];
  // Admin link only shows for admin role
  if (role === "admin" || role === "viewer") {
    links.push({ to: "/admin", label: "Admin" });
  }
  return (
    <nav className="flex items-center gap-6 px-6 py-3 bg-white border-b border-slate-200">
      <span className="font-bold text-[15px] text-blue-600">Practice App</span>
      <div className="flex gap-1">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-[13px] px-3 py-1.5 rounded-md no-underline font-medium transition-all ${
              pathname.startsWith(l.to)
                ? "bg-blue-50 text-blue-600"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <CheckoutProvider>
            <NarratorBridge />
            <Nav />
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/checkout/shipping" element={<ShippingPage />} />
              <Route path="/checkout/payment" element={<PaymentPage />} />
              <Route path="/checkout/review" element={<ReviewPage />} />
              <Route path="/checkout/confirmation" element={<ConfirmationPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/activity" element={<ActivityPage />} />
            </Routes>
          </CheckoutProvider>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
