import { jwtVerify, SignJWT } from "jose";
import type { Role } from "@prisma/client";
import { env } from "@backend/lib/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export async function signToken(user: AuthUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as AuthUser & { exp: number; iat: number; sub: string };
}
