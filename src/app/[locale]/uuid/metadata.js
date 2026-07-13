export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "UUID Generator - Generate Unique IDs",
    'es': "UUID Generator - Generate Unique IDs",
    'zh': "UUID Generator - Generate Unique IDs",
    'ko': "UUID Generator - Generate Unique IDs",
    'pt': "UUID Generator - Generate Unique IDs",
  };
  const descs = {
    'en': "Free online UUID/GUID generator. Generate random UUID v4 identifiers instantly. Perfect for developers, databases, API keys, and unique IDs. Multiple UUIDs at once.",
    'es': "免费在线UUID/GUID生成器。即时生成随机UUID v4标识符。适合开发人员、数据库和API密钥使用。",
    'zh': "Generador UUID/GUID en línea gratuito. Genere identificadores UUID v4 aleatorios al instante. Perfecto para desarrolladores y bases de datos.",
    'ko': "무료 온라인 UUID/GUID 생성기. 랜덤 UUID v4 식별자를 즉시 생성하세요. 개발자, 데이터베이스, API 키, 고유 ID에 완벽합니다.",
    'pt': "Gerador UUID/GUID online gratuito. Gere identificadores UUID v4 aleatórios instantaneamente. Perfeito para desenvolvedores e bancos de dados.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/uuid` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/uuid` },
  };
}
