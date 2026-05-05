import "../../app/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const schemaByLocale = {
  en: {
    name: "Calorie Calculator - BMR, TDEE & Macros",
    description: "Free online calorie calculator: calculate BMR, TDEE, BMI, and macronutrients (protein, carbs, fat) for weight loss, maintenance or muscle gain. Mac OS 9 retro style.",
    applicationCategory: "HealthApplication, Nutrition",
  },
  es: {
    name: "Calculadora de Calor\u00edas - BMR, TDEE y Macros",
    description: "Calculadora de calor\u00edas gratuita: calcula BMR, TDEE, IMC y macronutrientes.",
    applicationCategory: "HealthApplication, Nutrition",
  },
  zh: {
    name: "\u5361\u8def\u91cc\u8ba1\u7b97\u5668 - BMR\u3001TDEE\u548c\u5b8f\u517b\u6210\u5206",
    description: "\u514d\u8d39\u5728\u7ebf\u5361\u8def\u91cc\u8ba1\u7b97\u5668\uff1a\u8ba1\u7b97BMR\u3001TDEE\u3001BMI\u548c\u5b8f\u517b\u6210\u5206\u3002",
    applicationCategory: "HealthApplication, Nutrition",
  },
  ko: {
    name: "\uce7c\ub85c\ub9ac \uacc4\uc0b0\uae30 - BMR, TDEE & \uc601\uc591\uc18c",
    description: "\ubb34\ub8cc \uc628\ub77c\uc778 \uce7c\ub85c\ub9ac \uacc4\uc0b0\uae30: BMR, TDEE, BMI, \uc601\uc591\uc18c\ub97c \uacc4\uc0b0\ud569\ub2c8\ub2e4.",
    applicationCategory: "HealthApplication, Nutrition",
  },
  pt: {
    name: "Calculadora de Calorias - BMR, TDEE e Macros",
    description: "Calculadora de calorias gratuita: calcule BMR, TDEE, IMC e macronutrientes.",
    applicationCategory: "HealthApplication, Nutrition",
  },
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  const s = schemaByLocale[locale] || schemaByLocale.en;

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: s.name,
    description: s.description,
    applicationCategory: s.applicationCategory,
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "hello-tools",
      url: "https://oxoxox1.com",
    },
  });

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8178172082493004`}
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson }}
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: 'var(--os9-bg)' }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <script dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`
        }} />
      </body>
    </html>
  );
}