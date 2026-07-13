export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Lorem Ipsum Generator - Placeholder Text",
    'es': "Lorem Ipsum Generator - Placeholder Text",
    'zh': "Lorem Ipsum Generator - Placeholder Text",
    'ko': "Lorem Ipsum Generator - Placeholder Text",
    'pt': "Lorem Ipsum Generator - Placeholder Text",
  };
  const descs = {
    'en': "Free Lorem Ipsum generator for designers and developers. Generate placeholder text in paragraphs with customizable length. Perfect for mockups, wireframes, and templates.",
    'es': "免费Lorem Ipsum生成器，为设计师和开发者生成占位文本。",
    'zh': "Generador Lorem Ipsum gratuito. Genere texto de relleno en párrafos personalizables.",
    'ko': "디자이너와 개발자를 위한 무료 로렘 입숨 생성기. 맞춤형 길이의 플레이스홀더 텍스트를 생성하세요. 목업, 와이어프레임, 템플릿에 완벽합니다.",
    'pt': "Gerador Lorem Ipsum gratuito para designers e desenvolvedores.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/lorem` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/lorem` },
  };
}
