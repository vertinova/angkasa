import { NextResponse } from "next/server";
import { authCookieName } from "@backend/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true, data: { loggedOut: true } });
  response.cookies.set(authCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
