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
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-[480px] mx-auto mt-10">
        <div data-testid="step-indicator" className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 px-3 py-1.5 bg-blue-50 rounded-md inline-block">Step 1 of 3: Shipping</div>
        <h1 className="text-[22px] font-bold mb-5 text-slate-900">Shipping Address</h1>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Address *</label>
          <input data-testid="address-input" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main St" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
          {errors.address && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="address-error">{errors.address}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">City *</label>
          <input data-testid="city-input" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Springfield" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
          {errors.city && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="city-error">{errors.city}</p>}
        </div>
        <div className="flex gap-3">
          <div className="flex-1 mb-4">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">State *</label>
            <select data-testid="state-select" value={form.state} onChange={(e) => update("state", e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10">
              <option value="">Select...</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="state-error">{errors.state}</p>}
          </div>
          <div className="flex-1 mb-4">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">ZIP *</label>
            <input data-testid="zip-input" value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="62701" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
            {errors.zip && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="zip-error">{errors.zip}</p>}
          </div>
        </div>
        <button data-testid="next-button" onClick={handleNext} className="block w-full py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700">Continue to Payment</button>
      </div>
    </div>
  );
}
