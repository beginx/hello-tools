export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Base64 Encoder/Decoder - Encode & Decode Online",
    'es': "Base64 Encoder/Decoder - Encode & Decode Online",
    'zh': "Base64 Encoder/Decoder - Encode & Decode Online",
    'ko': "Base64 Encoder/Decoder - Encode & Decode Online",
    'pt': "Base64 Encoder/Decoder - Encode & Decode Online",
  };
  const descs = {
    'en': "Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 back to plain text instantly. Perfect for developers working with data encoding.",
    'es': "免费在线Base64编解码器。",
    'zh': "Codificador/decodificador Base64 en línea gratuito.",
    'ko': "무료 온라인 Base64 인코더/디코더. 텍스트를 Base64로 인코딩하거나 Base64를 일반 텍스트로 디코딩하세요. 개발자를 위한 데이터 인코딩 도구입니다.",
    'pt': "Codificador Base64 online gratuito.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/base64` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/base64` },
  };
}
