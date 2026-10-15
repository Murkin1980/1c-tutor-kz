import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ProgressProvider,
  type LessonProgress,
  type ProgressMap,
  type ProgressRepository,
} from "../progress/progress";
import { SalesCycleTrainingWorkspace } from "./SalesCycleTrainingWorkspace";

class MemoryProgressRepository implements ProgressRepository {
  data: ProgressMap = {};
  getAll() {
    return this.data;
  }
  save(progress: LessonProgress) {
    this.data = { ...this.data, [progress.lessonId]: progress };
  }
}

function renderWorkspace() {
  const repository = new MemoryProgressRepository();
  render(
    <ProgressProvider repository={repository}>
      <SalesCycleTrainingWorkspace />
    </ProgressProvider>,
  );
  return {
    repository,
    progress: () => repository.data["sales-prepayment-cycle"],
  };
}

const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name }));
const change = (label: string | RegExp, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
/** Selects an option by its visible text, as a learner would (document ids are internal). */
const choose = (label: string, optionText: RegExp) => {
  const select = screen.getByLabelText(label) as HTMLSelectElement;
  const option = within(select).getByRole("option", {
    name: optionText,
  }) as HTMLOptionElement;
  fireEvent.change(select, { target: { value: option.value } });
};

function clickShowActionUntilDone(label: string) {
  for (
    let step = 0;
    step < 60 && screen.queryByRole("button", { name: label });
    step += 1
  )
    click(label);
  expect(screen.queryByRole("button", { name: label })).not.toBeInTheDocument();
}

/** Performs the whole chain manually through the UI, as a learner would. */
function performChainManually() {
  click("Продажи");
  click(
    "Счета на оплату покупателям Что и на какую сумму покупатель должен оплатить",
  );
  click("Создать");
  choose("Покупатель", /ТОО Учебный Покупатель/);
  click("Добавить строку");
  choose("Номенклатура, строка 1", /Шкаф учебный/);
  change("Количество, строка 1", "2");
  click("Добавить строку");
  choose("Номенклатура, строка 2", /Стол учебный/);
  expect(screen.getByLabelText("Итог счёта")).toHaveTextContent("330 000 ₸");
  click("Записать");
  click("Банк и касса");
  click(/Поступления на текущий счёт/);
  click("Создать");
  choose("Плательщик", /ТОО Учебный Покупатель/);
  choose("Счёт-основание", /СЧ-0001/);
  change("Сумма платежа, ₸", "165 000");
  click("Провести");
  click("Продажи");
  click(/Реализация \(акты, накладные\)/);
  click("Создать");
  choose("Основание (счёт на оплату)", /СЧ-0001/);
  click("Провести");
  click("Продажи");
  click(/Расчёты с покупателями/);
  expect(screen.getByText("Долг покупателя 165 000 ₸")).toBeInTheDocument();
}

describe("sales-by-prepayment workspace learning modes", () => {
  it("Demo walks the whole chain but is never counted as completion", () => {
    const { progress } = renderWorkspace();
    click("Показать");
    clickShowActionUntilDone("Показать действие");
    click("Проверить работу");
    expect(screen.getByText("Демонстрация завершена")).toBeInTheDocument();
    expect(progress()).toMatchObject({
      practiceMode: "demo",
      status: "in_progress",
    });
    expect(progress().completionKind).toBeUndefined();
    expect(progress().showActionCount).toBeGreaterThan(10);
  });

  it("Demo autoplay reaches the end of the chain", () => {
    vi.useFakeTimers();
    try {
      renderWorkspace();
      click("Показать");
      click(/Показать всю цепочку/);
      for (let step = 0; step < 60; step += 1) {
        act(() => {
          vi.advanceTimersByTime(500);
        });
      }
      expect(
        screen.queryByRole("button", { name: "Показать действие" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(/Цепочка проведена и сверена/),
      ).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("Guided with help is recorded as completed_assisted with counters", () => {
    const { progress } = renderWorkspace();
    click("Подсказка");
    click("Подсказка");
    clickShowActionUntilDone("Сделать за меня");
    expect(
      screen.getByText("Результат будет отмечен как выполненный с помощью."),
    ).toBeInTheDocument();
    click("Проверить работу");
    expect(screen.getByText("Работа выполнена")).toBeInTheDocument();
    expect(progress()).toMatchObject({
      status: "completed",
      practiceMode: "guided",
      completionKind: "completed_assisted",
      hintCount: 2,
    });
    expect(progress().showActionCount).toBeGreaterThan(10);
  });

  it("Independent without help is recorded as completed_unassisted and hides step help", () => {
    const { progress } = renderWorkspace();
    click("Начать заново");
    click("Проверить себя");
    expect(screen.getByText("Самостоятельный режим")).toBeInTheDocument();
    expect(screen.queryByText("Следующий шаг")).not.toBeInTheDocument();
    expect(screen.queryByText("Начните здесь")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Подсказка" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: "Ход цепочки" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Разбор ошибки")).not.toBeInTheDocument();

    performChainManually();
    click("Проверить работу");
    expect(screen.getByText("Работа выполнена")).toBeInTheDocument();
    expect(progress()).toMatchObject({
      status: "completed",
      practiceMode: "test",
      completionKind: "completed_unassisted",
      hintCount: 0,
      showActionCount: 0,
      resetCount: 1,
    });
  });

  it("an incomplete independent attempt shows per-assertion FAILs and needs_retry", () => {
    const { progress } = renderWorkspace();
    click("Проверить себя");
    click("Проверить работу");
    const results = screen.getByRole("status");
    expect(within(results).getByText("Нужно исправить")).toBeInTheDocument();
    expect(
      within(results).getByText("Правильный покупатель в счёте"),
    ).toBeInTheDocument();
    expect(
      within(results).getByText("Итоговый долг / аванс покупателя"),
    ).toBeInTheDocument();
    expect(results.querySelectorAll('[data-passed="false"]')).toHaveLength(8);
    expect(progress().status).toBe("needs_retry");
  });

  it("the intentional error chain can be fixed without a full reset and counts as assisted", () => {
    const { progress } = renderWorkspace();
    click("Загрузить цепочку с ошибками");
    click("Проверить работу");
    const results = screen.getByRole("status");
    expect(
      results.querySelector('[data-assertion="payment.amount"]'),
    ).toHaveAttribute("data-passed", "false");
    expect(within(results).getByText(/Сейчас: 16 500/)).toBeInTheDocument();

    click("Банк и касса");
    click(/Поступления на текущий счёт/);
    click("Открыть ПТС-0001");
    change("Сумма платежа, ₸", "165000");
    click("Провести");
    click("Продажи");
    click(/Реализация \(акты, накладные\)/);
    click("Открыть РТУ-0001");
    click("Провести");
    click("Проверить работу");
    expect(screen.getByText("Работа выполнена")).toBeInTheDocument();
    expect(progress()).toMatchObject({
      status: "completed",
      completionKind: "completed_assisted",
      resetCount: 0,
    });
  });
});
