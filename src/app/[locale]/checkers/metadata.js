export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Checkers - Draughts Game Online | Play vs AI",
    'es': "Checkers - Draughts Game Online | Play vs AI",
    'zh': "Checkers - Draughts Game Online | Play vs AI",
    'ko': "Checkers - Draughts Game Online | Play vs AI",
    'pt': "Checkers - Draughts Game Online | Play vs AI",
  };
  const descs = {
    'en': "Free online checkers tool.",
    'es': "Free online checkers tool.",
    'zh': "Free online checkers tool.",
    'ko': "Free online checkers tool.",
    'pt': "Free online checkers tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/checkers` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/checkers` },
  };
}
