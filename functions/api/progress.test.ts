import { afterEach, describe, expect, it, vi } from "vitest";
import { exportJWK, generateKeyPair, SignJWT } from "jose";
import { handleGet, handlePut, verifyAccessIdentity } from "./progress";

const env = {
  MINIBASE_URL: "https://minibase.example",
  MINIBASE_SECRET_KEY: "mb_secret_server-only",
  MINIBASE_OWNER_EMAIL: "owner@example.com",
  CLOUDFLARE_ACCESS_ISSUER: "https://team.cloudflareaccess.com",
  CLOUDFLARE_ACCESS_AUD: "test-audience",
};

const ownerAccess = async () => "owner@example.com";
const deniedAccess = async () => null;

function request(method = "GET", body?: unknown, email = "owner@example.com") {
  return new Request("https://tutor.example/api/progress", {
    method,
    headers: {
      "Cf-Access-Authenticated-User-Email": email,
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("progress Pages Function", () => {
  it("verifies the Access JWT signature, issuer and audience", async () => {
    const { publicKey, privateKey } = await generateKeyPair("RS256");
    const jwk = await exportJWK(publicKey);
    const token = await new SignJWT({ email: "owner@example.com" })
      .setProtectedHeader({ alg: "RS256", kid: "test-key" })
      .setIssuer(env.CLOUDFLARE_ACCESS_ISSUER)
      .setAudience(env.CLOUDFLARE_ACCESS_AUD)
      .setIssuedAt()
      .setExpirationTime("2m")
      .sign(privateKey);
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          Response.json({ keys: [{ ...jwk, kid: "test-key", alg: "RS256" }] }),
        ),
    );

    await expect(
      verifyAccessIdentity(
        new Request("https://tutor.example/api/progress", {
          headers: { "Cf-Access-Jwt-Assertion": token },
        }),
        env,
      ),
    ).resolves.toBe("owner@example.com");
  });

  it("rejects requests without an accepted Cloudflare Access identity", async () => {
    const response = await handleGet(
      new Request("https://tutor.example/api/progress"),
      env,
      deniedAccess,
    );
    expect(response.status).toBe(401);
  });

  it("returns an empty envelope when MiniBase has no owner record", async () => {
    const requestFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        Response.json({ error: { code: "record_not_found" } }, { status: 404 }),
      );
    vi.stubGlobal("fetch", requestFetch);

    const response = await handleGet(request(), env, ownerAccess);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      schemaVersion: 1,
      updatedAt: null,
      lessonProgress: {},
    });
    expect(requestFetch).toHaveBeenCalledWith(
      "https://minibase.example/v1/data/tutor_progress/owner",
      expect.objectContaining({
        headers: expect.objectContaining({
          authorization: "Bearer mb_secret_server-only",
        }),
      }),
    );
  });

  it("writes validated progress with the server-only MiniBase secret", async () => {
    const requestFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        Response.json({ id: "owner", data: {}, updatedAt: "now" }),
      );
    vi.stubGlobal("fetch", requestFetch);
    const envelope = {
      schemaVersion: 1 as const,
      updatedAt: "2026-08-25T10:00:00.000Z",
      lessonProgress: {},
    };

    const response = await handlePut(
      request("PUT", envelope),
      env,
      ownerAccess,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ saved: true });
    expect(requestFetch).toHaveBeenCalledWith(
      "https://minibase.example/v1/data/tutor_progress/owner",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(envelope),
      }),
    );
  });

  it("does not expose upstream errors or secrets", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          Response.json(
            { error: { code: "secret_backend_detail" } },
            { status: 500 },
          ),
        ),
    );
    const response = await handleGet(request(), env, ownerAccess);
    expect(response.status).toBe(502);
    expect(await response.text()).toBe(
      '{"error":"progress_backend_unavailable"}',
    );
  });
});
