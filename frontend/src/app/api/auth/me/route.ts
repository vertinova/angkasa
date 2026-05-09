import { NextRequest } from "next/server";
import { prisma } from "@backend/db/prisma";
import { fail, ok, AppError } from "@backend/api";
import { getAuthUserFromRequest } from "@backend/auth/session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) throw new AppError("Authentication required", 401, "UNAUTHENTICATED");

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        lastLoginAt: true,
        sessions: {
          orderBy: { createdAt: "desc" },
          take: 8,
          select: { id: true, device: true, ipAddress: true, userAgent: true, createdAt: true, expiresAt: true, revokedAt: true }
        }
      }
    });

    return ok(user);
  } catch (error) {
    return fail(error);
  }
}
