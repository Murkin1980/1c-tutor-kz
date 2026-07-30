import { getMiniBaseConfig } from "./config";
import { MiniBaseClient } from "./client";

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
});
