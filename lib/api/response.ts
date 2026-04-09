import { NextResponse } from "next/server";

const API_VERSION = "2026-04-09";

type ApiMeta = {
  resource?: string;
  count?: number;
  query?: string;
  target?: string;
  ok?: boolean;
};

function buildHeaders(meta?: ApiMeta) {
  const headers = new Headers({
    "X-API-Version": API_VERSION,
    "X-Generated-At": new Date().toISOString(),
  });

  if (meta?.resource) {
    headers.set("X-Resource-Type", meta.resource);
  }

  if (typeof meta?.count === "number") {
    headers.set("X-Resource-Count", String(meta.count));
  }

  if (meta?.query) {
    headers.set("X-Query", meta.query);
  }

  if (meta?.target) {
    headers.set("X-Target", meta.target);
  }

  if (typeof meta?.ok === "boolean") {
    headers.set("X-Validation-Ok", String(meta.ok));
  }

  return headers;
}

export function jsonData<T>(data: T, meta?: ApiMeta) {
  return NextResponse.json(data, {
    headers: buildHeaders(meta),
  });
}

export function jsonEnvelope<T>(data: T, meta?: ApiMeta) {
  return NextResponse.json(
    {
      data,
      meta: {
        version: API_VERSION,
        generated_at: new Date().toISOString(),
        ...meta,
      },
    },
    {
      headers: buildHeaders(meta),
    },
  );
}

export function jsonNotFound(resource = "resource") {
  return NextResponse.json(
    { error: "Not found" },
    {
      status: 404,
      headers: buildHeaders({ resource }),
    },
  );
}

export function jsonBadRequest(message: string, meta?: ApiMeta) {
  return NextResponse.json(
    { error: message },
    {
      status: 400,
      headers: buildHeaders(meta),
    },
  );
}
