import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifyToken, type AuthUser } from "./jwt";

export const authCookieName = "sd_angkasa_3_token";

export async function getAuthUserFromRequest(request?: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request?.cookies.get(authCookieName)?.value ?? (await cookies()).get(authCookieName)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}
