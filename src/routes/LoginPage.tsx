import { ArrowRight, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";
  const handleLogin = (admin = false) => { login(admin ? "admin" : "learner"); navigate(from, { replace: true }); };
  return (
    <div className="auth-page">
      <section className="auth-card">
        <div className="eyebrow">Демонстрационный вход</div>
        <h1>Продолжим обучение</h1>
        <p>На первом этапе аккаунт хранится только в этом браузере.</p>
        <label>Email<input type="email" defaultValue="student@example.test" /></label>
        <label>Пароль<input type="password" defaultValue="training-only" /></label>
        <button className="button primary full" onClick={() => handleLogin()}>Войти как ученик <ArrowRight size={18} /></button>
        <button className="text-button" onClick={() => handleLogin(true)}>Демо-вход редактора</button>
        <div className="safe-note"><ShieldCheck /><span>Не используйте здесь пароль от 1С или рабочей почты.</span></div>
      </section>
    </div>
  );
}
