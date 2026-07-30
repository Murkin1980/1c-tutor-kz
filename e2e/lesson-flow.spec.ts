import { expect, test } from "@playwright/test";

test("direct private route uses SPA fallback and redirects to login", async ({ page }) => {
  await page.goto("/learn/welcome");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Продолжим обучение" })).toBeVisible();
});

test("learner completes the first lesson", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Войти как ученик/ }).click();
  await expect(page.getByRole("heading", { name: "Добрый день, ученик" })).toBeVisible();
  await page.getByRole("link", { name: /Продолжить/ }).click();
  await expect(page.getByRole("heading", { name: "Как устроен тренажёр" })).toBeVisible();
  await page.getByLabel("Да, действие выполнено").check();
  await page.getByRole("button", { name: "Проверить и завершить" }).click();
  await expect(page.getByText("Готово — урок завершён")).toBeVisible();
  await page.getByLabel("Личные заметки").fill("E2E: повторить вводный урок");
  await expect(page.getByText("Синхронизированы через MiniBase")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Готово — урок завершён")).toBeVisible();
  await expect(page.getByLabel("Личные заметки")).toHaveValue("E2E: повторить вводный урок");
});
