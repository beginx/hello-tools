export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Roman Numeral Converter - Convert Numbers",
    'es': "Roman Numeral Converter - Convert Numbers",
    'zh': "Roman Numeral Converter - Convert Numbers",
    'ko': "Roman Numeral Converter - Convert Numbers",
    'pt': "Roman Numeral Converter - Convert Numbers",
  };
  const descs = {
    'en': "Free online Roman numeral converter. Convert numbers to Roman numerals (I, V, X, L, C, D, M) and back. Perfect for students, history, and education.",
    'es': "免费在线罗马数字转换器。",
    'zh': "Conversor gratuito de números romanos.",
    'ko': "무료 온라인 로마 숫자 변환기. 숫자를 로마 숫자(I, V, X, L, C, D, M)로, 또는 로마 숫자를 일반 숫자로 변환하세요. 학생, 역사, 교육에 완벽합니다.",
    'pt': "Conversor gratuito de algarismos romanos.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/roman` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/roman` },
  };
}
