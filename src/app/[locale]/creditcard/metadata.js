export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Credit Card Payoff Calculator - Debt Repayment",
    'es': "Credit Card Payoff Calculator - Debt Repayment",
    'zh': "Credit Card Payoff Calculator - Debt Repayment",
    'ko': "Credit Card Payoff Calculator - Debt Repayment",
    'pt': "Credit Card Payoff Calculator - Debt Repayment",
  };
  const descs = {
    'en': "Free online creditcard tool.",
    'es': "Free online creditcard tool.",
    'zh': "Free online creditcard tool.",
    'ko': "Free online creditcard tool.",
    'pt': "Free online creditcard tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/creditcard` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/creditcard` },
  };
}
