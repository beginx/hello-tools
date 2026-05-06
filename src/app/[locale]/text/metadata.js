const metaByLocale = {
  en: { title: 'Text Tools — Word Counter, Case Converter, Base64 — Free Online', desc: 'Free online text tools: count characters, words, sentences, paragraphs. Convert text case. Encode/decode Base64. All in your browser.' },
  es: { title: 'Herramientas de Texto — Contador, Convertir, Base64 — Gratis', desc: 'Herramientas de texto gratuitas: contar caracteres, palabras. Convertir may\u00fasculas/min\u00fasculas. Codificar/decodificar Base64.' },
  zh: { title: '\u6587\u672c\u5de5\u5177 \u2014 \u5b57\u7b26\u8ba1\u6570\u3001\u5927\u5c0f\u5199\u8f6c\u6362\u3001Base64 \u2014 \u514d\u8d39\u5728\u7ebf', desc: '\u514d\u8d39\u5728\u7ebf\u6587\u672c\u5de5\u5177\uff1a\u7edf\u8ba1\u5b57\u7b26\u3001\u5355\u8bcd\u3001\u53e5\u5b50\u3002\u8f6c\u6362\u5927\u5c0f\u5199\u3002Base64\u7f16\u7801/\u89e3\u7801\u3002' },
  ko: { title: '\ud14d\uc2a4\ud2b8 \ub3c4\uad6c \u2014 \uae00\uc790\uc218, \ub300\uc18c\ubb38\uc790, Base64 \u2014 \ubb34\ub8cc', desc: '\ubb34\ub8cc \uc628\ub77c\uc778 \ud14d\uc2a4\ud2b8 \ub3c4\uad6c: \uae00\uc790\uc218, \ub2e8\uc5b4\uc218, \ubb38\uc7a5\uc218 \uacc4\uc0b0. \ub300\uc18c\ubb38\uc790 \ubcc0\ud658. Base64 \uc778\ucf54\ub529/\ub514\ucf54\ub529.' },
  pt: { title: 'Ferramentas de Texto — Contador, Converter, Base64 — Gr\u00e1tis', desc: 'Ferramentas de texto gratuitas: contar caracteres, palavras. Converter mai\u00fasculas/min\u00fasculas. Codificar/decodificar Base64.' },
};

export default function generateMetadata({ params }) {
  const locale = params.locale || 'en';
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/text` },
  };
}