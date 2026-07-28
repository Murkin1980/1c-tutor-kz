import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Role = "learner" | "admin";
export interface User { id: string; name: string; role: Role }
interface AuthContextValue {
  user: User | null;
  login: (role?: Role) => void;
  logout: () => void;
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
    login(role: Role = "learner") {
      const next = { id: "demo-user", name: role === "admin" ? "Редактор курса" : "Ученик", role };
      localStorage.setItem(KEY, JSON.stringify(next));
      setUser(next);
    },
    logout() { localStorage.removeItem(KEY); setUser(null); },
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
