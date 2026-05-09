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
    requirePermission(user, "finance");
    const { id } = await context.params;
    const payment = await prisma.payment.findUnique({ where: { id }, include: { student: true } });
    if (!payment) throw new AppError("Invoice tidak ditemukan.", 404, "NOT_FOUND");
    const buffer = await toPdfBuffer(`Invoice ${payment.invoiceNo}`, [
      {
        siswa: payment.student.fullName,
        tagihan: payment.title,
        nominal: payment.amount,
        terbayar: payment.paidAmount,
        status: payment.status
      }
    ]);
    return new NextResponse(new Uint8Array(buffer), { headers: { "Content-Type": "application/pdf" } });
  } catch (error) {
    return fail(error);
  }
}
