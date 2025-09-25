import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isProtectedRoute } from '@/constants/ProtectedRoutes';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const authToken = req.cookies.get(
    'sb-ljeqsttgtzurlyjvndfu-auth-token'
  )?.value;

  const isStaticFile =
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    (req.nextUrl.pathname.includes('.') && !req.nextUrl.pathname.includes('/'));

  const isProtected = isProtectedRoute(req.nextUrl.pathname);

  if (!session && isProtected && !isStaticFile) {
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|signup|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
};
