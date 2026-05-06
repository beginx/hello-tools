const metaByLocale = {
  en: { title: 'Date Calculator — Days Between Dates, D-Day, Age — Free Online Tool', desc: 'Free online date calculator: calculate days between dates, D-Day countdown, add/subtract days, calculate Korean age, and anniversary tracking. Mac OS 9 retro style.' },
  es: { title: 'Calculadora de Fechas — Días Entre Fechas, D-Day, Edad — Herramienta Gratuita', desc: 'Calculadora de fechas gratuita: calcule días entre fechas, cuenta regresiva D-Day, suma/resta días, edad y aniversarios.' },
  zh: { title: '日期计算器 — 日期间隔、D-Day、年龄 — 免费在线工具', desc: '免费日期计算器：计算日期间隔、D-Day倒计时、日期加减、年龄和纪念日。' },
  ko: { title: '날짜 계산기 — 날짜 간격, D-Day, 나이 — 무료 온라인 도구', desc: '무료 날짜 계산기: 날짜 간격 계산, D-Day 카운트다운, 날짜 더하기/빼기, 만 나이, 기념일까지 한 번에.' },
  pt: { title: 'Calculadora de Datas — Dias Entre Datas, D-Day, Idade — Ferramenta Gratuita', desc: 'Calculadora de datas gratuita: calcule dias entre datas, contagem regressiva D-Day, adicionar/subtrair dias, idade e aniversários.' },
};

export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/date` },
  };
}