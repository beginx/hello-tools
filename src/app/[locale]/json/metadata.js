export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "JSON Formatter & Validator - Pretty Print JSON",
    'es': "JSON Formatter & Validator - Pretty Print JSON",
    'zh': "JSON Formatter & Validator - Pretty Print JSON",
    'ko': "JSON Formatter & Validator - Pretty Print JSON",
    'pt': "JSON Formatter & Validator - Pretty Print JSON",
  };
  const descs = {
    'en': "Free online JSON formatter, validator, and beautifier. Pretty print, minify, and validate JSON instantly. Perfect for developers working with APIs, configs, and data.",
    'es': "免费在线JSON格式化器。即时美化和验证JSON。",
    'zh': "Formateador JSON gratuito. Valide y embellezca JSON al instante.",
    'ko': "무료 온라인 JSON 포매터, 검증기, 뷰티파이어. JSON을 즉시 정렬하고 압축하고 검증하세요. API, 설정, 데이터를 다루는 개발자에게 완벽합니다.",
    'pt': "Formatador JSON online gratuito.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/json` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/json` },
  };
}
