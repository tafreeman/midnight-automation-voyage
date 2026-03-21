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
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-[480px] mx-auto mt-10">
        <div data-testid="step-indicator" className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 px-3 py-1.5 bg-blue-50 rounded-md inline-block">Step 3 of 3: Review</div>
        <h1 className="text-[22px] font-bold mb-5 text-slate-900">Review Your Order</h1>
        <div data-testid="order-summary" className="mb-6">
          <div data-testid="shipping-summary" className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-3">
            <h3 className="text-[13px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">Shipping</h3>
            <p className="text-sm text-slate-800 leading-relaxed">{data.shipping.address}</p>
            <p className="text-sm text-slate-800 leading-relaxed">{data.shipping.city}, {data.shipping.state} {data.shipping.zip}</p>
          </div>
          <div data-testid="payment-summary" className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-3">
            <h3 className="text-[13px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">Payment</h3>
            <p className="text-sm text-slate-800 leading-relaxed">Card ending in {data.payment.card.slice(-4)}</p>
            <p className="text-sm text-slate-800 leading-relaxed">Expires {data.payment.expiry}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button data-testid="back-button" onClick={() => navigate("/checkout/payment")} className="inline-block py-2.5 px-5 bg-white text-gray-700 border border-gray-300 rounded-lg text-[13px] font-medium cursor-pointer transition-all font-sans hover:bg-gray-50 hover:border-gray-400">Back</button>
          <button data-testid="place-order-button" onClick={handlePlaceOrder} className="flex-1 py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700">Place Order</button>
        </div>
      </div>
    </div>
  );
}
