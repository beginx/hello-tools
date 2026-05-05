import { getRequestConfig } from 'next-intl/server';
import en from '../messages/en/app.json';
import es from '../messages/es/app.json';
import zh from '../messages/zh/app.json';
import ko from '../messages/ko/app.json';
import pt from '../messages/pt/app.json';

const locales = ['en', 'es', 'zh', 'ko', 'pt'];

const allMessages = { en, es, zh, ko, pt };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: allMessages[locale],
    timeZone: 'UTC',
  };
});

export { locales };