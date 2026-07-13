export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Emoji Picker - Search & Copy Emojis",
    'es': "Emoji Picker - Search & Copy Emojis",
    'zh': "Emoji Picker - Search & Copy Emojis",
    'ko': "Emoji Picker - Search & Copy Emojis",
    'pt': "Emoji Picker - Search & Copy Emojis",
  };
  const descs = {
    'en': "Free online emoji picker and emoji keyboard. Search, browse, and copy emojis instantly. Browse by categories: smileys, people, animals, food, activities, travel, objects, symbols, and flags. Click any emoji to copy to clipboard.",
    'es': "免费在线表情选择器。搜索、浏览和复制表情。",
    'zh': "Buscador de emojis gratuito. Busca y copia emojis al instante.",
    'ko': "무료 온라인 이모지 검색기. 1,800개 이상의 이모지를 카테고리별로 둘러보고 클릭 한 번으로 복사하세요. 스마일리, 사람, 동물, 음식, 활동, 여행, 사물, 기호, 국기 등 모든 이모지 지원.",
    'pt': "Seletor de emojis gratuito. Busque e copie emojis instantaneamente.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/emoji` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/emoji` },
  };
}
