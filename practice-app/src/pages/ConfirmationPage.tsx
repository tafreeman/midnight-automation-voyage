import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ConfirmationPage() {
  const [orderNum, setOrderNum] = useState("");

  useEffect(() => {
    const num = sessionStorage.getItem("lastOrder");
    if (num) setOrderNum(num);
  }, []);

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 480, margin: "80px auto", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h1 data-testid="confirmation-message">Order Confirmed!</h1>
        {orderNum && (
          <p data-testid="confirmation-number" style={{ fontSize: 18, color: "#666", margin: "16px 0" }}>
            Order #{orderNum}
          </p>
        )}
        <p style={{ color: "#888" }}>Thank you for your purchase. You will receive a confirmation email shortly.</p>
        <Link to="/products" className="btn-primary" style={{ display: "inline-block", marginTop: 24 }}>Continue Shopping</Link>
      </div>
    </div>
  );
}
