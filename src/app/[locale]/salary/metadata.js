export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "Salary Calculator - Calculate Hourly, Weekly, Monthly Salary",
    ko: "급여 계산기 - 시급, 주급, 월급 계산",
  };
  const descs = {
    en: "Free online salary calculator. Convert between hourly, weekly, monthly, and annual salary.",
    ko: "무료 온라인 급여 계산기. 시급, 주급, 월급, 연봉을 변환하세요.",
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
      url: `https://oxoxox1.com/${locale}/salary`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/salary`,
    },
  };
}
