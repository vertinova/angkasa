import { NextRequest } from "next/server";
import { fail, ok } from "@backend/api";
import { forgotPasswordSchema } from "@backend/validators/auth";
import { rateLimit } from "@backend/rate-limit";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "forgot-password");
    const payload = request.headers.get("content-type")?.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
    forgotPasswordSchema.parse(payload);
    return ok({
      message: "Jika email terdaftar, instruksi reset password akan dikirim.",
      provider: "SMTP placeholder siap dikonfigurasi di settings."
    });
  } catch (error) {
    return fail(error);
  }
}
