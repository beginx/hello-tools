export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Tarot Card Reading - Single & 3-Card Spread",
    'es': "Tarot Card Reading - Single & 3-Card Spread",
    'zh': "Tarot Card Reading - Single & 3-Card Spread",
    'ko': "Tarot Card Reading - Single & 3-Card Spread",
    'pt': "Tarot Card Reading - Single & 3-Card Spread",
  };
  const descs = {
    'en': "Free online tarot card reading. Draw single or three-card spreads for insight and guidance. Major Arcana cards with detailed meanings. For entertainment purposes.",
    'es': "免费在线塔罗牌占卜。仅供娱乐。",
    'zh': "Lectura de tarot gratuita en línea. Con fines de entretenimiento.",
    'ko': "무료 온라인 타로 카드. 한 장 또는 세 장 스프레드로 통찰과 조언을 얻으세요. 메이저 아르카나 카드와 상세한 의미를 제공합니다. 오락 목적입니다.",
    'pt': "Leitura de tarô online gratuita. Para entretenimento.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/tarot` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/tarot` },
  };
}
