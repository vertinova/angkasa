import { NextRequest } from "next/server";
import { env } from "@backend/lib/env";
import { AppError } from "./api";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(request: NextRequest, scope = "global") {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "local";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + env.RATE_LIMIT_WINDOW_MS });
    return;
  }

  current.count += 1;

  if (current.count > env.RATE_LIMIT_MAX) {
    throw new AppError("Terlalu banyak request. Coba beberapa saat lagi.", 429, "RATE_LIMITED");
  }
}
