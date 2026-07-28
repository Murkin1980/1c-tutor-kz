import { expect, test } from "@playwright/test";

test("learner completes the first lesson", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Войти как ученик/ }).click();
  await expect(page.getByRole("heading", { name: "Добрый день, ученик" })).toBeVisible();
  await page.getByRole("link", { name: /Продолжить/ }).click();
  await expect(page.getByRole("heading", { name: "Как устроен тренажёр" })).toBeVisible();
  await page.getByLabel("Да, действие выполнено").check();
  await page.getByRole("button", { name: "Проверить и завершить" }).click();
  await expect(page.getByText("Готово — урок завершён")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Готово — урок завершён")).toBeVisible();
});
