/** Practice app route paths — used by both training and test harnesses */
export const PRACTICE_ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  CONTACT: "/contact",
  ORDERS: "/orders",
  CHECKOUT_SHIPPING: "/checkout/shipping",
  CHECKOUT_PAYMENT: "/checkout/payment",
  CHECKOUT_REVIEW: "/checkout/review",
  CHECKOUT_CONFIRMATION: "/checkout/confirmation",
  SETTINGS: "/settings",
  ADMIN: "/admin",
  ACTIVITY: "/activity",
} as const;

export type PracticeRoute = (typeof PRACTICE_ROUTES)[keyof typeof PRACTICE_ROUTES];
