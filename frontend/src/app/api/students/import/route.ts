import ExcelJS from "exceljs";
import { NextRequest } from "next/server";
import { prisma } from "@backend/db/prisma";
import { getAuthUserFromRequest } from "@backend/auth/session";
import { requirePermission } from "@backend/auth/permissions";
import { fail, ok, AppError } from "@backend/api";
import { studentSchema } from "@backend/validators/school";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    requirePermission(user, "students");
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) throw new AppError("File Excel wajib diunggah.", 422, "FILE_REQUIRED");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const sheet = workbook.worksheets[0];
    const rows: Record<string, unknown>[] = [];
    const headers = (sheet.getRow(1).values as unknown[]).slice(1).map(String);

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const values = (row.values as unknown[]).slice(1);
      rows.push(Object.fromEntries(headers.map((header, index) => [header, values[index]])));
    });

    const parsed = rows.map((row) => studentSchema.parse(row));
    await prisma.student.createMany({ data: parsed, skipDuplicates: true });
    return ok({ imported: parsed.length });
  } catch (error) {
    return fail(error);
  }
}
