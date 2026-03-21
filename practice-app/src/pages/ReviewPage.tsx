import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../CheckoutContext";

export default function ReviewPage() {
  const navigate = useNavigate();
  const { data, reset } = useCheckout();

  useEffect(() => {
    if (!data.completed.shipping || !data.completed.payment) {
      navigate("/checkout/shipping");
    }
  }, [data, navigate]);

  if (!data.completed.shipping || !data.completed.payment) return null;

  const handlePlaceOrder = () => {
    const orderNum = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    sessionStorage.setItem("lastOrder", orderNum);
    reset();
    navigate("/checkout/confirmation");
  };

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 480, margin: "40px auto" }}>
        <div data-testid="step-indicator" className="step-indicator">Step 3 of 3: Review</div>
        <h1>Review Your Order</h1>
        <div data-testid="order-summary" className="summary-section">
          <div data-testid="shipping-summary" className="summary-block">
            <h3>Shipping</h3>
            <p>{data.shipping.address}</p>
            <p>{data.shipping.city}, {data.shipping.state} {data.shipping.zip}</p>
          </div>
          <div data-testid="payment-summary" className="summary-block">
            <h3>Payment</h3>
            <p>Card ending in {data.payment.card.slice(-4)}</p>
            <p>Expires {data.payment.expiry}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button data-testid="back-button" onClick={() => navigate("/checkout/payment")} className="btn-secondary">Back</button>
          <button data-testid="place-order-button" onClick={handlePlaceOrder} className="btn-primary" style={{ flex: 1 }}>Place Order</button>
        </div>
      </div>
    </div>
  );
}
