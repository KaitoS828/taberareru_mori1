import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware: Admin routes protection with cookie-based session
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect admin pages
  if (pathname.startsWith('/admin')) {
    return handleAdminAuth(request);
  }

  // Protect admin API routes (POST/DELETE)
  if (pathname === '/api/reservations' && (request.method === 'POST' || request.method === 'DELETE')) {
    return handleAdminAuth(request);
  }

  return NextResponse.next();
}

function handleAdminAuth(request: NextRequest): NextResponse {
  const sessionToken = request.cookies.get('admin_session')?.value;

  if (sessionToken === 'authenticated') {
    return NextResponse.next();
  }

  // Redirect to login page for page requests
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Return 401 for API requests
  return new NextResponse('Unauthorized', { status: 401 });
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/reservations',
  ],
};
