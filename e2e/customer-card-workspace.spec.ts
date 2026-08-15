import { expect, test } from "@playwright/test";

async function login(page: Parameters<typeof test>[0] extends never ? never : any) {
  await page.goto("/login");
  await page.getByRole("button", { name: /Войти как ученик/ }).click();
}

test("customer-card practical task is verified from workspace state", async ({ page }) => {
  await login(page);
  await page.goto("/learn/customer-card");

  await expect(page.getByText("УЧЕБНАЯ СРЕДА — НЕ 1С")).toBeVisible();
  await expect(page.getByRole("button", { name: "Вести меня" })).toHaveClass(/active/);

  await page.getByRole("button", { name: "Проверить работу" }).click();
  await expect(page.getByText("Нужно исправить")).toBeVisible();
  await expect(page.getByText("Контрагент создан")).toBeVisible();

  await page.getByRole("button", { name: "Продажи" }).click();
  await page.getByRole("button", { name: "Контрагенты" }).click();
  await page.getByRole("button", { name: "Создать" }).click();
  await page.getByLabel("Наименование").fill("ТОО Учебный Покупатель");
  await page.getByLabel("Город").fill("Кызылорда");
  await page.getByRole("button", { name: "Сохранить и закрыть" }).click();
  await page.getByRole("button", { name: "Проверить работу" }).click();

  await expect(page.getByText("Работа выполнена")).toBeVisible();
  await expect(page.getByText("Карточка сохранена")).toBeVisible();
});

test("independent mode hides coaching and remains completable", async ({ page }) => {
  await login(page);
  await page.goto("/learn/customer-card");
  await page.getByRole("button", { name: "Проверить себя" }).click();

  await expect(page.getByText("Самостоятельный режим")).toBeVisible();
  await expect(page.getByText("Следующий шаг")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Подсказка" })).toHaveCount(0);

  await page.getByRole("button", { name: "Продажи" }).click();
  await page.getByRole("button", { name: "Контрагенты" }).click();
  await page.getByRole("button", { name: "Создать" }).click();
  await page.getByLabel("Наименование").fill("ТОО Учебный Покупатель");
  await page.getByLabel("Город").fill("Кызылорда");
  await page.getByRole("button", { name: "Сохранить и закрыть" }).click();
  await page.getByRole("button", { name: "Проверить работу" }).click();

  await expect(page.getByText("Работа выполнена")).toBeVisible();
});
