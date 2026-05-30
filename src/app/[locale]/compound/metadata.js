export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "Compound Interest Calculator - Calculate Investment Returns",
    ko: "복리 계산기 - 투자 수익 계산",
  };
  const descs = {
    en: "Free online compound interest calculator. Calculate your investment returns with compound interest.",
    ko: "무료 온라인 복리 계산기. 복리로 투자 수익을 계산하세요.",
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
      url: `https://oxoxox1.com/${locale}/compound`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/compound`,
    },
  };
}
