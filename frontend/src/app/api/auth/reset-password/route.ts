import { NextRequest } from "next/server";
import { fail, ok } from "@backend/api";
import { resetPasswordSchema } from "@backend/validators/auth";
import { rateLimit } from "@backend/rate-limit";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "reset-password");
    const payload = request.headers.get("content-type")?.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
    resetPasswordSchema.parse(payload);
    return ok({
      message: "Token reset diterima. Integrasikan tabel reset token atau provider email produksi sebelum go-live."
    });
  } catch (error) {
    return fail(error);
  }
}
