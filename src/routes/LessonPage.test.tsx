import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { AuthProvider } from "../features/auth/auth";
import { ProgressProvider } from "../features/progress/progress";
import { LessonPage } from "./LessonPage";

function renderLesson() {
  return render(<QueryClientProvider client={new QueryClient()}><AuthProvider><ProgressProvider><MemoryRouter initialEntries={["/learn/welcome"]}><Routes><Route path="/learn/:lessonId" element={<LessonPage />} /></Routes></MemoryRouter></ProgressProvider></AuthProvider></QueryClientProvider>);
}
describe("lesson screen", () => {
  it("opens 1C externally with safe window features", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderLesson();
    await userEvent.click(screen.getByText("Открыть 1С").closest("button")!);
    expect(open).toHaveBeenCalledWith("https://1cfresh.kz/", "_blank", "noopener,noreferrer");
  });
});
