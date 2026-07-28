import { BookOpen, GraduationCap, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/auth";

const links = [
  { to: "/dashboard", label: "Обучение", icon: LayoutDashboard },
  { to: "/courses/prakticheskiy-start", label: "Курс", icon: BookOpen },
  { to: "/profile", label: "Профиль", icon: Settings },
];
export function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="1C Tutor KZ — на главную">
          <span className="brand-mark"><GraduationCap size={20} /></span>
          <span>1C Tutor <em>KZ</em></span>
        </NavLink>
        <span className="study-label">Независимый учебный тренажёр</span>
        {user && <button className="quiet-button desktop-only" onClick={logout}><LogOut size={17} /> Выйти</button>}
      </header>
      <main><Outlet /></main>
      {user && (
        <nav className="mobile-nav" aria-label="Основная навигация">
          {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon size={19} /><span>{label}</span></NavLink>)}
        </nav>
      )}
    </div>
  );
}
