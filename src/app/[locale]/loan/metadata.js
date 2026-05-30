export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "Loan Calculator - Calculate Monthly Payments",
    ko: "대출 계산기 - 월 상환액 계산",
  };
  const descs = {
    en: "Free online loan calculator. Calculate monthly payments, total interest, and total cost of loan.",
    ko: "무료 온라인 대출 계산기. 월 상환액, 총 이자, 총 대출 비용을 계산하세요.",
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
      url: `https://oxoxox1.com/${locale}/loan`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/loan`,
    },
  };
}
