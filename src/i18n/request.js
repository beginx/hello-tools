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
import enQr from '../messages/en/qr.json';
import esQr from '../messages/es/qr.json';
import zhQr from '../messages/zh/qr.json';
import koQr from '../messages/ko/qr.json';
import ptQr from '../messages/pt/qr.json';

const locales = ['en', 'es', 'zh', 'ko', 'pt'];

const allMessages = {
  en: { app: en, convert: enConvert, qr: enQr },
  es: { app: es, convert: esConvert, qr: esQr },
  zh: { app: zh, convert: zhConvert, qr: zhQr },
  ko: { app: ko, convert: koConvert, qr: koQr },
  pt: { app: pt, convert: ptConvert, qr: ptQr },
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