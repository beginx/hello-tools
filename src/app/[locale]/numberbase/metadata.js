export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Number Base Converter - Binary, Hex, Octal",
    'es': "Number Base Converter - Binary, Hex, Octal",
    'zh': "Number Base Converter - Binary, Hex, Octal",
    'ko': "Number Base Converter - Binary, Hex, Octal",
    'pt': "Number Base Converter - Binary, Hex, Octal",
  };
  const descs = {
    'en': "Free online number base converter. Convert between decimal, binary, hexadecimal, and octal instantly. Perfect for programmers and students.",
    'es': "免费在线进制转换器。在十进制、二进制、十六进制和八进制之间即时转换。",
    'zh': "Conversor gratuito de bases numéricas en línea.",
    'ko': "무료 온라인 진법 변환기. 10진수, 2진수, 16진수, 8진수 간 즉시 변환하세요. 프로그래머와 학생에게 완벽합니다.",
    'pt': "Conversor gratuito de bases numéricas.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/numberbase` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/numberbase` },
  };
}
