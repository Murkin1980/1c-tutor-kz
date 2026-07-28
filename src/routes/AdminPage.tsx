import { course } from "../content/course";

export function AdminPage() {
  return <div className="page narrow-page"><div className="eyebrow">Только для редактора</div><h1>Контент курса</h1><div className="admin-notice">В первой итерации контент доступен только для просмотра. Серверная роль и CRUD появятся после подключения Supabase.</div>{course.modules.map((module) => <section className="settings-card vertical" key={module.id}><h2>{module.title}</h2><p>{module.lessons.length} уроков · локальный JSON</p></section>)}</div>;
}
