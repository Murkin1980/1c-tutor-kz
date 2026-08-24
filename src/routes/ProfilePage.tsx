import { useAuth } from "../features/auth/auth";
import { useProgress } from "../features/progress/progress";

const syncLabels = {
  local: "Прогресс хранится только на этом устройстве",
  syncing: "Синхронизация прогресса…",
  synced: "Прогресс сохранён в MiniBase",
  offline: "MiniBase недоступен — прогресс сохранён на этом устройстве",
};

export function ProfilePage() {
  const { user } = useAuth();
  const { syncStatus } = useProgress();
  return (
    <div className="page narrow-page">
      <div className="eyebrow">Настройки</div>
      <h1>Профиль</h1>
      <section className="settings-card">
        <div className="avatar">{user?.name.charAt(0)}</div>
        <div>
          <h2>{user?.name}</h2>
          <p>Демонстрационный аккаунт · роль: {user?.role}</p>
          <p role="status">{syncLabels[syncStatus]}</p>
        </div>
      </section>
      <section className="settings-card vertical">
        <h2>Язык и формат</h2>
        <label>
          Язык интерфейса
          <select defaultValue="ru-KZ">
            <option value="ru-KZ">Русский (Казахстан)</option>
          </select>
        </label>
        <p>Суммы отображаются в тенге, локаль ru-KZ.</p>
      </section>
    </div>
  );
}
