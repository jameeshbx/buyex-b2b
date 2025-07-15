import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is signed in and tries to access auth pages, redirect to staff dashboard
    if (token && pathname.startsWith("/(auth)")) {
      return NextResponse.redirect(new URL("/staff/dashboard", req.url));
    }

    // If user is not signed in and tries to access protected pages, redirect to signin
    if (!token && pathname.startsWith("/(protected)")) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes regardless of auth status
        if (pathname.startsWith("/(public)")) {
          return true;
        }
        
        // Allow access to auth routes for non-authenticated users
        if (pathname.startsWith("/(auth)")) {
          return true;
        }
        
        // Require authentication for protected routes
        if (pathname.startsWith("/(protected)")) {
          return !!token;
        }
        
        // Default: allow access
        return true;
      },
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
