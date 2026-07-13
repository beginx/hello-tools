export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Chinese Zodiac Calculator - Find Your Sign",
    'es': "Chinese Zodiac Calculator - Find Your Sign",
    'zh': "Chinese Zodiac Calculator - Find Your Sign",
    'ko': "Chinese Zodiac Calculator - Find Your Sign",
    'pt': "Chinese Zodiac Calculator - Find Your Sign",
  };
  const descs = {
    'en': "Free Chinese Zodiac calculator. Find your zodiac animal by birth year. Discover the 12 Chinese zodiac signs: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig.",
    'es': "免费生肖计算器，根据出生年份查询您的生肖属相。",
    'zh': "Calculadora gratuita del zodiaco chino.",
    'ko': "무료 띠 계산기. 태어난 해로 당신의 띠를 찾아보세요. 쥐, 소, 호랑이, 토끼, 용, 뱀, 말, 양, 원숭이, 닭, 개, 돼지 12가지 띠를 확인할 수 있습니다.",
    'pt': "Calculadora gratuita do zodíaco chinês.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/zodiac` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/zodiac` },
  };
}
