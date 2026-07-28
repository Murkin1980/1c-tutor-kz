import { ArrowRight, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="eyebrow">Практика вместо длинных лекций</div>
        <h1>Освойте учёт <span>руками,</span><br />в безопасном темпе.</h1>
        <p className="hero-copy">Короткие задания сопровождают вас рядом с отдельной учебной базой «1С:Бухгалтерия для Казахстана» — с подсказками и понятной проверкой результата.</p>
        <div className="hero-actions">
          <Link className="button primary" to="/login">Начать практику <ArrowRight size={19} /></Link>
          <a className="text-link" href="#method">Как это работает</a>
        </div>
        <div className="trust-row"><ShieldCheck /><span>Никаких реальных реквизитов</span><span className="dot">•</span><span>Только учебная база</span></div>
      </section>
      <aside className="lesson-preview" aria-label="Пример урока">
        <div className="paper-number">Урок 01</div>
        <div className="preview-meta"><span>12 минут</span><span>Практика</span></div>
        <h2>Первый учебный счёт</h2>
        <ol>
          <li className="done"><CheckCircle2 /> Открыть раздел «Продажи»</li>
          <li className="active"><span>2</span> Создать новый счёт</li>
          <li><span>3</span> Проверить сумму</li>
        </ol>
        <div className="preview-launch">Открыть учебную 1С <ExternalLink size={16} /></div>
      </aside>
      <section id="method" className="method">
        <div><b>01</b><h3>Читайте</h3><p>Одна цель и короткий маршрут без лишней теории.</p></div>
        <div><b>02</b><h3>Делайте</h3><p>Практикуйтесь в отдельной базе в соседней вкладке.</p></div>
        <div><b>03</b><h3>Проверяйте</h3><p>Получайте обратную связь и сохраняйте прогресс.</p></div>
      </section>
      <footer className="disclaimer">1C Tutor KZ — независимый учебный тренажёр. Не является официальным продуктом фирмы «1С» и не заменяет консультацию бухгалтера.</footer>
    </div>
  );
}
