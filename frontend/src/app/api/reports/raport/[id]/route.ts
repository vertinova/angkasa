import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@backend/db/prisma";
import { fail, AppError } from "@backend/api";
import { getAuthUserFromRequest } from "@backend/auth/session";
import { requirePermission } from "@backend/auth/permissions";
import { toPdfBuffer } from "@backend/services/export-service";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUserFromRequest(request);
    requirePermission(user, "academics");
    const { id } = await context.params;
    const student = await prisma.student.findUnique({ where: { id }, include: { grades: { include: { subject: true } }, class: true } });
    if (!student) throw new AppError("Siswa tidak ditemukan.", 404, "NOT_FOUND");
    const buffer = await toPdfBuffer(`Raport ${student.fullName}`, student.grades.map((grade) => ({
      mapel: grade.subject.name,
      semester: grade.semester,
      nilai: grade.finalScore,
      predikat: grade.predicate
    })));
    return new NextResponse(new Uint8Array(buffer), { headers: { "Content-Type": "application/pdf" } });
  } catch (error) {
    return fail(error);
  }
}
