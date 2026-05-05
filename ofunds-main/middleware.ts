import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { OfundsRoutes } from "@/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for authentication token in cookies
  const token =
    request.cookies.get("jetsend:access_token")?.value ||
    request.cookies.get("jetsend%3Aaccess_token")?.value;
  const isAuthenticated = !!token;

  // Check if the current path is a public route
  const isPublicRoute = OfundsRoutes.isPublicRoute(pathname);
  
  // Check if the current path is a protected route
  const isProtectedRoute = OfundsRoutes.isProtectedRoute(pathname);
  
  // Check if the current path is an API route
  const isApiRoute = OfundsRoutes.isApiRoute(pathname);

  // If it's an API route, let it pass (API will handle authentication)
  if (isApiRoute) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && isProtectedRoute) {
    const signInUrl = new URL(OfundsRoutes.login, request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated and trying to access auth pages
  if (isAuthenticated && (pathname === OfundsRoutes.login || pathname === OfundsRoutes.signUp)) {
    return NextResponse.redirect(new URL(OfundsRoutes.dashboard, request.url));
  }

  // Allow access to public routes or authenticated users to protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
