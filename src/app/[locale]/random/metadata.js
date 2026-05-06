const metaByLocale = {
  en: { title: 'Random Number Generator — Free Online Tool', desc: 'Free online random number generator. Generate cryptographically secure random numbers within any range. Choose count, unique mode, and sorting.' },
  es: { title: 'Generador de N\u00fameros Aleatorios — Gratis Online', desc: 'Generador de n\u00fameros aleatorios gratuito. Genere n\u00fameros aleatorios criptogr\u00e1ficamente seguros.' },
  zh: { title: '\u968f\u673a\u6570\u751f\u6210\u5668 \u2014 \u514d\u8d39\u5728\u7ebf\u5de5\u5177', desc: '\u514d\u8d39\u5728\u7ebf\u968f\u673a\u6570\u751f\u6210\u5668\u3002\u5728\u4efb\u610f\u8303\u56f4\u5185\u751f\u6210\u5bc6\u7801\u5b66\u5b89\u5168\u7684\u968f\u673a\u6570\u3002' },
  ko: { title: '\ub79c\ub364 \uc22b\uc790 \uc0dd\uc131\uae30 \u2014 \ubb34\ub8cc \uc628\ub77c\uc778', desc: '\ubb34\ub8cc \ub79c\ub364 \uc22b\uc790 \uc0dd\uc131\uae30. \uc784\uc758\uc758 \ubc94\uc704\uc5d0\uc11c \uc554\ud638\ud559\uc801\uc73c\ub85c \uc548\uc804\ud55c \ub79c\ub364 \uc22b\uc790\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4.' },
  pt: { title: 'Gerador de N\u00fameros Aleat\u00f3rios — Gr\u00e1tis Online', desc: 'Gerador de n\u00fameros aleat\u00f3rios gratuito. Gere n\u00fameros aleat\u00f3rios criptograficamente seguros.' },
};

export default function generateMetadata({ params }) {
  const locale = params.locale || 'en';
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/random` },
  };
}