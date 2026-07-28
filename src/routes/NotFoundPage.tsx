import { Link } from "react-router-dom";
export function NotFoundPage() { return <div className="auth-page"><section className="auth-card"><div className="eyebrow">Ошибка 404</div><h1>Страница не найдена</h1><Link className="button primary full" to="/">Вернуться на главную</Link></section></div>; }
