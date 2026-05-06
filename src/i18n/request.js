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
import enPhoto from '../messages/en/photo.json';
import esPhoto from '../messages/es/photo.json';
import zhPhoto from '../messages/zh/photo.json';
import koPhoto from '../messages/ko/photo.json';
import ptPhoto from '../messages/pt/photo.json';
import enDate from '../messages/en/date.json';
import esDate from '../messages/es/date.json';
import zhDate from '../messages/zh/date.json';
import koDate from '../messages/ko/date.json';
import ptDate from '../messages/pt/date.json';
import enPassword from '../messages/en/password.json';
import esPassword from '../messages/es/password.json';
import zhPassword from '../messages/zh/password.json';
import koPassword from '../messages/ko/password.json';
import ptPassword from '../messages/pt/password.json';
import enLotto from '../messages/en/lotto.json';
import esLotto from '../messages/es/lotto.json';
import zhLotto from '../messages/zh/lotto.json';
import koLotto from '../messages/ko/lotto.json';
import ptLotto from '../messages/pt/lotto.json';
import enPdf from '../messages/en/pdf.json';
import esPdf from '../messages/es/pdf.json';
import zhPdf from '../messages/zh/pdf.json';
import koPdf from '../messages/ko/pdf.json';
import ptPdf from '../messages/pt/pdf.json';
import enPercent from '../messages/en/percent.json';
import esPercent from '../messages/es/percent.json';
import zhPercent from '../messages/zh/percent.json';
import koPercent from '../messages/ko/percent.json';
import ptPercent from '../messages/pt/percent.json';
import enCurrency from '../messages/en/currency.json';
import esCurrency from '../messages/es/currency.json';
import zhCurrency from '../messages/zh/currency.json';
import koCurrency from '../messages/ko/currency.json';
import ptCurrency from '../messages/pt/currency.json';
import enPrivacy from '../messages/en/privacy.json';
import esPrivacy from '../messages/es/privacy.json';
import zhPrivacy from '../messages/zh/privacy.json';
import koPrivacy from '../messages/ko/privacy.json';
import ptPrivacy from '../messages/pt/privacy.json';
import enRandom from '../messages/en/random.json';
import esRandom from '../messages/es/random.json';
import zhRandom from '../messages/zh/random.json';
import koRandom from '../messages/ko/random.json';
import ptRandom from '../messages/pt/random.json';

const locales = ['en', 'es', 'zh', 'ko', 'pt'];

const allMessages = {
  en: { app: en, convert: enConvert, qr: enQr, photo: enPhoto, date: enDate, password: enPassword, lotto: enLotto, pdf: enPdf, percent: enPercent, currency: enCurrency, privacy: enPrivacy, random: enRandom },
  es: { app: es, convert: esConvert, qr: esQr, photo: esPhoto, date: esDate, password: esPassword, lotto: esLotto, pdf: esPdf, percent: esPercent, currency: esCurrency, privacy: esPrivacy, random: esRandom },
  zh: { app: zh, convert: zhConvert, qr: zhQr, photo: zhPhoto, date: zhDate, password: zhPassword, lotto: zhLotto, pdf: zhPdf, percent: zhPercent, currency: zhCurrency, privacy: zhPrivacy, random: zhRandom },
  ko: { app: ko, convert: koConvert, qr: koQr, photo: koPhoto, date: koDate, password: koPassword, lotto: koLotto, pdf: koPdf, percent: koPercent, currency: koCurrency, privacy: koPrivacy, random: koRandom },
  pt: { app: pt, convert: ptConvert, qr: ptQr, photo: ptPhoto, date: ptDate, password: ptPassword, lotto: ptLotto, pdf: ptPdf, percent: ptPercent, currency: ptCurrency, privacy: ptPrivacy, random: ptRandom },
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