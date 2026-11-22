import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenWeb } from "./lib/token-utils";

const ADMIN_COOKIE_NAME = "rw_admin_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin UI dashboard routes, excluding the login page
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifyTokenWeb(sessionToken);

    if (!isValid) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
