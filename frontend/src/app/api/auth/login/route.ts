import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { prisma } from "@backend/db/prisma";
import { fail, ok, AppError } from "@backend/api";
import { loginSchema } from "@backend/validators/auth";
import { verifyPassword } from "@backend/auth/password";
import { signToken } from "@backend/auth/jwt";
import { authCookieName } from "@backend/auth/session";
import { rateLimit } from "@backend/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    rateLimit(request, "auth-login");
    const { username, password } = loginSchema.parse(await request.json());
    const normalizedUsername = username.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: normalizedUsername }, { email: normalizedUsername }]
      }
    });

    if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
      throw new AppError("Username atau password salah.", 401, "INVALID_CREDENTIALS");
    }

    const authUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    const token = await signToken(authUser);
    const tokenHash = createHash("sha256").update(token).digest("hex");

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
      prisma.session.create({
        data: {
          userId: user.id,
          tokenHash,
          ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0],
          userAgent: request.headers.get("user-agent"),
          device: request.headers.get("sec-ch-ua-platform") ?? "Browser",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "LOGIN",
          module: "auth",
          ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0],
          metadata: { userAgent: request.headers.get("user-agent") }
        }
      })
    ]);

    const response = ok({ user: authUser });
    response.cookies.set(authCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60
    });
    return response;
  } catch (error) {
    return fail(error);
  }
}
