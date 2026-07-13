export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "ASCII Art Generator - Text to ASCII Art",
    'es': "ASCII Art Generator - Text to ASCII Art",
    'zh': "ASCII Art Generator - Text to ASCII Art",
    'ko': "ASCII Art Generator - Text to ASCII Art",
    'pt': "ASCII Art Generator - Text to ASCII Art",
  };
  const descs = {
    'en': "Free online ascii art tool.",
    'es': "Free online ascii art tool.",
    'zh': "Free online ascii art tool.",
    'ko': "Free online ascii art tool.",
    'pt': "Free online ascii art tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/ascii-art` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/ascii-art` },
  };
}
