export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "MBTI Personality Test - 16 Types",
    'es': "MBTI Personality Test - 16 Types",
    'zh': "MBTI Personality Test - 16 Types",
    'ko': "MBTI Personality Test - 16 Types",
    'pt': "MBTI Personality Test - 16 Types",
  };
  const descs = {
    'en': "Free MBTI personality test. Discover your 16-type personality with this quick and easy assessment. Based on Myers-Briggs Type Indicator dimensions.",
    'es': "免费MBTI性格测试，发现您的16型人格。",
    'zh': "Test MBTI gratuito en línea.",
    'ko': "무료 MBTI 성격 테스트. 16가지 성격 유형을 빠르고 쉽게 알아보세요. 마이어스-브릭스 유형 지표 기반의 간편한 자가 진단입니다.",
    'pt': "Teste MBTI gratuito online.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/mbti` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/mbti` },
  };
}
