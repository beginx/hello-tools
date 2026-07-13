export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Data Size Converter - Bytes, KB, MB, GB",
    'es': "Data Size Converter - Bytes, KB, MB, GB",
    'zh': "Data Size Converter - Bytes, KB, MB, GB",
    'ko': "Data Size Converter - Bytes, KB, MB, GB",
    'pt': "Data Size Converter - Bytes, KB, MB, GB",
  };
  const descs = {
    'en': "Free online data size converter. Convert between Bytes, KB, MB, GB, TB, and PB instantly. Perfect for developers, IT professionals, and students.",
    'es': "免费在线数据大小转换器。",
    'zh': "Conversor gratuito de tamaño de datos.",
    'ko': "무료 온라인 데이터 크기 변환기. 바이트, KB, MB, GB, TB, PB 간 즉시 변환하세요. 개발자, IT 전문가, 학생에게 완벽합니다.",
    'pt': "Conversor gratuito de tamanho de dados.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/datasize` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/datasize` },
  };
}
