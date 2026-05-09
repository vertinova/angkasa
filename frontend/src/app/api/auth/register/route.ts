import { NextRequest } from "next/server";
import { prisma } from "@backend/db/prisma";
import { fail, created, AppError } from "@backend/api";
import { registerSchema } from "@backend/validators/auth";
import { hashPassword } from "@backend/auth/password";
import { rateLimit } from "@backend/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "auth-register");
    const payload = registerSchema.parse(await request.json());
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) throw new AppError("Email sudah digunakan.", 409, "EMAIL_EXISTS");

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        passwordHash: await hashPassword(payload.password)
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    return created(user);
  } catch (error) {
    return fail(error);
  }
}
