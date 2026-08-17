import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SimulatorShellPage } from "./SimulatorShellPage";
import { SimulatorsPage } from "./SimulatorsPage";

describe("simulator routes", () => {
  it("keeps training marking visible in catalog", () => {
    render(<MemoryRouter><SimulatorsPage /></MemoryRouter>);
    expect(screen.getByText("УЧЕБНЫЙ СИМУЛЯТОР — ДАННЫЕ НЕ ОТПРАВЛЯЮТСЯ")).toBeVisible();
  });

  it("has no password or certificate input and rejects identifier-shaped values", () => {
    render(<MemoryRouter><SimulatorShellPage type="fno" /></MemoryRouter>);
    expect(screen.queryByLabelText(/пароль|эцп/i)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Учебный идентификатор"), { target: { value: "123456789012" } });
    fireEvent.click(screen.getByRole("button", { name: "Проверить" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/запрещён ввод/);
  });
});
