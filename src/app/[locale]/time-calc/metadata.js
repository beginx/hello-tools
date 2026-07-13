export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Time Calculator - Add & Subtract Time",
    'es': "Time Calculator - Add & Subtract Time",
    'zh': "Time Calculator - Add & Subtract Time",
    'ko': "Time Calculator - Add & Subtract Time",
    'pt': "Time Calculator - Add & Subtract Time",
  };
  const descs = {
    'en': "Free online time calculator. Add or subtract hours, minutes, and seconds. Convert time to total hours, minutes, or seconds. Perfect for work hours tracking, project time estimation, and time math.",
    'es': "免费在线时间计算器。加减小时、分钟和秒。",
    'zh': "Calculadora de tiempo gratuita. Sume o reste horas, minutos y segundos.",
    'ko': "무료 온라인 시간 계산기. 시간, 분, 초를 더하고 뺄 수 있습니다. 근무 시간 추적, 프로젝트 시간 산정에 유용합니다.",
    'pt': "Calculadora de tempo gratuita. Some ou subtraia horas, minutos e segundos.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/time-calc` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/time-calc` },
  };
}
