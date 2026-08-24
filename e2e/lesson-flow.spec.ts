import { expect, test } from "@playwright/test";

test("learner opens the first substantial practice from the dashboard", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Войти как ученик/ }).click();
  await expect(
    page.getByRole("heading", { name: "Добрый день, ученик" }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Продолжить/ }).click();
  await expect(
    page.getByRole("heading", {
      name: "Карточка учебного покупателя",
    }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/learn\/customer-card$/);
  await expect(page.getByText("УЧЕБНАЯ СРЕДА — НЕ 1С")).toBeVisible();
  await expect(page.getByRole("button", { name: "Показать" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Вести меня" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Проверить себя" }),
  ).toBeVisible();
});
