export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Regex Tester - Test Regular Expressions Online",
    'es': "Regex Tester - Test Regular Expressions Online",
    'zh': "Regex Tester - Test Regular Expressions Online",
    'ko': "Regex Tester - Test Regular Expressions Online",
    'pt': "Regex Tester - Test Regular Expressions Online",
  };
  const descs = {
    'en': "Free online regex tester. Test regular expressions instantly with match highlighting. Supports flags g, i, m. Perfect for developers validating patterns and extracting data.",
    'es': "免费在线正则测试器。",
    'zh': "Probador regex gratuito. Pruebe expresiones regulares al instante.",
    'ko': "무료 온라인 정규식 테스터. 정규표현식을 즉시 테스트하고 매치 하이라이팅을 확인하세요. g, i, m 플래그를 지원합니다. 패턴 검증과 데이터 추출에 완벽합니다.",
    'pt': "Testador regex online gratuito.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/regex` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/regex` },
  };
}
