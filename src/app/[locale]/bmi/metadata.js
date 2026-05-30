const metaByLocale = {
  en: { title: 'BMI Calculator — Body Mass Index — Free Online Tool', desc: 'Calculate your Body Mass Index (BMI) and check your weight category. Free online BMI calculator with color-coded gauge and healthy weight range. Mac OS 9 retro style.' },
  es: { title: 'Calculadora de IMC — Índice de Masa Corporal — Herramienta Gratuita', desc: 'Calcule su Índice de Masa Corporal (IMC) y verifique su categoría de peso. Calculadora de IMC gratuita con indicador de color.' },
  zh: { title: 'BMI计算器 — 身体质量指数 — 免费在线工具', desc: '计算您的身体质量指数（BMI）并查看体重类别。带有彩色指示器的免费BMI计算器。' },
  ko: { title: 'BMI 계산기 — 체질량지수 — 무료 온라인 도구', desc: '체질량지수(BMI)를 계산하고 체중 카테고리를 확인하세요. 컬러 게이지가 있는 무료 BMI 계산기입니다.' },
  pt: { title: 'Calculadora de IMC — Índice de Massa Corporal — Ferramenta Gratuita', desc: 'Calcule seu Índice de Massa Corporal (IMC) e verifique sua categoria de peso. Calculadora de IMC gratuita com indicador colorido.' },
};

export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/bmi` },
  };
}