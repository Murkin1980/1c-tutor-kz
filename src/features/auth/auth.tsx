import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "learner" | "admin";
export interface User {
  id: string;
  name: string;
  role: Role;
}
export interface AuthRepository {
  getCurrentUser(): User | null;
  saveCurrentUser(user: User): void;
  clearCurrentUser(): void;
}

const KEY = "1c-tutor-auth";

function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<User>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    (candidate.role === "learner" || candidate.role === "admin")
  );
}

export class LocalAuthRepository implements AuthRepository {
  getCurrentUser(): User | null {
    try {
      const saved = localStorage.getItem(KEY);
      if (!saved) return null;
      const parsed: unknown = JSON.parse(saved);
      return isUser(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  saveCurrentUser(user: User) {
    try {
      localStorage.setItem(KEY, JSON.stringify(user));
    } catch {
      // The local demo remains usable when browser storage is unavailable.
    }
  }

  clearCurrentUser() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Clearing the in-memory user still logs out of the current demo session.
    }
  }
}

const defaultAuthRepository = new LocalAuthRepository();

interface AuthContextValue {
  user: User | null;
  login: (role?: Role) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  repository = defaultAuthRepository,
}: {
  children: ReactNode;
  repository?: AuthRepository;
}) {
  const [user, setUser] = useState<User | null>(() =>
    repository.getCurrentUser(),
  );
  const value = useMemo(
    () => ({
      user,
      login(role: Role = "learner") {
        const next = {
          id: "demo-user",
          name: role === "admin" ? "Редактор курса" : "Ученик",
          role,
        };
        repository.saveCurrentUser(next);
        setUser(next);
      },
      logout() {
        repository.clearCurrentUser();
        setUser(null);
      },
    }),
    [repository, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
