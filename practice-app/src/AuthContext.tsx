import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Role = "admin" | "editor" | "viewer";

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContextValue>({
  user: null,
  role: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("auth");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("auth");
      }
    }
  }, []);

  const login = useCallback((u: AuthUser) => {
    setUser(u);
    sessionStorage.setItem("auth", JSON.stringify(u));
    // Also set the legacy "user" key for backward compat with DashboardPage
    sessionStorage.setItem("user", JSON.stringify({ name: u.name, email: u.email }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("user");
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
