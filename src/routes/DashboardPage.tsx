import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { course, allLessons } from "../content/course";
import { useProgress } from "../features/progress/progress";

export function DashboardPage() {
  const { progress } = useProgress();
  const completed = Object.values(progress).filter((item) => item.status === "completed").length;
  const percent = Math.round((completed / allLessons.length) * 100);
  const current = allLessons.find((lesson) => progress[lesson.id]?.status === "in_progress") ?? allLessons[completed] ?? allLessons[0];
  return (
    <div className="page dashboard">
      <div className="page-heading"><div><div className="eyebrow">Мой маршрут</div><h1>Добрый день, ученик</h1><p>Продолжайте с того места, где остановились.</p></div><div className="progress-stamp"><strong>{percent}%</strong><span>курса завершено</span></div></div>
      <section className="continue-card">
        <div className="course-index">01</div>
        <div><span className="status-chip">{progress[current.id] ? "В процессе" : "Можно начать"}</span><h2>{current.title}</h2><p>{current.objective}</p><div className="meta"><Clock3 size={16} /> {current.estimatedMinutes} минут</div></div>
        <Link className="button accent" to={`/learn/${current.id}`}>Продолжить <ArrowRight size={18} /></Link>
      </section>
      <div className="section-title"><h2>Мои курсы</h2><span>1 курс</span></div>
      <Link className="course-card" to={`/courses/${course.slug}`}>
        <div className="course-art"><BookOpen /><span>Практический<br />старт</span></div>
        <div className="course-info"><span className="eyebrow">Базовый уровень</span><h3>{course.title}</h3><p>{course.description}</p><div className="course-progress"><div><span style={{ width: `${percent}%` }} /></div><b>{completed} из {allLessons.length} уроков</b></div></div>
        <ArrowRight className="card-arrow" />
      </Link>
    </div>
  );
}
