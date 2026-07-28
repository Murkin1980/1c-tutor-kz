import { render, screen } from "@testing-library/react";
import { AdminPage } from "./AdminPage";
import { projectProgress } from "../content/projectStages";

describe("project progress", () => {
  it("shows calculated progress and every project stage", () => {
    render(<AdminPage />);
    expect(screen.getByLabelText(`Готовность проекта ${projectProgress.percent}%`)).toBeInTheDocument();
    expect(screen.getByText("MiniBase и синхронизация")).toBeInTheDocument();
    expect(screen.getByText("Интеграции")).toBeInTheDocument();
    expect(screen.getByText("Платформа MiniBase")).toBeInTheDocument();
  });
});
