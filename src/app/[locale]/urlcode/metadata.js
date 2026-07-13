export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "URL Encoder/Decoder - Encode & Decode URLs",
    'es': "URL Encoder/Decoder - Encode & Decode URLs",
    'zh': "URL Encoder/Decoder - Encode & Decode URLs",
    'ko': "URL Encoder/Decoder - Encode & Decode URLs",
    'pt': "URL Encoder/Decoder - Encode & Decode URLs",
  };
  const descs = {
    'en': "Free online URL encoder and decoder. Encode special characters for safe URLs or decode percent-encoded URLs back to readable text. Essential web development tool.",
    'es': "免费在线URL编解码器。",
    'zh': "Codificador/decodificador de URL gratuito.",
    'ko': "무료 온라인 URL 인코더/디코더. 특수문자를 URL 안전 형식으로 인코딩하거나, 퍼센트 인코딩된 URL을 읽을 수 있는 텍스트로 디코딩하세요. 필수 웹 개발 도구입니다.",
    'pt': "Codificador URL online gratuito.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/urlcode` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/urlcode` },
  };
}
