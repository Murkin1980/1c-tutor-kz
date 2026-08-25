import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("route access", () => {
  it("protects private routes", () => {
    history.pushState({}, "", "/dashboard");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Продолжим обучение" }),
    ).toBeInTheDocument();
  });
  it("does not allow learner into admin", async () => {
    localStorage.setItem(
      "1c-tutor-auth",
      JSON.stringify({ id: "demo-user", name: "Ученик", role: "learner" }),
    );
    history.pushState({}, "", "/admin");
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: "Добрый день, ученик" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Контент курса" }),
    ).not.toBeInTheDocument();
  });
  it("allows the local demo editor into the read-only admin page", async () => {
    localStorage.setItem(
      "1c-tutor-auth",
      JSON.stringify({
        id: "demo-user",
        name: "Редактор курса",
        role: "admin",
      }),
    );
    history.pushState({}, "", "/admin");
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: "Контент курса" }),
    ).toBeInTheDocument();
  });
});
