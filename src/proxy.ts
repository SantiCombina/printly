import { decodeJwt } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('payload-token')?.value;

  let role: string | undefined;
  let isAuthenticated = false;

  if (token) {
    try {
      const claims = decodeJwt(token);
      role = (claims as { role?: string }).role;
      isAuthenticated = true;
    } catch {
      // token malformado — dejar pasar, Payload lo rechazará
    }
  }

  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/app/settings')) {
    if (role !== 'owner') {
      return NextResponse.redirect(new URL('/app', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/app')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/app', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/app', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*', '/app/settings/:path*', '/login', '/'],
};
