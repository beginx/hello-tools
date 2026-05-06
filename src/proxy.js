import createMiddleware from 'next-intl/middleware';

const locales = ['en', 'es', 'zh', 'ko', 'pt'];

const middleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default function combinedMiddleware(request) {
  const response = middleware(request);
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};