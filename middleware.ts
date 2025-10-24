import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Try to read the token (NEXTAUTH_SECRET must be set)
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const pathname = request.nextUrl.pathname;

  // Redirect signed-in users away from auth pages
  if (pathname.startsWith('/auth')) {
    if (token) return NextResponse.redirect(new URL('/', request.url));
    return null;
  }

  // Protect admin pages: require authenticated token with isAdmin === true
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Not authenticated -> send to signin
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Token exists but must have isAdmin flag
    if (!(token as any).isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return null;
}

// Only run middleware on auth and admin paths
export const config = {
  matcher: ['/admin/:path*', '/auth/:path*']
};
