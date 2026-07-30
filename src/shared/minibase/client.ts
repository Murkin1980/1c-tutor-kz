export interface MiniBaseRecord<T extends Record<string, unknown>> {
  id: string;
  data: T;
  createdAt: string;
  updatedAt: string;
}

export interface MiniBaseList<T extends Record<string, unknown>> {
  records: MiniBaseRecord<T>[];
  nextAfter: string | null;
}

export interface MiniBaseClientOptions {
  baseUrl: string;
  publishableKey: string;
  fetch?: typeof fetch;
}

const collectionPattern = /^[a-z][a-z0-9_-]{1,62}$/;
const recordIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

function validateBaseUrl(value: string): string {
  const url = new URL(value);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !isLocal) throw new Error("insecure_base_url");
  if (url.username || url.password || url.search || url.hash) throw new Error("invalid_base_url");
  return url.toString().replace(/\/+$/, "");
}

function validatePublishableKey(value: string): string {
  if (!value.startsWith("mb_publishable_")) throw new Error("invalid_publishable_key");
  return value;
}

export class MiniBaseClientError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
    this.name = "MiniBaseClientError";
  }
}

async function parseError(response: Response): Promise<never> {
  let code = `http_${response.status}`;
  try {
    const body = await response.json() as { error?: { code?: unknown } };
    if (typeof body.error?.code === "string") code = body.error.code;
  } catch {
    // Keep the HTTP-derived error for non-JSON proxy responses.
  }
  throw new MiniBaseClientError(code, response.status);
}

export class MiniBaseClient {
  private readonly baseUrl: string;
  private readonly key: string;
  private readonly requestFetch: typeof fetch;

  constructor(options: MiniBaseClientOptions) {
    this.baseUrl = validateBaseUrl(options.baseUrl);
    this.key = validatePublishableKey(options.publishableKey);
    this.requestFetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  private collectionPath(collection: string, id?: string): string {
    if (!collectionPattern.test(collection)) throw new Error("invalid_collection");
    if (id !== undefined && !recordIdPattern.test(id)) throw new Error("invalid_record_id");
    return `/v1/data/${encodeURIComponent(collection)}${id === undefined ? "" : `/${encodeURIComponent(id)}`}`;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await this.requestFetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${this.key}`,
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...init.headers,
      },
    });
    if (!response.ok) return parseError(response);
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  list<T extends Record<string, unknown>>(
    collection: string,
    options: { limit?: number; after?: string } = {},
  ): Promise<MiniBaseList<T>> {
    const path = this.collectionPath(collection);
    const query = new URLSearchParams();
    if (options.limit !== undefined) {
      if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 100) {
        throw new Error("invalid_limit");
      }
      query.set("limit", String(options.limit));
    }
    if (options.after !== undefined) {
      if (!recordIdPattern.test(options.after)) throw new Error("invalid_record_id");
      query.set("after", options.after);
    }
    return this.request(`${path}${query.size ? `?${query}` : ""}`);
  }

  get<T extends Record<string, unknown>>(collection: string, id: string): Promise<MiniBaseRecord<T>> {
    return this.request(this.collectionPath(collection, id));
  }

  put<T extends Record<string, unknown>>(
    collection: string,
    id: string,
    data: T,
  ): Promise<{ id: string; data: T; updatedAt: string }> {
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("invalid_record_data");
    return this.request(this.collectionPath(collection, id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}
