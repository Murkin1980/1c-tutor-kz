import { getMiniBaseConfig } from "./config";
import { MINIBASE_SESSION_KEY, MiniBaseClient, MiniBaseClientError } from "./client";

describe("MiniBase frontend configuration", () => {
  it("uses local fallback when MiniBase is not configured", () => {
    expect(getMiniBaseConfig({})).toEqual({ mode: "local", reason: "not_configured" });
  });

  it("accepts only a complete publishable configuration", () => {
    expect(getMiniBaseConfig({
      VITE_MINIBASE_URL: "https://minibase.example.test",
      VITE_MINIBASE_PUBLISHABLE_KEY: "mb_publishable_demo",
    })).toEqual({
      mode: "remote",
      baseUrl: "https://minibase.example.test",
      publishableKey: "mb_publishable_demo",
    });
  });

  it("rejects server and management keys", () => {
    expect(getMiniBaseConfig({
      VITE_MINIBASE_URL: "https://minibase.example.test",
      VITE_MINIBASE_PUBLISHABLE_KEY: "mb_secret_forbidden",
    })).toEqual({ mode: "local", reason: "invalid_configuration" });
    expect(() => new MiniBaseClient({
      baseUrl: "https://minibase.example.test",
      publishableKey: "mb_management_forbidden",
    })).toThrow("invalid_publishable_key");
  });

  it("builds authenticated data requests without exposing another key type", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
      records: [],
      nextAfter: null,
    }), { status: 200 }));
    const client = new MiniBaseClient({
      baseUrl: "https://minibase.example.test/",
      publishableKey: "mb_publishable_demo",
      fetch: request,
    });

    await client.list("lesson_progress", { limit: 20 });

    expect(request).toHaveBeenCalledWith(
      "https://minibase.example.test/v1/data/lesson_progress?limit=20",
      expect.objectContaining({
        headers: expect.objectContaining({ authorization: "Bearer mb_publishable_demo" }),
      }),
    );
  });

  it("binds the native browser fetch to its global context", async () => {
    const nativeFetch = vi.spyOn(globalThis, "fetch").mockImplementation(function (this: unknown) {
      expect(this).toBe(globalThis);
      return Promise.resolve(new Response(JSON.stringify({ records: [], nextAfter: null })));
    });
    const client = new MiniBaseClient({
      baseUrl: "https://minibase.example.test",
      publishableKey: "mb_publishable_demo",
    });

    await client.list("lesson_progress");

    expect(nativeFetch).toHaveBeenCalledOnce();
    nativeFetch.mockRestore();
  });

  it("exchanges Access identity and uses the session only from sessionStorage", async () => {
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({
        token: "mb_session_owner",
        expiresAt: "2030-01-01T00:00:00.000Z",
      }, { status: 201 }))
      .mockResolvedValueOnce(Response.json({ records: [], nextAfter: null }));
    const client = new MiniBaseClient({
      baseUrl: "https://minibase.example.test",
      publishableKey: "mb_publishable_demo",
      fetch: request,
    });

    await client.exchangeAccessSession();
    await client.list("lesson_progress");

    expect(request.mock.calls[0][1]).toEqual(expect.objectContaining({
      method: "POST",
      credentials: "include",
      headers: { authorization: "Bearer mb_publishable_demo" },
    }));
    expect(sessionStorage.getItem(MINIBASE_SESSION_KEY)).toBe("mb_session_owner");
    expect(localStorage.getItem(MINIBASE_SESSION_KEY)).toBeNull();
    expect(request.mock.calls[1][1]).toEqual(expect.objectContaining({
      headers: expect.objectContaining({ authorization: "Bearer mb_session_owner" }),
    }));
  });

  it("rejects an Access HTML redirect and clears a session before best-effort logout", async () => {
    const htmlClient = new MiniBaseClient({
      baseUrl: "https://minibase.example.test",
      publishableKey: "mb_publishable_demo",
      fetch: vi.fn<typeof fetch>().mockResolvedValue(new Response("<html>login</html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      })),
    });
    await expect(htmlClient.exchangeAccessSession()).rejects.toEqual(
      expect.objectContaining<Partial<MiniBaseClientError>>({ code: "access_login_required" }),
    );

    sessionStorage.setItem(MINIBASE_SESSION_KEY, "mb_session_owner");
    const failingLogout = new MiniBaseClient({
      baseUrl: "https://minibase.example.test",
      publishableKey: "mb_publishable_demo",
      fetch: vi.fn<typeof fetch>().mockRejectedValue(new Error("offline")),
    });
    await expect(failingLogout.endSession()).rejects.toThrow("offline");
    expect(sessionStorage.getItem(MINIBASE_SESSION_KEY)).toBeNull();
  });

  it("can require a user session before sending data requests", async () => {
    const request = vi.fn<typeof fetch>();
    const client = new MiniBaseClient({
      baseUrl: "https://minibase.example.test",
      publishableKey: "mb_publishable_demo",
      fetch: request,
      requireSession: true,
    });
    await expect(client.list("lesson_progress")).rejects.toEqual(
      expect.objectContaining<Partial<MiniBaseClientError>>({ code: "session_required", status: 401 }),
    );
    expect(request).not.toHaveBeenCalled();
  });
});
