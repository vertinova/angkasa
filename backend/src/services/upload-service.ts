import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@backend/lib/env";
import { AppError } from "../api";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel"
]);

export async function saveUpload(file: File) {
  if (!allowedTypes.has(file.type)) {
    throw new AppError("Tipe file tidak diizinkan.", 422, "INVALID_FILE_TYPE");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new AppError("Ukuran file maksimal 8MB.", 422, "FILE_TOO_LARGE");
  }

  await mkdir(env.UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name);
  const safeName = `${crypto.randomUUID()}${ext}`;
  const target = path.join(env.UPLOAD_DIR, safeName);
  await writeFile(target, Buffer.from(await file.arrayBuffer()));

  return {
    url: `/uploads/${safeName}`,
    fileName: safeName,
    fileType: file.type,
    fileSize: file.size
  };
}
