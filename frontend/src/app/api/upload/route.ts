import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@backend/auth/session";
import { AppError, fail, created } from "@backend/api";
import { saveUpload } from "@backend/services/upload-service";
import { rateLimit } from "@backend/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "upload");
    const user = await getAuthUserFromRequest(request);
    if (!user) throw new AppError("Authentication required", 401, "UNAUTHENTICATED");
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) throw new AppError("File tidak ditemukan.", 422, "FILE_REQUIRED");
    return created(await saveUpload(file));
  } catch (error) {
    return fail(error);
  }
}
