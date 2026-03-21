import { createContext, useContext, useState, type ReactNode } from "react";

interface CheckoutData {
  shipping: { address: string; city: string; state: string; zip: string };
  payment: { card: string; expiry: string; cvv: string };
  completed: { shipping: boolean; payment: boolean };
}

const empty: CheckoutData = {
  shipping: { address: "", city: "", state: "", zip: "" },
  payment: { card: "", expiry: "", cvv: "" },
  completed: { shipping: false, payment: false },
};

const Ctx = createContext<{
  data: CheckoutData;
  setShipping: (s: CheckoutData["shipping"]) => void;
  setPayment: (p: CheckoutData["payment"]) => void;
  reset: () => void;
}>({ data: empty, setShipping: () => {}, setPayment: () => {}, reset: () => {} });

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CheckoutData>(empty);
  return (
    <Ctx.Provider
      value={{
        data,
        setShipping: (s) => setData((d) => ({ ...d, shipping: s, completed: { ...d.completed, shipping: true } })),
        setPayment: (p) => setData((d) => ({ ...d, payment: p, completed: { ...d.completed, payment: true } })),
        reset: () => setData(empty),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useCheckout = () => useContext(Ctx);
