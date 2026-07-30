import { Check, CircleDashed, FlaskConical, Target } from "lucide-react";
import { course } from "../content/course";
import { projectProgress, projectStages } from "../content/projectStages";

export function AdminPage() {
  return (
    <div className="page admin-page">
      <div className="eyebrow">Панель проекта · только для редактора</div>
      <div className="admin-progress-hero">
        <div>
          <span className="project-state"><i /> Этап 2 · следующий к реализации</span>
          <h1>От прототипа<br />к рабочему MVP</h1>
          <p>Прогресс считается по проверяемым пунктам этапов 0–5. Исследовательские этапы AI и интеграций в процент MVP не входят.</p>
        </div>
        <div className="project-gauge" aria-label={`Готовность проекта ${projectProgress.percent}%`}>
          <svg viewBox="0 0 120 120" role="img">
            <title>Готовность проекта {projectProgress.percent}%</title>
            <circle className="gauge-track" cx="60" cy="60" r="52" />
            <circle
              className="gauge-value"
              cx="60"
              cy="60"
              r="52"
              pathLength="100"
              strokeDasharray={`${projectProgress.percent} 100`}
            />
          </svg>
          <strong>{projectProgress.percent}%</strong>
          <span>{projectProgress.completed} из {projectProgress.total} пунктов</span>
        </div>
      </div>

      <section className="project-now">
        <Target />
        <div>
          <span>Следующая контрольная точка</span>
          <h2>Закрыть пилот через Cloudflare Access</h2>
          <p>Production API, отдельная D1 и синхронизация готовы. Следующая контрольная точка — закрытая ссылка для владельца и одного ученика, затем очистка тестового прогресса перед передачей курса.</p>
        </div>
      </section>

      <div className="project-stage-list">
        {projectStages.map((stage) => (
          <article className={`project-stage ${stage.status}`} key={stage.id}>
            <div className="stage-rail">
              <span>{String(stage.id).padStart(2, "0")}</span>
              <i>{stage.status === "completed" ? <Check /> : stage.status === "research" ? <FlaskConical /> : <CircleDashed />}</i>
            </div>
            <div className="stage-copy">
              <div className="stage-title-row">
                <h2>{stage.title}</h2>
                <span className="stage-status">
                  {stage.status === "completed" && "Завершён"}
                  {stage.status === "current" && "Текущий"}
                  {stage.status === "planned" && "Запланирован"}
                  {stage.status === "research" && "Требует решения"}
                </span>
              </div>
              <p>{stage.outcome}</p>
            </div>
            <ul>
              {stage.items.map((item) => (
                <li className={item.completed ? "done" : ""} key={item.label}>
                  <span>{item.completed ? <Check /> : null}</span>{item.label}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="admin-content-summary">
        <div><span className="eyebrow">Контент прототипа</span><h2>{course.title}</h2></div>
        <strong>{course.modules.length}<small>модуля</small></strong>
        <strong>{course.modules.flatMap((module) => module.lessons).length}<small>уроков</small></strong>
      </section>
      <div className="admin-notice">Контент пока доступен только для просмотра. Серверная роль и CRUD появятся после подключения MiniBase.</div>
    </div>
  );
}
