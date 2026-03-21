import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { CheckoutProvider } from "./CheckoutContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/ContactPage";
import OrdersPage from "./pages/OrdersPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import ReviewPage from "./pages/ReviewPage";
import ConfirmationPage from "./pages/ConfirmationPage";

function Nav() {
  const { pathname } = useLocation();
  if (pathname === "/login") return null;
  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/products", label: "Products" },
    { to: "/contact", label: "Contact" },
    { to: "/orders", label: "Orders" },
    { to: "/checkout/shipping", label: "Checkout" },
  ];
  return (
    <nav className="app-nav">
      <span className="nav-brand">Practice App</span>
      <div className="nav-links">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className={pathname.startsWith(l.to) ? "active" : ""}>{l.label}</Link>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CheckoutProvider>
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
        </Routes>
      </CheckoutProvider>
    </BrowserRouter>
  );
}
