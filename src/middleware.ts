import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow login and register pages
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
    return NextResponse.next();
  }

  // For other routes, we'll handle authentication client-side
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

