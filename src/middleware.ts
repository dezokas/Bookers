import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.AUTH_SECRET || "bookers_secret_session_key_jwt_authentication_2026_secure";
const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lindungi seluruh rute yang berawalan /dashboard
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = request.cookies.get("bookers_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(sessionCookie, encodedKey, {
        algorithms: ["HS256"],
      });

      const userRole = (payload as any).role;

      // Hanya role 'admin' yang diizinkan membuka dashboard
      if (userRole !== "admin") {
        const homeUrl = new URL("/", request.url);
        homeUrl.searchParams.set("error", "unauthorized_role");
        return NextResponse.redirect(homeUrl);
      }

      return NextResponse.next();
    } catch {
      // Token tidak valid atau kadaluarsa
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("bookers_session");
      return response;
    }
  }

  // Jika pengguna sudah login sebagai admin dan membuka /login atau /register, arahkan ke /dashboard
  if (pathname === "/login" || pathname === "/register") {
    const sessionCookie = request.cookies.get("bookers_session")?.value;
    if (sessionCookie) {
      try {
        const { payload } = await jwtVerify(sessionCookie, encodedKey, {
          algorithms: ["HS256"],
        });
        if ((payload as any).role === "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        // Token bermasalah, biarkan akses /login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

