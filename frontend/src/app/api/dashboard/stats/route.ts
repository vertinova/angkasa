import { NextRequest } from "next/server";
import { prisma } from "@backend/db/prisma";
import { fail, ok } from "@backend/api";
import { getAuthUserFromRequest } from "@backend/auth/session";
import { requirePermission } from "@backend/auth/permissions";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    requirePermission(user, "dashboard");

    const [students, teachers, classes, present, late, absent, revenue, announcements, schedules, activities] =
      await Promise.all([
        prisma.student.count({ where: { status: "ACTIVE" } }),
        prisma.teacher.count(),
        prisma.schoolClass.count(),
        prisma.attendance.count({ where: { status: "PRESENT" } }),
        prisma.attendance.count({ where: { status: "LATE" } }),
        prisma.attendance.count({ where: { status: "ABSENT" } }),
        prisma.payment.aggregate({ _sum: { paidAmount: true }, where: { status: "PAID" } }),
        prisma.announcement.findMany({ orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }], take: 5 }),
        prisma.schedule.findMany({
          include: { class: true, subject: true, teacher: true },
          orderBy: [{ dayOfWeek: "asc" }, { startsAt: "asc" }],
          take: 6
        }),
        prisma.activityLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 8 })
      ]);

    return ok({
      cards: { students, teachers, classes, revenue: Number(revenue._sum.paidAmount ?? 0) },
      attendance: [
        { name: "Hadir", value: present },
        { name: "Terlambat", value: late },
        { name: "Alpa", value: absent }
      ],
      announcements,
      schedules,
      activities
    });
  } catch (error) {
    return fail(error);
  }
}
