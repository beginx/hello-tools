export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "Investment Calculator - Calculate Investment Returns",
    ko: "투자 계산기 - 투자 수익 계산",
  };
  const descs = {
    en: "Free online investment calculator. Calculate your investment returns and future value.",
    ko: "무료 온라인 투자 계산기. 투자 수익과 미래 가치를 계산하세요.",
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
      url: `https://oxoxox1.com/${locale}/investment`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/investment`,
    },
  };
}
