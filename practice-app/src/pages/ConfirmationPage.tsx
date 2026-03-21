import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ConfirmationPage() {
  const [orderNum, setOrderNum] = useState("");

  useEffect(() => {
    const num = sessionStorage.getItem("lastOrder");
    if (num) setOrderNum(num);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-[480px] mx-auto mt-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 data-testid="confirmation-message" className="text-[22px] font-bold mb-5 text-slate-900">Order Confirmed!</h1>
        {orderNum && (
          <p data-testid="confirmation-number" className="text-lg text-gray-500 my-4">
            Order #{orderNum}
          </p>
        )}
        <p className="text-gray-400">Thank you for your purchase. You will receive a confirmation email shortly.</p>
        <Link to="/products" className="inline-block mt-6 py-2.5 px-5 bg-blue-600 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors font-sans hover:bg-blue-700 no-underline">Continue Shopping</Link>
      </div>
    </div>
  );
}
