export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "Average Calculator - Calculate Mean, Median, Mode",
    ko: "평균 계산기 - 평균, 중앙값, 최빈값 계산",
  };
  const descs = {
    en: "Free online average calculator. Calculate mean, median, mode, and range for any set of numbers.",
    ko: "무료 온라인 평균 계산기. 숫자 세트의 평균, 중앙값, 최빈값을 계산하세요.",
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
      url: `https://oxoxox1.com/${locale}/average`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/average`,
    },
  };
}
