export function sanitizeString(value: string) {
  return value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").trim();
}

export function sanitizePayload<T>(payload: T): T {
  if (typeof payload === "string") {
    return sanitizeString(payload) as T;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePayload(item)) as T;
  }

  if (payload && typeof payload === "object") {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, sanitizePayload(value)])
    ) as T;
  }

  return payload;
}
