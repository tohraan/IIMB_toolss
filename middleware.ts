import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Allow access to login, signup, and home page without auth
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next()
  }

  // For now, allow access to all protected routes
  // The client-side components will handle auth checks via localStorage
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
