import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { MiniBaseClient } from "../../shared/minibase/client";
import { miniBaseConfig } from "../../shared/minibase/config";

export type Role = "learner" | "admin";
export interface User { id: string; name: string; role: Role }
interface AuthContextValue {
  user: User | null;
  login: (role?: Role) => Promise<"remote" | "local">;
  logout: () => Promise<void>;
}
const KEY = "1c-tutor-auth";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  });
  const value = useMemo(() => ({
    user,
    async login(role: Role = "learner") {
      let mode: "remote" | "local" = "local";
      if (miniBaseConfig.mode === "remote") {
        try {
          await new MiniBaseClient(miniBaseConfig).exchangeAccessSession();
          mode = "remote";
        } catch (error) {
          console.warn("MiniBase session exchange unavailable; continuing locally", error);
        }
      }
      const next = { id: "demo-user", name: role === "admin" ? "Редактор курса" : "Ученик", role };
      localStorage.setItem(KEY, JSON.stringify(next));
      setUser(next);
      return mode;
    },
    async logout() {
      if (miniBaseConfig.mode === "remote") {
        try { await new MiniBaseClient(miniBaseConfig).endSession(); } catch { /* best effort */ }
      }
      localStorage.removeItem(KEY);
      setUser(null);
    },
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
