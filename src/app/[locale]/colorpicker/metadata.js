export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Color Picker & Converter - HEX, RGB, HSL",
    'es': "Color Picker & Converter - HEX, RGB, HSL",
    'zh': "Color Picker & Converter - HEX, RGB, HSL",
    'ko': "Color Picker & Converter - HEX, RGB, HSL",
    'pt': "Color Picker & Converter - HEX, RGB, HSL",
  };
  const descs = {
    'en': "Free online color converter. Convert between HEX, RGB, and HSL color formats instantly with live preview. Perfect for designers and developers.",
    'es': "免费在线颜色转换器。",
    'zh': "Conversor de color gratuito en línea.",
    'ko': "무료 온라인 색상 변환기. HEX, RGB, HSL 형식 간 즉시 변환하고 실시간 미리보기를 제공합니다. 디자이너와 개발자에게 완벽한 도구입니다.",
    'pt': "Conversor de cor online gratuito.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/colorpicker` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/colorpicker` },
  };
}
