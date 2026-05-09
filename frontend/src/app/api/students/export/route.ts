import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@backend/db/prisma";
import { getAuthUserFromRequest } from "@backend/auth/session";
import { requirePermission } from "@backend/auth/permissions";
import { fail } from "@backend/api";
import { toExcelBuffer, toPdfBuffer } from "@backend/services/export-service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    requirePermission(user, "students");
    const format = request.nextUrl.searchParams.get("format") ?? "excel";
    const students = await prisma.student.findMany({
      include: { class: true },
      take: 1000,
      orderBy: { fullName: "asc" }
    });
    const rows = students.map((student) => ({
      nis: student.nis,
      nisn: student.nisn,
      nama: student.fullName,
      kelas: student.class?.name ?? "",
      jurusan: student.major ?? "",
      status: student.status
    }));

    if (format === "pdf") {
      const buffer = await toPdfBuffer("Laporan Data Siswa", rows);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=siswa.pdf"
        }
      });
    }

    const buffer = await toExcelBuffer(rows, "Siswa");
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=siswa.xlsx"
      }
    });
  } catch (error) {
    return fail(error);
  }
}
