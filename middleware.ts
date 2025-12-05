import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register',];
// Note: You can optionally define the API regex here if you prefer:
// const publicApiRegex = /^\/api\/displays\/[^\/]+\/config$/; 
const adminPaths = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Allow public front-end paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. Allow ONLY the live display route (Front-end page)
  if (pathname.match(/^\/displays\/[^\/]+\/live$/)) {
    return NextResponse.next();
  }

  // 3. ✨ NEW: Allow the public CONFIG API route for the live display ✨
  // This regex matches /api/displays/[ID]/config exactly.
  if (pathname.match(/^\/api\/displays\/[^\/]+\/config$/)) {
      return NextResponse.next();
  }

  // 4. Allow public assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check authentication (everything below this point requires a token)
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const user = await verifyToken(token);
  
  if (!user) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('auth_token', '', { maxAge: 0 });
    return response;
  }

  // Check admin access
  if (adminPaths.some(path => pathname.startsWith(path)) && user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};