import { NextResponse } from 'next/server';

const locales = ['en', 'es', 'zh', 'ko', 'pt'];
const defaultLocale = 'en';

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const pathLocale = locales.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);

  if (!pathLocale) {
    const acceptLang = request.headers.get('accept-language') || '';
    const detected = locales.find(l => acceptLang.includes(l)) || defaultLocale;
    const newUrl = new URL(`/${detected}${pathname === '/' ? '' : pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};