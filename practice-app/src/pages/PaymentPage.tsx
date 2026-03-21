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
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-[480px] mx-auto mt-10">
        <div data-testid="step-indicator" className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 px-3 py-1.5 bg-blue-50 rounded-md inline-block">Step 2 of 3: Payment</div>
        <h1 className="text-[22px] font-bold mb-5 text-slate-900">Payment Details</h1>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Card Number *</label>
          <input data-testid="card-input" value={form.card} onChange={(e) => update("card", e.target.value)} placeholder="1234567890123456" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
          {errors.card && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="card-error">{errors.card}</p>}
        </div>
        <div className="flex gap-3">
          <div className="flex-1 mb-4">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Expiry *</label>
            <input data-testid="expiry-input" value={form.expiry} onChange={(e) => update("expiry", e.target.value)} placeholder="MM/YY" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
            {errors.expiry && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="expiry-error">{errors.expiry}</p>}
          </div>
          <div className="flex-1 mb-4">
            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">CVV *</label>
            <input data-testid="cvv-input" value={form.cvv} onChange={(e) => update("cvv", e.target.value)} placeholder="123" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-sans bg-white text-slate-900 transition-colors focus:outline-none focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10" />
            {errors.cvv && <p className="text-xs text-red-600 mt-1 font-medium" data-testid="cvv-error">{errors.cvv}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <button data-testid="back-button" onClick={() => navigate("/checkout/shipping")} className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer transition-all font-sans hover:bg-gray-50 hover:border-gray-400">Back</button>
          <button data-testid="next-button" onClick={handleNext} className="flex-1 py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700">Review Order</button>
        </div>
      </div>
    </div>
  );
}
