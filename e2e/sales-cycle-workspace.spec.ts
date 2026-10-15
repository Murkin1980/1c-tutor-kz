import { expect, test, type Page, type TestInfo } from "@playwright/test";

const LESSON_URL = "/learn/sales-prepayment-cycle";
const CUSTOMER = "ТОО Учебный Покупатель (Кызылорда)";

async function open(page: Page, testInfo: TestInfo) {
  const isMobile = testInfo.project.name.includes("mobile");
  await page.setViewportSize(
    isMobile ? { width: 360, height: 800 } : { width: 1440, height: 900 },
  );
  await page.goto("/login");
  await page.getByRole("button", { name: /Войти как ученик/ }).click();
  await page.goto(LESSON_URL);
  await expect(page.getByText("УЧЕБНАЯ СРЕДА — НЕ 1С")).toBeVisible();
  return isMobile;
}

const progress = (page: Page) =>
  page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("1c-tutor-progress") ?? "{}")[
        "sales-prepayment-cycle"
      ],
  );

const button = (page: Page, name: string | RegExp) =>
  page.getByRole("button", { name, exact: typeof name === "string" });

async function expectNoHorizontalScroll(page: Page) {
  const [scrollWidth, innerWidth] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    window.innerWidth,
  ]);
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
}

async function createInvoice(page: Page) {
  await button(page, "Продажи").click();
  await button(page, /Счета на оплату покупателям/).click();
  await button(page, "Создать").click();
  await page.getByLabel("Покупатель").selectOption({ label: CUSTOMER });
  await button(page, "Добавить строку").click();
  await page
    .getByLabel("Номенклатура, строка 1")
    .selectOption({ label: "Шкаф учебный" });
  await page.getByLabel("Количество, строка 1").fill("2");
  await button(page, "Добавить строку").click();
  await page
    .getByLabel("Номенклатура, строка 2")
    .selectOption({ label: "Стол учебный" });
  await expect(page.getByLabel("Итог счёта")).toHaveText(/330\s000\s₸/);
  await button(page, "Записать").click();
  await expect(
    page.getByRole("heading", { name: "Счёт на оплату СЧ-0001" }),
  ).toBeVisible();
}

async function createPayment(page: Page, amount: string) {
  await button(page, "Банк и касса").click();
  await button(page, /Поступления на текущий счёт/).click();
  await button(page, "Создать").click();
  await page.getByLabel("Плательщик").selectOption({ label: CUSTOMER });
  await page
    .getByLabel("Счёт-основание")
    .selectOption({ label: "СЧ-0001 · 330 000 ₸" });
  await page.getByLabel("Сумма платежа, ₸").fill(amount);
  await button(page, "Провести").click();
  await expect(page.getByText("Проведён", { exact: true })).toBeVisible();
}

async function createRealization(page: Page) {
  await button(page, "Продажи").click();
  await button(page, /Реализация \(акты, накладные\)/).click();
  await button(page, "Создать").click();
  await page
    .getByLabel("Основание (счёт на оплату)")
    .selectOption({ index: 1 });
  await expect(page.getByLabel("Итог реализации")).toHaveText(/330\s000\s₸/);
  await button(page, "Провести").click();
  await expect(page.getByText("Проведён", { exact: true })).toBeVisible();
}

async function openSettlements(page: Page) {
  await button(page, "Продажи").click();
  await button(page, /Расчёты с покупателями/).click();
}

async function verify(page: Page) {
  await button(page, "Проверить работу").click();
  return page.locator(".training-results");
}

test("guided chain: wrong payment shows a concrete FAIL and is fixed without reset (assisted)", async ({
  page,
}, testInfo) => {
  const isMobile = await open(page, testInfo);
  await expect(button(page, "Вести меня")).toHaveClass(/active/);
  await expect(page.getByText("Начните здесь")).toBeVisible();
  const beacon = page.locator("button.driver-hint.training-driver-hint");
  await expect(beacon).toHaveCount(1);
  await expect(page.locator(".driver-overlay, .driver-popover")).toHaveCount(0);

  // Empty chain never passes.
  let results = await verify(page);
  await expect(results.getByText("Нужно исправить")).toBeVisible();
  await expect(results.locator('[data-passed="false"]')).toHaveCount(8);

  await page.getByText("Почему?").click();
  await button(page, "Подсказка").click();
  await expect(page.locator(".training-hint")).toContainText("левом меню");

  await createInvoice(page);
  await expect(page.locator(".training-coach")).toContainText("Банк и касса");

  // Correct invoice without payment/realization does not pass.
  results = await verify(page);
  await expect(
    results.locator('[data-assertion="invoice.saved"]'),
  ).toHaveAttribute("data-passed", "true");
  await expect(
    results.locator('[data-assertion="payment.linked"]'),
  ).toHaveAttribute("data-passed", "false");
  await expect(results.getByText("Нужно исправить")).toBeVisible();

  await createPayment(page, "16500");
  await createRealization(page);
  await openSettlements(page);
  await expect(
    page.getByText("Долг покупателя 313 500 ₸").first(),
  ).toBeVisible();
  await expectNoHorizontalScroll(page);

  results = await verify(page);
  const amount = results.locator('[data-assertion="payment.amount"]');
  await expect(amount).toHaveAttribute("data-passed", "false");
  await expect(amount).toContainText("Сейчас: 16 500 ₸");
  await expect(
    results.locator('[data-assertion="settlement.balance"]'),
  ).toHaveAttribute("data-passed", "false");
  await expect(
    results.locator('[data-assertion="realization.posted"]'),
  ).toHaveAttribute("data-passed", "true");
  await page.screenshot({
    path: `test-results/sales-cycle-fail-${isMobile ? "mobile-360x800" : "desktop-1440x900"}.png`,
    fullPage: false,
  });

  // Fix the existing payment instead of starting over.
  await button(page, "Банк и касса").click();
  await button(page, /Поступления на текущий счёт/).click();
  await button(page, "Открыть ПТС-0001").click();
  await page.getByLabel("Сумма платежа, ₸").fill("165000");
  await expect(page.getByText("Есть незаписанные изменения")).toBeVisible();
  await button(page, "Провести").click();
  await openSettlements(page);
  await expect(
    page.getByText("Долг покупателя 165 000 ₸").first(),
  ).toBeVisible();

  results = await verify(page);
  await expect(results.getByText("Работа выполнена")).toBeVisible();
  await expect(results.locator('[data-passed="true"]')).toHaveCount(8);
  await expect(page.locator(".sc-completion")).toHaveAttribute(
    "data-completion",
    "completed_assisted",
  );
  expect(await progress(page)).toMatchObject({
    status: "completed",
    practiceMode: "guided",
    completionKind: "completed_assisted",
    hintCount: 1,
    showActionCount: 0,
    resetCount: 0,
  });
});

test("independent test hides step help and records completed_unassisted", async ({
  page,
}, testInfo) => {
  const isMobile = await open(page, testInfo);
  await button(page, "Проверить себя").click();
  await expect(page.getByText("Самостоятельный режим")).toBeVisible();
  await expect(page.getByText("Начните здесь")).toHaveCount(0);
  await expect(page.getByText("Следующий шаг")).toHaveCount(0);
  await expect(button(page, "Подсказка")).toHaveCount(0);
  await expect(page.getByRole("list", { name: "Ход цепочки" })).toHaveCount(0);
  await expect(page.getByText("Разбор ошибки")).toHaveCount(0);
  await expect(page.locator(".driver-hint")).toHaveCount(0);

  await createInvoice(page);
  await createPayment(page, "165 000");

  // A saved-but-unposted realization does not pass.
  await button(page, "Продажи").click();
  await button(page, /Реализация \(акты, накладные\)/).click();
  await button(page, "Создать").click();
  await page
    .getByLabel("Основание (счёт на оплату)")
    .selectOption({ index: 1 });
  await button(page, "Записать").click();
  let results = await verify(page);
  await expect(
    results.locator('[data-assertion="realization.posted"]'),
  ).toContainText("РТУ-0001 записана, но не проведена");
  expect((await progress(page)).status).toBe("needs_retry");

  await button(page, "Провести").click();
  await openSettlements(page);
  await expect(page.locator(".driver-hint")).toHaveCount(0);
  results = await verify(page);
  await expect(results.getByText("Работа выполнена")).toBeVisible();
  await expectNoHorizontalScroll(page);
  await page.screenshot({
    path: `test-results/sales-cycle-pass-${isMobile ? "mobile-360x800" : "desktop-1440x900"}.png`,
    fullPage: false,
  });
  expect(await progress(page)).toMatchObject({
    status: "completed",
    practiceMode: "test",
    completionKind: "completed_unassisted",
    hintCount: 0,
    showActionCount: 0,
  });
});

test("demo walks the whole chain but is not counted", async ({
  page,
}, testInfo) => {
  await open(page, testInfo);
  await button(page, "Показать").click();
  await expect(
    page.getByText(
      "Demo показывает механику, но не засчитывает завершение урока.",
    ),
  ).toBeVisible();
  await button(page, /Показать всю цепочку/).click();
  await expect(
    page.getByText("Цепочка проведена и сверена. Проверьте состояние среды."),
  ).toBeVisible({ timeout: 30_000 });
  await expect(
    page.getByRole("heading", { name: "Расчёты с покупателями" }),
  ).toBeVisible();
  const results = await verify(page);
  await expect(results.getByText("Демонстрация завершена")).toBeVisible();
  await expect(page.getByText(/Результат Demo не засчитывается/)).toBeVisible();
  const saved = await progress(page);
  expect(saved.status).not.toBe("completed");
  expect(saved.completionKind).toBeUndefined();
});

test("intentional error chain is diagnosed and repaired without a full reset", async ({
  page,
}, testInfo) => {
  await open(page, testInfo);
  await button(page, "Загрузить цепочку с ошибками").click();
  let results = await verify(page);
  await expect(results.locator('[data-passed="false"]')).toHaveCount(3);
  await expect(
    results.locator('[data-assertion="payment.amount"]'),
  ).toContainText("16 500 ₸");
  await expect(
    results.locator('[data-assertion="realization.posted"]'),
  ).toContainText("записана, но не проведена");

  await button(page, "Банк и касса").click();
  await button(page, /Поступления на текущий счёт/).click();
  await button(page, "Открыть ПТС-0001").click();
  await page.getByLabel("Сумма платежа, ₸").fill("165000");
  await button(page, "Провести").click();
  await button(page, "Продажи").click();
  await button(page, /Реализация \(акты, накладные\)/).click();
  await button(page, "Открыть РТУ-0001").click();
  await button(page, "Провести").click();
  results = await verify(page);
  await expect(results.getByText("Работа выполнена")).toBeVisible();
  expect(await progress(page)).toMatchObject({
    status: "completed",
    completionKind: "completed_assisted",
    resetCount: 0,
  });
});

test("course page links to the sales cycle practice", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Войти как ученик/ }).click();
  await page.goto("/courses/prakticheskiy-start");
  await page.getByRole("link", { name: /Продажа по предоплате/ }).click();
  await expect(page).toHaveURL(/\/learn\/sales-prepayment-cycle$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Продажа по предоплате",
  );
});
