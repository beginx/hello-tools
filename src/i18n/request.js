import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale, requestLocale }) => {
  // Try requestLocale first, then locale param, then extract from x-pathname header
  let resolvedLocale = await requestLocale || locale;

  if (!resolvedLocale) {
    // Fallback: try to get from headers
    try {
      const { headers } = await import('next/headers');
      const h = await headers();
      const pathname = h.get('x-pathname') || '';
      const match = pathname.match(/^\/([a-z]{2})(\/|$)/);
      resolvedLocale = match ? match[1] : 'en';
    } catch {
      resolvedLocale = 'en';
    }
  }

  const messages = (await import(`../messages/index.json`)).default;
  return {
    locale: resolvedLocale,
    messages: messages[resolvedLocale] || messages.en
  };
});