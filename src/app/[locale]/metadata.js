const msgs = {
  en: { title: 'Calorie Calculator | BMR, TDEE & Macros - Free Online Tool', desc: 'Calculate your daily calorie needs: BMR, TDEE, BMI, and macronutrients (protein, carbs, fat) for weight loss, maintenance or muscle gain.' },
  es: { title: 'Calculadora de Calor\u00edas | BMR, TDEE y Macros - Herramienta Gratuita', desc: 'Calcula tus necesidades cal\u00f3ricas diarias: BMR, TDEE, IMC y macronutrientes.' },
  zh: { title: '\u5361\u8def\u91cc\u8ba1\u7b97\u5668 | \u57fa\u7840\u4ee3\u8c22\u7387\u3001\u6d3b\u52a8\u4ee3\u8c22\u7387\u548c\u5b8f\u517b\u6210\u5206 - \u514d\u8d39\u5728\u7ebf\u5de5\u5177', desc: '\u8ba1\u7b97\u60a8\u7684\u6bcf\u65e5\u5361\u8def\u91cc\u9700\u6c42\uff1aBMR\u3001TDEE\u3001BMI\u548c\u5b8f\u517b\u6210\u5206\u3002' },
  ko: { title: '\uce7c\ub85c\ub9ac \uacc4\uc0b0\uae30 | BMR, TDEE \ubc0f \uc601\uc591\uc18c - \ubb34\ub8cc \uc628\ub77c\uc778 \ud234', desc: '\ud558\ub8e8 \ud544\uc694 \uce7c\ub85c\ub9ac\ub97c \uacc4\uc0b0\ud558\uc138\uc694: BMR, TDEE, BMI, \uc601\uc591\uc18c\uae4c\uc9c0 \ud55c\ubc88\uc5d0.' },
  pt: { title: 'Calculadora de Calorias | BMR, TDEE e Macros - Ferramenta Gratuita', desc: 'Calcule suas necessidades cal\u00f3ricas di\u00e1rias: BMR, TDEE, IMC e macronutrientes.' },
};

export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const m = msgs[locale] || msgs.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}` },
  };
}