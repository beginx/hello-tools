export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "Discount Calculator - Calculate Sale Price",
    ko: "할인 계산기 - 할인가 계산",
  };
  const descs = {
    en: "Free online discount calculator. Calculate the sale price after discount.",
    ko: "무료 온라인 할인 계산기. 할인后的 판매가를 계산하세요.",
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
      url: `https://oxoxox1.com/${locale}/discount`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/discount`,
    },
  };
}
