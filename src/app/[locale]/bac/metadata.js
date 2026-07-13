export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "BAC Calculator - Blood Alcohol Content",
    'es': "BAC Calculator - Blood Alcohol Content",
    'zh': "BAC Calculator - Blood Alcohol Content",
    'ko': "BAC Calculator - Blood Alcohol Content",
    'pt': "BAC Calculator - Blood Alcohol Content",
  };
  const descs = {
    'en': "Free online BAC calculator. Estimate your blood alcohol content based on weight, gender, drinks, and time. Educational tool about alcohol metabolism and safety.",
    'es': "免费在BAC计算器。",
    'zh': "Calculadora gratuita de alcohol en sangre.",
    'ko': "무료 온라인 혈중알코올농도(BAC) 계산기. 체중, 성별, 음주량, 시간을 기반으로 BAC를 추정하세요. 알코올 대사와 안전에 관한 교육용 도구입니다.",
    'pt': "Calculadora gratuita de álcool no sangue.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/bac` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/bac` },
  };
}
