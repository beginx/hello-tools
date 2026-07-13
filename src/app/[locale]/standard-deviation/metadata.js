export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Standard Deviation Calculator - Statistics",
    'es': "Standard Deviation Calculator - Statistics",
    'zh': "Standard Deviation Calculator - Statistics",
    'ko': "Standard Deviation Calculator - Statistics",
    'pt': "Standard Deviation Calculator - Statistics",
  };
  const descs = {
    'en': "Free online standard deviation tool.",
    'es': "Free online standard deviation tool.",
    'zh': "Free online standard deviation tool.",
    'ko': "Free online standard deviation tool.",
    'pt': "Free online standard deviation tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/standard-deviation` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/standard-deviation` },
  };
}
