export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Cooking Measurement Converter - Recipe Converter",
    'es': "Cooking Measurement Converter - Recipe Converter",
    'zh': "Cooking Measurement Converter - Recipe Converter",
    'ko': "Cooking Measurement Converter - Recipe Converter",
    'pt': "Cooking Measurement Converter - Recipe Converter",
  };
  const descs = {
    'en': "Free online cooking measurement converter. Convert cups to ml, tbsp to tsp, ounces to grams, Fahrenheit to Celsius, and more. Perfect for recipes, baking, and international cooking. All conversions in your browser.",
    'es': "免费烹饪单位转换器。杯转毫升，汤匙，盎司转克等。",
    'zh': "Conversor de cocina gratuito. Convierta tazas a ml, cucharadas, onzas a gramos, y más.",
    'ko': "무료 요리 계량 변환기. 컵↔ml, 큰술↔작은술, 온스↔그램, 화씨↔섭씨 등 레시피 단위를 즉시 변환하세요.",
    'pt': "Conversor de cozinha gratuito. Converta xícaras para ml, colheres, onças para gramas.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/cooking` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/cooking` },
  };
}
