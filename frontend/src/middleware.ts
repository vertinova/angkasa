import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/students",
  "/teachers",
  "/classes",
  "/attendance",
  "/academics",
  "/schedules",
  "/finance",
  "/elearning",
  "/library",
  "/announcements",
  "/chat",
  "/documents",
  "/settings"
];

export function middleware(request: NextRequest) {
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  const token = request.cookies.get("sd_angkasa_3_token")?.value;

  if (isProtected && !token) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
    const loginUrl = new URL("/login", base);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && token) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
    return NextResponse.redirect(new URL("/dashboard", base));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/upload).*)"]
};
