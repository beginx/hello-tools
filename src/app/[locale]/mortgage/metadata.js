export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "Mortgage Calculator - Calculate Mortgage Payments",
    ko: "주택담보대출 계산기 - 월 상환액 계산",
  };
  const descs = {
    en: "Free online mortgage calculator. Calculate monthly mortgage payments and total interest.",
    ko: "무료 온라인 주택담보대출 계산기. 월 상환액과 총 이자를 계산하세요.",
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
      url: `https://oxoxox1.com/${locale}/mortgage`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/mortgage`,
    },
  };
}
