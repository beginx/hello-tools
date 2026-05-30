export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "Age Calculator - Calculate Your Age in Years, Months, Days",
    ko: "나이 계산기 - 나이 계산하기",
  };
  const descs = {
    en: "Free online age calculator. Calculate your exact age in years, months, days, hours, and seconds from your date of birth.",
    ko: "무료 온라인 나이 계산기. 생년월일로 정확한 나이를 계산하세요.",
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
      url: `https://oxoxox1.com/${locale}/age`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/age`,
    },
  };
}
