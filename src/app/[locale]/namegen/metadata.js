export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Name Generator - Random Name Generator",
    'es': "Name Generator - Random Name Generator",
    'zh': "Name Generator - Random Name Generator",
    'ko': "Name Generator - Random Name Generator",
    'pt': "Name Generator - Random Name Generator",
  };
  const descs = {
    'en': "Free online namegen tool.",
    'es': "Free online namegen tool.",
    'zh': "Free online namegen tool.",
    'ko': "Free online namegen tool.",
    'pt': "Free online namegen tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/namegen` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/namegen` },
  };
}
