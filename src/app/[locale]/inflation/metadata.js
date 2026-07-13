export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Inflation Calculator - Calculate Inflation Rate",
    'es': "Inflation Calculator - Calculate Inflation Rate",
    'zh': "Inflation Calculator - Calculate Inflation Rate",
    'ko': "Inflation Calculator - Calculate Inflation Rate",
    'pt': "Inflation Calculator - Calculate Inflation Rate",
  };
  const descs = {
    'en': "Free online inflation tool.",
    'es': "Free online inflation tool.",
    'zh': "Free online inflation tool.",
    'ko': "Free online inflation tool.",
    'pt': "Free online inflation tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/inflation` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/inflation` },
  };
}
