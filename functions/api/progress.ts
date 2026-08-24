import { createRemoteJWKSet, jwtVerify } from "jose";

interface Env {
  MINIBASE_URL: string;
  MINIBASE_SECRET_KEY: string;
  MINIBASE_OWNER_EMAIL?: string;
  CLOUDFLARE_ACCESS_ISSUER: string;
  CLOUDFLARE_ACCESS_AUD: string;
}

interface ProgressEnvelope {
  schemaVersion: 1;
  updatedAt: string | null;
  lessonProgress: Record<string, unknown>;
}

interface MiniBaseRecord {
  data?: unknown;
}

const collectionPath = "/v1/data/tutor_progress/owner";
const maxBodyBytes = 64 * 1024;

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
      "x-content-type-options": "nosniff",
    },
  });
}

type AccessVerifier = (request: Request, env: Env) => Promise<string | null>;

export async function verifyAccessIdentity(
  request: Request,
  env: Env,
): Promise<string | null> {
  const assertion = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!assertion) return null;
  const issuer = env.CLOUDFLARE_ACCESS_ISSUER.replace(/\/+$/, "");
  const issuerUrl = new URL(issuer);
  if (
    issuerUrl.protocol !== "https:" ||
    !issuerUrl.hostname.endsWith(".cloudflareaccess.com")
  ) {
    throw new Error("invalid_access_issuer");
  }
  const jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
  const { payload } = await jwtVerify(assertion, jwks, {
    issuer,
    audience: env.CLOUDFLARE_ACCESS_AUD,
  });
  return typeof payload.email === "string" ? payload.email : null;
}

async function authenticatedOwner(
  request: Request,
  env: Env,
  verifyAccess: AccessVerifier,
): Promise<boolean> {
  const email = await verifyAccess(request, env);
  if (!email) return false;
  return (
    !env.MINIBASE_OWNER_EMAIL ||
    email.toLowerCase() === env.MINIBASE_OWNER_EMAIL.toLowerCase()
  );
}

function isProgressEnvelope(value: unknown): value is ProgressEnvelope {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<ProgressEnvelope>;
  return (
    candidate.schemaVersion === 1 &&
    (candidate.updatedAt === null || typeof candidate.updatedAt === "string") &&
    Boolean(candidate.lessonProgress) &&
    typeof candidate.lessonProgress === "object" &&
    !Array.isArray(candidate.lessonProgress)
  );
}

async function readEnvelope(request: Request): Promise<ProgressEnvelope> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBodyBytes) throw new Error("request_too_large");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBodyBytes) {
    throw new Error("request_too_large");
  }
  const value: unknown = JSON.parse(text);
  if (!isProgressEnvelope(value)) throw new Error("invalid_progress");
  return value;
}

async function minibaseRequest(env: Env, init: RequestInit): Promise<Response> {
  const baseUrl = env.MINIBASE_URL.replace(/\/+$/, "");
  if (!baseUrl.startsWith("https://")) throw new Error("invalid_minibase_url");
  if (!env.MINIBASE_SECRET_KEY.startsWith("mb_secret_")) {
    throw new Error("invalid_minibase_secret");
  }
  return fetch(`${baseUrl}${collectionPath}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.MINIBASE_SECRET_KEY}`,
      ...init.headers,
    },
  });
}

export async function handleGet(
  request: Request,
  env: Env,
  verifyAccess: AccessVerifier = verifyAccessIdentity,
): Promise<Response> {
  try {
    if (!(await authenticatedOwner(request, env, verifyAccess))) {
      return json({ error: "unauthorized" }, 401);
    }
  } catch {
    return json({ error: "unauthorized" }, 401);
  }
  try {
    const response = await minibaseRequest(env, {
      headers: { accept: "application/json" },
    });
    if (response.status === 404) {
      return json({ schemaVersion: 1, updatedAt: null, lessonProgress: {} });
    }
    if (!response.ok)
      return json({ error: "progress_backend_unavailable" }, 502);
    const record = (await response.json()) as MiniBaseRecord;
    if (!isProgressEnvelope(record.data))
      return json({ error: "invalid_stored_progress" }, 502);
    return json(record.data);
  } catch {
    return json({ error: "progress_backend_unavailable" }, 502);
  }
}

export async function handlePut(
  request: Request,
  env: Env,
  verifyAccess: AccessVerifier = verifyAccessIdentity,
): Promise<Response> {
  try {
    if (!(await authenticatedOwner(request, env, verifyAccess))) {
      return json({ error: "unauthorized" }, 401);
    }
  } catch {
    return json({ error: "unauthorized" }, 401);
  }
  try {
    const envelope = await readEnvelope(request);
    const response = await minibaseRequest(env, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(envelope),
    });
    if (!response.ok)
      return json({ error: "progress_backend_unavailable" }, 502);
    return json({ saved: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : "invalid_progress";
    if (["request_too_large", "invalid_progress"].includes(code)) {
      return json({ error: code }, 400);
    }
    return json({ error: "progress_backend_unavailable" }, 502);
  }
}

export const onRequestGet: PagesFunction<Env> = ({ request, env }) =>
  handleGet(request, env);

export const onRequestPut: PagesFunction<Env> = ({ request, env }) =>
  handlePut(request, env);
