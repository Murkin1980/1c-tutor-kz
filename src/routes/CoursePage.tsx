import { Check, ChevronRight, Clock3, LockKeyhole } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { course, allLessons } from "../content/course";
import { isLessonUnlocked } from "../entities/courseSelectors";
import { useProgress } from "../features/progress/progress";

export function CoursePage() {
  const { courseSlug } = useParams();
  const { progress } = useProgress();
  if (courseSlug !== course.slug) return <Navigate to="/dashboard" replace />;
  return (
    <div className="page course-page">
      <Link className="back-link" to="/dashboard">
        ← Назад к обучению
      </Link>
      <div className="course-hero">
        <div>
          <div className="eyebrow">Курс · {allLessons.length} уроков</div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
        <div className="large-index">01</div>
      </div>
      <div className="module-list">
        {course.modules.map((module, moduleIndex) => (
          <section className="module" key={module.id}>
            <div className="module-heading">
              <span>Модуль {moduleIndex + 1}</span>
              <div>
                <h2>{module.title.replace(/^\d+\.\s*/, "")}</h2>
                <p>{module.description}</p>
              </div>
            </div>
            <div className="lesson-list">
              {module.lessons.map((lesson, lessonIndex) => {
                const isCompleted = progress[lesson.id]?.status === "completed";
                const isEmbeddedValidationSlice =
                  lesson.practiceMode === "embedded";
                const unlocked = isLessonUnlocked(allLessons, progress, lesson);
                return unlocked ? (
                  <Link
                    key={lesson.id}
                    to={`/learn/${lesson.id}`}
                    className="lesson-row"
                  >
                    <span
                      className={`lesson-number ${isCompleted ? "complete" : ""}`}
                    >
                      {isCompleted ? (
                        <Check size={16} />
                      ) : (
                        String(lessonIndex + 1).padStart(2, "0")
                      )}
                    </span>
                    <div>
                      <h3>{lesson.title}</h3>
                      <span>
                        <Clock3 size={14} /> {lesson.estimatedMinutes} мин ·{" "}
                        {isCompleted
                          ? "Завершён"
                          : isEmbeddedValidationSlice
                            ? "Новый тренажёр · доступен"
                            : progress[lesson.id]
                              ? "Продолжить"
                              : "Доступен"}
                      </span>
                    </div>
                    <ChevronRight />
                  </Link>
                ) : (
                  <div
                    key={lesson.id}
                    className="lesson-row locked"
                    aria-label={`${lesson.title}, заблокирован`}
                  >
                    <span className="lesson-number">
                      <LockKeyhole size={15} />
                    </span>
                    <div>
                      <h3>{lesson.title}</h3>
                      <span>Завершите предыдущий урок</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
