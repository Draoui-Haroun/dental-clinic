
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "dental_clinic_session";

export function proxy(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const pathname = request.nextUrl.pathname;
  console.log(
    "PROXY:",
    pathname,
    "SESSION:",
    session
  );

  // /entry decides where the user should go.
  if (pathname === "/entry") {
    return NextResponse.next();
  }

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/setup";

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (session && isPublicRoute) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};