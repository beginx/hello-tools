const locales = ['en', 'es', 'zh', 'ko', 'pt'];
const defaultLocale = 'en';

export default function proxy(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
    return;
  }

  const pathLocale = locales.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);

  if (!pathLocale) {
    const acceptLang = request.headers.get('accept-language') || '';
    const detected = locales.find(l => acceptLang.includes(l)) || defaultLocale;
    const newUrl = new URL(`/${detected}${pathname}${search}`, request.url);
    return Response.redirect(newUrl, 307);
  }

  request.headers.set('x-pathname', pathname);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};