export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Cannon Duel - Artillery Game Online",
    'es': "Cannon Duel - Artillery Game Online",
    'zh': "Cannon Duel - Artillery Game Online",
    'ko': "Cannon Duel - Artillery Game Online",
    'pt': "Cannon Duel - Artillery Game Online",
  };
  const descs = {
    'en': "Free online artillery tool.",
    'es': "Free online artillery tool.",
    'zh': "Free online artillery tool.",
    'ko': "Free online artillery tool.",
    'pt': "Free online artillery tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/artillery` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/artillery` },
  };
}
