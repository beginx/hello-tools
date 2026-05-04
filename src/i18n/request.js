import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'es', 'zh', 'ko', 'pt'];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale)) {
    locale = 'en';
  }

  const messages = (await import(`../messages/index.json`)).default;

  return {
    locale,
    messages: messages[locale],
    timeZone: 'UTC',
  };
});

export { locales };