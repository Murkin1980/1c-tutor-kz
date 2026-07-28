export type ProjectStageStatus = "completed" | "current" | "planned" | "research";

export interface ProjectStage {
  id: number;
  title: string;
  status: ProjectStageStatus;
  outcome: string;
  items: Array<{ label: string; completed: boolean }>;
}

export const projectStages: ProjectStage[] = [
  {
    id: 0,
    title: "Подготовка",
    status: "completed",
    outcome: "Зафиксированы цель, ограничения, архитектура и публичный репозиторий.",
    items: [
      { label: "Фундамент и требования", completed: true },
      { label: "Архитектура и модель данных", completed: true },
      { label: "Публичный GitHub-репозиторий", completed: true },
      { label: "Учебный кейс без реальных реквизитов", completed: true },
    ],
  },
  {
    id: 1,
    title: "Frontend-прототип",
    status: "completed",
    outcome: "Основной урок проходит локально и на проверенном Cloudflare Pages preview.",
    items: [
      { label: "React-каркас и семь маршрутов", completed: true },
      { label: "Локальный курс и прогресс", completed: true },
      { label: "Проверки, адаптивность и e2e", completed: true },
      { label: "Cloudflare Pages preview", completed: true },
    ],
  },
  {
    id: 2,
    title: "MiniBase и синхронизация",
    status: "current",
    outcome: "Пользователь продолжает обучение на другом устройстве.",
    items: [
      { label: "Auth и восстановление доступа", completed: false },
      { label: "MiniBase client adapter", completed: false },
      { label: "Серверные роли и изоляция", completed: false },
      { label: "Серверный прогресс и заметки", completed: false },
    ],
  },
  {
    id: 3,
    title: "Авторинг курса",
    status: "planned",
    outcome: "Редактор публикует уроки без изменения исходного кода.",
    items: [
      { label: "CRUD курсов и уроков", completed: false },
      { label: "Управление порядком и публикацией", completed: false },
      { label: "Приватная загрузка снимков", completed: false },
      { label: "Очередь ручной проверки", completed: false },
    ],
  },
  {
    id: 4,
    title: "Пилотный модуль",
    status: "planned",
    outcome: "Владелец ИП самостоятельно проходит 10 проверенных уроков.",
    items: [
      { label: "Минимум 10 уроков", completed: false },
      { label: "Методическая проверка", completed: false },
      { label: "Тест в учебной базе 1С", completed: false },
      { label: "Пилот и обратная связь", completed: false },
    ],
  },
  {
    id: 5,
    title: "Закрепление навыков",
    status: "planned",
    outcome: "Пользователь возвращается к сложным операциям и видит рост навыков.",
    items: [
      { label: "Повторение сложных уроков", completed: false },
      { label: "Контрольные задания", completed: false },
      { label: "Карта навыков", completed: false },
      { label: "Баллы и серии занятий", completed: false },
    ],
  },
  {
    id: 6,
    title: "AI после пилота",
    status: "research",
    outcome: "AI помогает объяснять ошибки, но не заменяет ручную проверку.",
    items: [
      { label: "Порог уверенности и fallback", completed: false },
      { label: "AI-proxy без ключей во frontend", completed: false },
      { label: "Проверка пользы на пилоте", completed: false },
    ],
  },
  {
    id: 7,
    title: "Интеграции",
    status: "research",
    outcome: "Возможная автоматизация исследуется только после стабильного MVP.",
    items: [
      { label: "Исследование механизмов 1С", completed: false },
      { label: "Оценка лицензирования и рисков", completed: false },
    ],
  },
  {
    id: 8,
    title: "Платформа MiniBase",
    status: "research",
    outcome: "Отдельный Cloudflare BaaS создаёт изолированные базы и принимает проверяемый импорт из Supabase.",
    items: [
      { label: "API-контракт и модель ключей", completed: true },
      { label: "Автоматический provisioning D1", completed: false },
      { label: "Auth, R2, аудит и квоты", completed: false },
      { label: "Импорт Supabase с rollback", completed: false },
    ],
  },
];

const deliveryStages = projectStages.filter((stage) => stage.status !== "research");
const deliveryItems = deliveryStages.flatMap((stage) => stage.items);

export const projectProgress = {
  completed: deliveryItems.filter((item) => item.completed).length,
  total: deliveryItems.length,
  percent: Math.round(
    (deliveryItems.filter((item) => item.completed).length / deliveryItems.length) * 100,
  ),
};
