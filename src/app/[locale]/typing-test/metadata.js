export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Typing Speed Test - WPM & Accuracy Online | Korean 한글 타자",
    'es': "Typing Speed Test - WPM & Accuracy Online | Korean 한글 타자",
    'zh': "Typing Speed Test - WPM & Accuracy Online | Korean 한글 타자",
    'ko': "Typing Speed Test - WPM & Accuracy Online | Korean 한글 타자",
    'pt': "Typing Speed Test - WPM & Accuracy Online | Korean 한글 타자",
  };
  const descs = {
    'en': "Free online typing speed test in English and Korean (한글 타자). Measure WPM, accuracy, and typing speed. Korean typing practice, 한글 타자 연습, 한글 타이핑 속도 측정. Perfect for job preparation, coding interviews, and speed training.",
    'es': "免费在线打字速度测试。测量WPM和准确度。",
    'zh': "Test gratuito de velocidad de escritura. Mida WPM y precisión.",
    'ko': "무료 온라인 한글 타자 연습 & 타이핑 속도 테스트. 한글 타자 속도 측정, 타자 연습, 타자 검정, 워드 실기, 컴퓨터 자격증 대비. 영어/한글 키보드 타이핑 WPM 측정. 취업 준비, 공무원 시험, 코딩 테스트 대비 타자 속도 향상.",
    'pt': "Teste gratuito de digitação. Meça WPM e precisão.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/typing-test` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/typing-test` },
  };
}
