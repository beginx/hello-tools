export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: "EMI Calculator - Loan EMI Calculator",
    ko: "EMI 계산기 - 대출 EMI 계산",
  };
  const descs = {
    en: "Free online EMI calculator. Calculate your loan EMI, total interest, and total payment.",
    ko: "무료 온라인 EMI 계산기. 대출 EMI, 총 이자, 총 상환액을 계산하세요.",
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
      url: `https://oxoxox1.com/${locale}/emi`,
    },
    alternates: {
      canonical: `https://oxoxox1.com/${locale}/emi`,
    },
  };
}
