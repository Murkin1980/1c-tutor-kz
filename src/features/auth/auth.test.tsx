import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthProvider, LocalAuthRepository, useAuth } from "./auth";

describe("local auth repository", () => {
  it("ignores malformed and invalid stored sessions", () => {
    localStorage.setItem("1c-tutor-auth", "not-json");
    expect(new LocalAuthRepository().getCurrentUser()).toBeNull();
    localStorage.setItem(
      "1c-tutor-auth",
      JSON.stringify({ id: "demo", name: "User", role: "owner" }),
    );
    expect(new LocalAuthRepository().getCurrentUser()).toBeNull();
  });

  it("persists and clears the demo session through the repository", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.login("learner"));
    expect(new LocalAuthRepository().getCurrentUser()).toMatchObject({
      role: "learner",
    });
    act(() => result.current.logout());
    expect(new LocalAuthRepository().getCurrentUser()).toBeNull();
  });
});
