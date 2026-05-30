const metaByLocale = {
  en: { title: 'Currency Converter — Free Online Exchange Rate Calculator', desc: 'Free online currency converter. Convert between 20 major world currencies including USD, EUR, GBP, JPY, KRW, CNY and more. Live exchange rates.' },
  es: { title: 'Conversor de Moneda — Calculadora de Tipo de Cambio Gratis', desc: 'Conversor de moneda gratuito. Convierta entre 20 monedas principales incluyendo USD, EUR, GBP, JPY, KRW, CNY y más.' },
  zh: { title: '货币转换器 — 免费在线汇率计算器', desc: '免费在线货币转换器。在20种主要货币之间进行转换，包括美元、欧元、英镑、日元、韩元、人民币等。' },
  ko: { title: '통화 변환기 — 무료 온라인 환율 계산기', desc: '무료 온라인 통화 변환기. USD, EUR, GBP, JPY, KRW, CNY 등 20개 주요 통화 간 환율을 실시간으로 변환합니다.' },
  pt: { title: 'Conversor de Moedas — Calculadora de Câmbio Grátis', desc: 'Conversor de moedas gratuito. Converta entre 20 moedas principais incluindo USD, EUR, GBP, JPY, KRW, CNY e mais.' },
};

export default function generateMetadata({ params }) {
  const locale = params.locale || 'en';
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/currency` },
  };
}