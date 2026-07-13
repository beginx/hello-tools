export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Color Contrast Checker - WCAG Accessibility",
    'es': "Color Contrast Checker - WCAG Accessibility",
    'zh': "Color Contrast Checker - WCAG Accessibility",
    'ko': "Color Contrast Checker - WCAG Accessibility",
    'pt': "Color Contrast Checker - WCAG Accessibility",
  };
  const descs = {
    'en': "Free online color contrast tool.",
    'es': "Free online color contrast tool.",
    'zh': "Free online color contrast tool.",
    'ko': "Free online color contrast tool.",
    'pt': "Free online color contrast tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/color-contrast` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/color-contrast` },
  };
}
