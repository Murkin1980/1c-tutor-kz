import { AlertTriangle, Check, ChevronLeft, ChevronRight, Clock3, ExternalLink, Lightbulb, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { allLessons, course, getLesson } from "../content/course";
import { useProgress } from "../features/progress/progress";
import { verifyAnswer } from "../features/verification/verify";
import type { Verification } from "../entities/course";

function VerificationField({ verification, answer, setAnswer }: { verification: Verification; answer: unknown; setAnswer: (value: unknown) => void }) {
  if (verification.type === "self_confirm") return <label className="check-label"><input type="checkbox" checked={answer === true} onChange={(event) => setAnswer(event.target.checked)} /> Да, действие выполнено</label>;
  if (verification.type === "single_choice") return <div className="choice-list">{verification.options.map((option) => <label key={option}><input type="radio" name="answer" checked={answer === option} onChange={() => setAnswer(option)} /><span>{option}</span></label>)}</div>;
  if (verification.type === "multiple_choice") return <div className="choice-list">{verification.options.map((option) => { const values = Array.isArray(answer) ? answer as string[] : []; return <label key={option}><input type="checkbox" checked={values.includes(option)} onChange={() => setAnswer(values.includes(option) ? values.filter((item) => item !== option) : [...values, option])} /><span>{option}</span></label>; })}</div>;
  if (verification.type === "text_exact") return <input className="answer-input" value={typeof answer === "string" ? answer : ""} onChange={(event) => setAnswer(event.target.value)} placeholder="Введите точное значение" />;
  if (verification.type === "number") return <div className="number-input"><input inputMode="decimal" value={typeof answer === "string" || typeof answer === "number" ? answer : ""} onChange={(event) => setAnswer(event.target.value)} placeholder="0" /><span>₸</span></div>;
  if (verification.type === "sequence") return <div className="sequence-list">{verification.items.map((item) => <button key={item} className={(Array.isArray(answer) && answer.includes(item)) ? "selected" : ""} onClick={() => { const current = Array.isArray(answer) ? answer as string[] : []; setAnswer(current.includes(item) ? current.filter((value) => value !== item) : [...current, item]); }}>{Array.isArray(answer) && answer.includes(item) ? `${answer.indexOf(item) + 1}. ` : ""}{item}</button>)}</div>;
  return <input type="file" accept="image/png,image/jpeg" onChange={(event) => setAnswer(event.target.files?.[0])} />;
}

export function LessonPage() {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId ?? "");
  const { progress, update, syncStatus, retrySync } = useProgress();
  const saved = lesson ? progress[lesson.id] : undefined;
  const [answer, setAnswer] = useState<unknown>(saved?.answer ?? "");
  const [hintCount, setHintCount] = useState(0);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(saved?.status === "completed" ? "success" : null);
  useEffect(() => {
    if (lesson && !saved) update(lesson.id, { status: "in_progress", currentStep: 0 });
  }, [lesson, saved, update]);
  if (!lesson) return <Navigate to="/dashboard" replace />;
  const index = allLessons.findIndex((item) => item.id === lesson.id);
  const module = course.modules.find((item) => item.lessons.some((candidate) => candidate.id === lesson.id))!;
  const completedCount = module.lessons.filter((item) => progress[item.id]?.status === "completed").length;
  const openExternal = () => {
    update(lesson.id, { status: "in_progress", currentStep: Math.max(saved?.currentStep ?? 0, 1), answer });
    window.open(lesson.externalAppUrl, "_blank", "noopener,noreferrer");
  };
  const submit = () => {
    const correct = verifyAnswer(lesson.verification, answer);
    update(lesson.id, { answer, attemptCount: (saved?.attemptCount ?? 0) + 1, status: correct ? "completed" : "needs_retry", currentStep: correct ? lesson.steps.length : saved?.currentStep ?? 0 });
    setFeedback(correct ? "success" : "error");
  };
  return (
    <div className="lesson-shell">
      <aside className="lesson-sidebar">
        <Link to={`/courses/${course.slug}`} className="back-link"><ChevronLeft size={16} /> К содержанию</Link>
        <div className="sidebar-course"><span>Курс 01</span><h2>{course.title}</h2></div>
        <nav aria-label="Шаги урока"><span className="nav-caption">Текущий урок</span>{lesson.steps.map((step, stepIndex) => <button key={step} className={stepIndex <= (saved?.currentStep ?? 0) ? "active" : ""} onClick={() => update(lesson.id, { currentStep: stepIndex })}><i>{stepIndex < (saved?.currentStep ?? 0) ? <Check size={13} /> : stepIndex + 1}</i><span>{step}</span></button>)}</nav>
        <div className="module-progress"><div><span style={{ width: `${Math.round((completedCount / module.lessons.length) * 100)}%` }} /></div><p>{completedCount} из {module.lessons.length} уроков модуля</p></div>
      </aside>
      <main className="lesson-main">
        <div className="lesson-topline"><Link to={`/courses/${course.slug}`}>Модуль {course.modules.indexOf(module) + 1}: {module.title.replace(/^\d+\.\s*/, "")}</Link><span>Урок {index + 1} из {allLessons.length}</span></div>
        <article>
          <div className="lesson-heading"><div><div className="eyebrow">Практическое задание</div><h1>{lesson.title}</h1><p className="lesson-context">{lesson.context}</p></div><div className="time-pill"><Clock3 /> <strong>{lesson.estimatedMinutes}</strong><span>минут</span></div></div>
          <div className="safety-warning"><AlertTriangle /><div><strong>Работайте только в учебной базе</strong><p>Не используйте рабочую бухгалтерию и реальные реквизиты.</p></div></div>
          <section className="lesson-section"><span className="section-kicker">Цель</span><h2>{lesson.objective}</h2></section>
          <section className="source-card"><div className="source-title"><NotebookPen /><span>Исходные данные</span></div><dl>{Object.entries(lesson.sourceData).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></section>
          <section className="lesson-section"><span className="section-kicker">Маршрут</span><h2>Выполните по шагам</h2><ol className="step-list">{lesson.steps.map((step, stepIndex) => <li key={step}><span>{String(stepIndex + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></section>
          <button className="external-button" onClick={openExternal}><span><small>Учебная база откроется отдельно</small>Открыть 1С</span><ExternalLink /></button>
          <p className="external-note"><ExternalLink size={14} /> Ссылка откроется в новой вкладке. Текущий шаг сохранится.</p>
          <section className="verification-card">
            <div className="verification-head"><span>Проверка результата</span><i>{saved?.attemptCount ?? 0} попыток</i></div>
            <h2>{lesson.verification.prompt}</h2>
            <VerificationField verification={lesson.verification} answer={answer} setAnswer={(value) => { setAnswer(value); setFeedback(null); update(lesson.id, { answer: value }); }} />
            {feedback === "success" && <div className="feedback success"><Check /> <div><strong>Готово — урок завершён</strong><p>{lesson.expectedResult}</p></div></div>}
            {feedback === "error" && <div className="feedback error"><AlertTriangle /> <div><strong>Пока не совпало</strong><p>Проверьте данные и попробуйте снова. Ваш ответ сохранён.</p></div></div>}
            <button className="button primary full" onClick={submit}>{feedback === "success" ? "Проверить ещё раз" : "Проверить и завершить"} <ChevronRight /></button>
          </section>
          <section className="hints"><div><Lightbulb /><div><span className="section-kicker">Нужна помощь?</span><h2>Подсказки открываются по одной</h2></div></div>{lesson.hints.slice(0, hintCount).map((hint, i) => <p key={hint}><b>{i + 1}</b>{hint}</p>)}{hintCount < lesson.hints.length && <button onClick={() => setHintCount((value) => value + 1)}>Открыть подсказку {hintCount + 1} из {lesson.hints.length}</button>}</section>
          <section className="notes"><label htmlFor="notes">Личные заметки</label><textarea id="notes" value={saved?.note ?? ""} onChange={(event) => update(lesson.id, { note: event.target.value })} placeholder="Запишите, что важно запомнить…" /><span>{syncStatus === "synced" ? "Синхронизированы через MiniBase" : syncStatus === "syncing" ? "Синхронизация…" : syncStatus === "error" ? <>Сохранены локально · <button type="button" onClick={retrySync}>повторить синхронизацию</button></> : "Сохраняются автоматически в этом браузере"}</span></section>
          <footer className="lesson-method">Методическая отметка: {lesson.configurationVersion}. Проверено {lesson.reviewedAt}. Материал учебный и не является бухгалтерской или налоговой консультацией.</footer>
        </article>
      </main>
    </div>
  );
}
