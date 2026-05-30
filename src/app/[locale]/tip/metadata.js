export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "Tip Calculator - Calculate Restaurant Tips",
    ko: "팁 계산기 - 레스토랑 팁 계산",
  };
  const descs = {
    en: "Free online tip calculator. Calculate tips for restaurants and split the bill.",
    ko: "무료 온라인 팁 계산기. 레스토랑 팁을 계산하고 계산서를 분할하세요.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://oxoxox1.com/${locale}/tip`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/tip`,
    },
  };
}
