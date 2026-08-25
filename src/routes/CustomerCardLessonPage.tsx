import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { course } from "../content/course";
import { CustomerCardTrainingWorkspace } from "../features/training-workspace/CustomerCardTrainingWorkspace";

export function CustomerCardLessonPage() {
  return <main className="customer-card-lesson-page">
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px clamp(12px, 3vw, 32px) 48px" }}>
      <Link to={`/courses/${course.slug}`} className="back-link"><ChevronLeft size={16}/> К содержанию курса</Link>
      <header style={{ margin: "18px 0 20px" }}>
        <div className="eyebrow">Stage 1B · практический тренажёр</div>
        <h1 style={{ marginBottom: 8 }}>Карточка учебного покупателя</h1>
        <p style={{ maxWidth: 760, margin: 0 }}>Первый встроенный сценарий 1C Tutor: действие выполняется внутри учебной рабочей области, а результат проверяется по состоянию среды.</p>
      </header>
      <CustomerCardTrainingWorkspace />
    </div>
  </main>;
}
