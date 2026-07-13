export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "JWT Decoder - Decode JSON Web Tokens",
    'es': "JWT Decoder - Decode JSON Web Tokens",
    'zh': "JWT Decoder - Decode JSON Web Tokens",
    'ko': "JWT Decoder - Decode JSON Web Tokens",
    'pt': "JWT Decoder - Decode JSON Web Tokens",
  };
  const descs = {
    'en': "Free online JWT decoder. Decode and inspect JSON Web Tokens instantly. View header, payload, and signature. Perfect for debugging authentication and API tokens.",
    'es': "免费在线JWT解码器。即时解码和检查JSON Web Token。",
    'zh': "Decodificador JWT gratuito. Inspeccione tokens al instante.",
    'ko': "무료 온라인 JWT 디코더. JSON 웹 토큰을 즉시 디코딩하고 검사하세요. 헤더, 페이로드, 서명을 확인할 수 있습니다. 인증 및 API 토큰 디버깅에 완벽합니다.",
    'pt': "Decodificador JWT online gratuito.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/jwt` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/jwt` },
  };
}
