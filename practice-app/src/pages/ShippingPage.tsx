import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../CheckoutContext";

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function ShippingPage() {
  const navigate = useNavigate();
  const { data, setShipping } = useCheckout();
  const [form, setForm] = useState(data.shipping);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { setForm(data.shipping); }, [data.shipping]);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleNext = () => {
    const e: Record<string, string> = {};
    if (!form.address) e.address = "Address is required";
    if (!form.city) e.city = "City is required";
    if (!form.state) e.state = "State is required";
    if (!form.zip) e.zip = "ZIP code is required";
    else if (!/^\d{5}$/.test(form.zip)) e.zip = "ZIP must be 5 digits";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setShipping(form);
    navigate("/checkout/payment");
  };

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 480, margin: "40px auto" }}>
        <div data-testid="step-indicator" className="step-indicator">Step 1 of 3: Shipping</div>
        <h1>Shipping Address</h1>
        <div className="form-group">
          <label>Address *</label>
          <input data-testid="address-input" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main St" />
          {errors.address && <p className="field-error" data-testid="address-error">{errors.address}</p>}
        </div>
        <div className="form-group">
          <label>City *</label>
          <input data-testid="city-input" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Springfield" />
          {errors.city && <p className="field-error" data-testid="city-error">{errors.city}</p>}
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>State *</label>
            <select data-testid="state-select" value={form.state} onChange={(e) => update("state", e.target.value)}>
              <option value="">Select...</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="field-error" data-testid="state-error">{errors.state}</p>}
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>ZIP *</label>
            <input data-testid="zip-input" value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="62701" />
            {errors.zip && <p className="field-error" data-testid="zip-error">{errors.zip}</p>}
          </div>
        </div>
        <button data-testid="next-button" onClick={handleNext} className="btn-primary">Continue to Payment</button>
      </div>
    </div>
  );
}
