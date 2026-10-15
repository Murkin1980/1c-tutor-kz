import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { course } from "../content/course";
import { SalesCycleTrainingWorkspace } from "../features/training-workspace/SalesCycleTrainingWorkspace";

export function SalesCycleLessonPage() {
  return (
    <main className="sales-cycle-lesson-page">
      <div className="sales-cycle-lesson-content">
        <Link to={`/courses/${course.slug}`} className="back-link">
          <ChevronLeft size={16} /> К содержанию курса
        </Link>
        <header style={{ margin: "18px 0 20px" }}>
          <div className="eyebrow">
            Занятие 06 · практический тренажёр · 120 минут
          </div>
          <h1 style={{ marginBottom: 8 }}>
            Продажа по предоплате: счёт → оплата → реализация → контроль долга
          </h1>
          <p style={{ maxWidth: 760, margin: 0 }}>
            Связанная цепочка документов внутри учебной рабочей области.
            Результат проверяется по сохранённым и проведённым документам и
            рассчитанному остатку взаиморасчётов, а не по введённому ответу.
          </p>
        </header>
        <SalesCycleTrainingWorkspace />
      </div>
    </main>
  );
}
