const DEFAULT_PRACTICE_APP_URL = "http://localhost:5173";

function readStoredPracticeUrl() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("mav-practice-url");
}

// Practice app URL configuration
// Priority: localStorage override > env var > default
export function getPracticeAppBaseUrl() {
  return (
    readStoredPracticeUrl() ||
    import.meta.env.VITE_PRACTICE_URL ||
    DEFAULT_PRACTICE_APP_URL
  );
}

export const PRACTICE_APP_URL = getPracticeAppBaseUrl();

export function practiceUrl(route = "/") {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  const base = getPracticeAppBaseUrl().replace(/\/$/, "");

  if (base.includes("#")) {
    return `${base.replace(/#.*$/, "")}#${normalizedRoute}`;
  }

  if (base.endsWith(".html")) {
    return `${base}#${normalizedRoute}`;
  }

  return `${base}/#${normalizedRoute}`;
}

export function setPracticeAppUrl(url: string) {
  localStorage.setItem("mav-practice-url", url);
}

export function resetPracticeAppUrl() {
  localStorage.removeItem("mav-practice-url");
}
