export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Timezone Converter - World Clock & Time Converter",
    'es': "Timezone Converter - World Clock & Time Converter",
    'zh': "Timezone Converter - World Clock & Time Converter",
    'ko': "Timezone Converter - World Clock & Time Converter",
    'pt': "Timezone Converter - World Clock & Time Converter",
  };
  const descs = {
    'en': "Free online timezone converter and world clock. Convert time between any timezone instantly. Compare UTC, EST, PST, GMT, KST, JST, and over 400 IANA timezones. Perfect for scheduling international meetings, travel planning, and remote work.",
    'es': "免费在线时区转换器和世界时钟。即时转换任意时区时间。支持UTC、EST、PST、GMT、KST、JST等400多个IANA时区。适用于国际会议、旅行规划和远程工作。",
    'zh': "Convertidor de zona horaria gratuito. Convierte entre cualquier zona horaria al instante. UTC, EST, PST, GMT, KST, JST y más de 400 zonas IANA. Perfecto para reuniones internacionales y viajes.",
    'ko': "무료 온라인 시간대 변환기 및 세계 시계. 전 세계 시간대 간 시간을 즉시 변환하세요. UTC, EST, PST, GMT, KST, JST 등 400개 이상의 IANA 시간대를 지원합니다. 국제 회의 일정, 여행 계획, 원격 근무에 완벽합니다.",
    'pt': "Conversor de fuso horário gratuito. Converta entre qualquer fuso horário instantaneamente. UTC, EST, PST, GMT, KST, JST e mais de 400 fusos IANA. Perfeito para reuniões internacionais e viagens.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/timezone` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/timezone` },
  };
}
