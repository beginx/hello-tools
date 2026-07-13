export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "About hello-tools - Free Online Tools",
    'es': "About hello-tools - Free Online Tools",
    'zh': "About hello-tools - Free Online Tools",
    'ko': "About hello-tools - Free Online Tools",
    'pt': "About hello-tools - Free Online Tools",
  };
  const descs = {
    'en': "Free online about tool.",
    'es': "Free online about tool.",
    'zh': "Free online about tool.",
    'ko': "Free online about tool.",
    'pt': "Free online about tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/about` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/about` },
  };
}
