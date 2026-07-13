export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Case Converter - UPPERCASE, lowercase, Title Case",
    'es': "Case Converter - UPPERCASE, lowercase, Title Case",
    'zh': "Case Converter - UPPERCASE, lowercase, Title Case",
    'ko': "Case Converter - UPPERCASE, lowercase, Title Case",
    'pt': "Case Converter - UPPERCASE, lowercase, Title Case",
  };
  const descs = {
    'en': "Free online text case converter. Convert text to uppercase, lowercase, title case, sentence case, and more. Quick and easy text formatting tool.",
    'es': "免费在线大小写转换器。将文本转换为大写、小写、标题大小写等多种格式。",
    'zh': "Conversor gratuito de mayúsculas/minúsculas en línea.",
    'ko': "무료 온라인 대소문자 변환기. 텍스트를 대문자, 소문자, 타이틀 케이스 등으로 변환하세요. 빠르고 쉬운 텍스트 포맷팅 도구입니다.",
    'pt': "Conversor online gratuito de caixa de texto.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/caseconverter` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/caseconverter` },
  };
}
