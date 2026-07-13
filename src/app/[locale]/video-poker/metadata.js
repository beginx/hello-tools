export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Video Poker - Jacks or Better Casino Game",
    'es': "Video Poker - Jacks or Better Casino Game",
    'zh': "Video Poker - Jacks or Better Casino Game",
    'ko': "Video Poker - Jacks or Better Casino Game",
    'pt': "Video Poker - Jacks or Better Casino Game",
  };
  const descs = {
    'en': "Free online video poker tool.",
    'es': "Free online video poker tool.",
    'zh': "Free online video poker tool.",
    'ko': "Free online video poker tool.",
    'pt': "Free online video poker tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/video-poker` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/video-poker` },
  };
}
