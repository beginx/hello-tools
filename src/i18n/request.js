import { getRequestConfig } from 'next-intl/server';
import en from '../messages/en/app.json';
import es from '../messages/es/app.json';
import zh from '../messages/zh/app.json';
import ko from '../messages/ko/app.json';
import pt from '../messages/pt/app.json';
import enConvert from '../messages/en/convert.json';
import esConvert from '../messages/es/convert.json';
import zhConvert from '../messages/zh/convert.json';
import koConvert from '../messages/ko/convert.json';
import ptConvert from '../messages/pt/convert.json';

const locales = ['en', 'es', 'zh', 'ko', 'pt'];

const allMessages = {
  en: { app: en, convert: enConvert },
  es: { app: es, convert: esConvert },
  zh: { app: zh, convert: zhConvert },
  ko: { app: ko, convert: koConvert },
  pt: { app: pt, convert: ptConvert },
};

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