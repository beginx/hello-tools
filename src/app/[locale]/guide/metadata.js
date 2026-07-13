export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Guides & Tutorials - How to Use hello-tools",
    'es': "Guides & Tutorials - How to Use hello-tools",
    'zh': "Guides & Tutorials - How to Use hello-tools",
    'ko': "Guides & Tutorials - How to Use hello-tools",
    'pt': "Guides & Tutorials - How to Use hello-tools",
  };
  const descs = {
    'en': "Free online guide tool.",
    'es': "Free online guide tool.",
    'zh': "Free online guide tool.",
    'ko': "Free online guide tool.",
    'pt': "Free online guide tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/guide` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/guide` },
  };
}
