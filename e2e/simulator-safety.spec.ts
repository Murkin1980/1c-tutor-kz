import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Войти как ученик/ }).click();
});

test("simulator routes keep the training boundary visible", async ({ page }) => {
  for (const path of ["/simulators", "/simulators/fno", "/simulators/esf", "/simulators/fno/scenarios/draft"]) {
    await page.goto(path);
    await expect(page.getByText("УЧЕБНЫЙ СИМУЛЯТОР — ДАННЫЕ НЕ ОТПРАВЛЯЮТСЯ")).toBeVisible();
  }
});

test("identifier and training submission are safe", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const url = request.url();
    if (/kgd\.gov\.kz|salyk\.kz|esf\.gov\.kz|pki\.gov\.kz|ncalayer/i.test(url)) externalRequests.push(url);
  });
  await page.goto("/simulators/fno");
  await page.getByLabel("Учебный идентификатор").fill("123456789012");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByRole("alert")).toContainText("запрещён");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Имитировать отправку" }).click();
  expect(externalRequests).toEqual([]);
  await expect(page.locator('input[type="password"], input[type="file"]')).toHaveCount(0);
});

test("mobile viewport does not hide the training banner", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/simulators/esf");
  await expect(page.getByText("УЧЕБНЫЙ СИМУЛЯТОР — ДАННЫЕ НЕ ОТПРАВЛЯЮТСЯ")).toBeVisible();
});
