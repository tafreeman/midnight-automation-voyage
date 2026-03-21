import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../CheckoutContext";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { data, setPayment } = useCheckout();
  const [form, setForm] = useState(data.payment);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data.completed.shipping) { navigate("/checkout/shipping"); return; }
    setForm(data.payment);
  }, [data, navigate]);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleNext = () => {
    const e: Record<string, string> = {};
    if (!form.card) e.card = "Card number is required";
    else if (!/^\d{16}$/.test(form.card.replace(/\s/g, ""))) e.card = "Card must be 16 digits";
    if (!form.expiry) e.expiry = "Expiry is required";
    else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "Use MM/YY format";
    if (!form.cvv) e.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "CVV must be 3–4 digits";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setPayment(form);
    navigate("/checkout/review");
  };

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 480, margin: "40px auto" }}>
        <div data-testid="step-indicator" className="step-indicator">Step 2 of 3: Payment</div>
        <h1>Payment Details</h1>
        <div className="form-group">
          <label>Card Number *</label>
          <input data-testid="card-input" value={form.card} onChange={(e) => update("card", e.target.value)} placeholder="1234567890123456" />
          {errors.card && <p className="field-error" data-testid="card-error">{errors.card}</p>}
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Expiry *</label>
            <input data-testid="expiry-input" value={form.expiry} onChange={(e) => update("expiry", e.target.value)} placeholder="MM/YY" />
            {errors.expiry && <p className="field-error" data-testid="expiry-error">{errors.expiry}</p>}
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>CVV *</label>
            <input data-testid="cvv-input" value={form.cvv} onChange={(e) => update("cvv", e.target.value)} placeholder="123" />
            {errors.cvv && <p className="field-error" data-testid="cvv-error">{errors.cvv}</p>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button data-testid="back-button" onClick={() => navigate("/checkout/shipping")} className="btn-secondary">Back</button>
          <button data-testid="next-button" onClick={handleNext} className="btn-primary" style={{ flex: 1 }}>Review Order</button>
        </div>
      </div>
    </div>
  );
}
