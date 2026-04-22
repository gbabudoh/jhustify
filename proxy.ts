import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Auth Protection
  // Protect Admin routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin-token')?.value || request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect Dashboard routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/user/business')) {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. API CORS Headers
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/user/business/:path*',
    '/api/:path*',
  ],
};
