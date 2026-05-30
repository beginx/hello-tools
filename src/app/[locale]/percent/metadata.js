const metaByLocale = {
  en: { title: 'Percentage Calculator — Free Online Percent Calculator', desc: 'Free online percentage calculator. Calculate what is X% of Y, X is what percent of Y, and percentage change between two numbers.' },
  es: { title: 'Calculadora de Porcentajes — Gratis Online', desc: 'Calculadora de porcentajes gratuita. Calcula qué es X% de Y, qué porcentaje es X de Y, y cambio porcentual.' },
  zh: { title: '百分比计算器 — 免费在线百分比计算', desc: '免费在线百分比计算器。计算 X 的 Y% 是多少、X 是 Y 的百分之几、以及百分比变化。' },
  ko: { title: '퍼센트 계산기 — 무료 온라인 퍼센트 계산', desc: '무료 온라인 퍼센트 계산기. X의 Y% 계산, X는 Y의 몇%인지 계산, 퍼센트 변화를 계산합니다.' },
  pt: { title: 'Calculadora de Porcentagem — Grátis Online', desc: 'Calculadora de porcentagem gratuita. Calcule X% de Y, X é quantos % de Y, e mudança percentual.' },
};

export default function generateMetadata({ params }) {
  const locale = params.locale || 'en';
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/percent` },
  };
}