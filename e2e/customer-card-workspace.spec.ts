import { expect, test, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: /Войти как ученик/ }).click();
}

test("customer-card practical task is verified from workspace state", async ({
  page,
}, testInfo) => {
  const isMobile = testInfo.project.name.includes("mobile");
  await page.setViewportSize(
    isMobile ? { width: 360, height: 800 } : { width: 1440, height: 900 },
  );
  await login(page);
  await page.goto("/learn/customer-card");

  await expect(page.getByText("УЧЕБНАЯ СРЕДА — НЕ 1С")).toBeVisible();
  await expect(page.getByRole("button", { name: "Вести меня" })).toHaveClass(
    /active/,
  );
  await expect(page.getByText("Начните здесь")).toBeVisible();
  await expect(page.getByText("Нажмите «Продажи» в меню.")).toBeVisible();
  await page
    .locator('[data-training-target="nav.sales"]')
    .scrollIntoViewIfNeeded();
  const beacon = page.locator("button.driver-hint.training-driver-hint");
  await expect(beacon).toHaveCount(1);
  await expect(page.locator(".driver-overlay, .driver-popover")).toHaveCount(0);
  const beaconStyle = await beacon.evaluate((element) => {
    const style = getComputedStyle(element);
    const pulseStyle = getComputedStyle(
      element.querySelector(".driver-hint-pulse") as HTMLElement,
    );
    const dotStyle = getComputedStyle(
      element.querySelector(".driver-hint-dot") as HTMLElement,
    );
    return {
      animationName: pulseStyle.animationName,
      boxShadow: dotStyle.boxShadow,
      color: style.getPropertyValue("--driver-hint-color").trim(),
      pointerEvents: style.pointerEvents,
    };
  });
  expect(beaconStyle).toEqual({
    animationName: "driver-hint-pulse",
    boxShadow:
      "rgba(255, 255, 255, 0.9) 0px 0px 0px 2px, rgba(15, 159, 154, 0.32) 0px 0px 0px 4px",
    color: "#0f9f9a",
    pointerEvents: "none",
  });
  const targetBox = await page
    .locator('[data-training-target="nav.sales"]')
    .boundingBox();
  const beaconBox = await beacon.boundingBox();
  expect(targetBox).not.toBeNull();
  expect(beaconBox).not.toBeNull();
  expect(
    Math.abs(
      (beaconBox?.x ?? 0) +
        (beaconBox?.width ?? 0) / 2 -
        (targetBox?.x ?? 0) -
        (targetBox?.width ?? 0),
    ),
  ).toBeLessThan(4);
  expect(
    Math.abs(
      (beaconBox?.y ?? 0) +
        (beaconBox?.height ?? 0) / 2 -
        (targetBox?.y ?? 0) -
        (targetBox?.height ?? 0) / 2,
    ),
  ).toBeLessThan(4);
  await page.screenshot({
    path: `test-results/training-workspace-driver-hint-${isMobile ? "mobile-360x800" : "desktop-1440x900"}.png`,
    fullPage: false,
    scale: "css",
  });

  await page.getByRole("button", { name: "Проверить работу" }).click();
  await expect(page.getByText("Нужно исправить")).toBeVisible();
  await expect(page.getByText("Контрагент создан")).toBeVisible();

  await page.getByRole("button", { name: "Продажи" }).click();
  await expect(beacon).toHaveCount(1);
  await expect(
    page.locator('[data-training-target="nav.sales"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-training-target="sales.counterparties"]'),
  ).toBeVisible();
  const nextTargetBox = await page
    .locator('[data-training-target="sales.counterparties"]')
    .boundingBox();
  const nextBeaconBox = await beacon.boundingBox();
  expect(nextTargetBox).not.toBeNull();
  expect(nextBeaconBox).not.toBeNull();
  expect(
    Math.abs(
      (nextBeaconBox?.x ?? 0) +
        (nextBeaconBox?.width ?? 0) / 2 -
        (nextTargetBox?.x ?? 0) -
        (nextTargetBox?.width ?? 0),
    ),
  ).toBeLessThan(4);
  await page.getByRole("button", { name: "Контрагенты" }).click();
  await page.getByRole("button", { name: "Создать" }).click();
  await page.getByLabel("Наименование").fill("ТОО Учебный Покупатель");
  await page.getByLabel("Город").fill("Кызылорда");
  await page.getByRole("button", { name: "Сохранить и закрыть" }).click();
  await page.getByRole("button", { name: "Проверить работу" }).click();

  await expect(page.getByText("Работа выполнена")).toBeVisible();
  await expect(
    page.getByText("Карточка сохранена", { exact: true }),
  ).toBeVisible();
});

test("Driver.js beacon becomes static when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await login(page);
  await page.goto("/learn/customer-card");
  await page
    .locator('[data-training-target="nav.sales"]')
    .scrollIntoViewIfNeeded();

  const beaconStyle = await page
    .locator("button.driver-hint.training-driver-hint")
    .evaluate((element) => {
      const style = getComputedStyle(element);
      const pulseStyle = getComputedStyle(
        element.querySelector(".driver-hint-pulse") as HTMLElement,
      );
      return {
        animationName: pulseStyle.animationName,
        pointerEvents: style.pointerEvents,
      };
    });
  expect(beaconStyle).toEqual({ animationName: "none", pointerEvents: "none" });
});

test("demo mode shows one non-blocking beacon and cleans it up on mode reset", async ({
  page,
}) => {
  await login(page);
  await page.goto("/learn/customer-card");
  await page.getByRole("button", { name: "Показать" }).click();
  await page
    .locator('[data-training-target="nav.sales"]')
    .scrollIntoViewIfNeeded();

  const beacon = page.locator("button.driver-hint.training-driver-hint");
  await expect(beacon).toHaveCount(1);
  await expect(page.locator(".driver-overlay, .driver-popover")).toHaveCount(0);

  await page.getByRole("button", { name: "Продажи" }).click();
  await page
    .locator('[data-training-target="sales.counterparties"]')
    .scrollIntoViewIfNeeded();
  await expect(beacon).toHaveCount(1);
  await expect(
    page.locator('[data-training-target="sales.counterparties"]'),
  ).toBeVisible();

  await page.getByRole("button", { name: "Начать заново" }).click();
  await expect(beacon).toHaveCount(1);
  await expect(
    page.locator('[data-training-target="nav.sales"]'),
  ).toBeVisible();

  await page.getByRole("button", { name: "Проверить себя" }).click();
  await expect(beacon).toHaveCount(0);
});

test("independent mode hides coaching and remains completable", async ({
  page,
}) => {
  await login(page);
  await page.goto("/learn/customer-card");
  await page.getByRole("button", { name: "Проверить себя" }).click();

  await expect(page.getByText("Самостоятельный режим")).toBeVisible();
  await expect(page.getByText("Начните здесь")).toHaveCount(0);
  await expect(page.getByText("Следующий шаг")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Подсказка" })).toHaveCount(0);
  await expect(page.locator(".driver-hint")).toHaveCount(0);

  await page.getByRole("button", { name: "Продажи" }).click();
  await page.getByRole("button", { name: "Контрагенты" }).click();
  await page.getByRole("button", { name: "Создать" }).click();
  await page.getByLabel("Наименование").fill("ТОО Учебный Покупатель");
  await page.getByLabel("Город").fill("Кызылорда");
  await page.getByRole("button", { name: "Сохранить и закрыть" }).click();
  await page.getByRole("button", { name: "Проверить работу" }).click();

  await expect(page.getByText("Работа выполнена")).toBeVisible();
});
