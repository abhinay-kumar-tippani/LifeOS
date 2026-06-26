import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Refresh auth cookies first
  const response = await updateSession(request);

  // If a logged-in user hits the marketing page, send them straight to the app.
  // We check for Supabase auth cookies rather than making another getUser() call
  // to avoid a second network round-trip on every request.
  if (request.nextUrl.pathname === "/") {
    const hasAuthToken = request.cookies.getAll().some(
      (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
    );
    if (hasAuthToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};