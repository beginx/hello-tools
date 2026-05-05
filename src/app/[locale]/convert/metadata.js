const metaByLocale = {
  en: { title: 'Unit Converter | Length, Weight, Temperature — Free Online Tool', desc: 'Free online unit converter: convert length (cm to inches, meters to feet), weight (kg to lbs), temperature (C to F), volume, area, speed, pressure. Mac OS 9 retro style.' },
  es: { title: 'Conversor de Unidades | Longitud, Peso, Temperatura — Herramienta Gratuita', desc: 'Conversor de unidades gratuito: longitud, peso, temperatura, volumen, \u00e1rea, velocidad, presi\u00f3n.' },
  zh: { title: '\u5355\u4f4d\u6362\u7b97\u5668 | \u957f\u5ea6\u3001\u91cd\u91cf\u3001\u6e29\u5ea6 \u2014 \u514d\u8d39\u5728\u7ebf\u5de5\u5177', desc: '\u514d\u8d39\u5355\u4f4d\u6362\u7b97\u5668\uff1a\u957f\u5ea6\u3001\u91cd\u91cf\u3001\u6e29\u5ea6\u3001\u4f53\u79ef\u3001\u9762\u79ef\u3001\u901f\u5ea6\u3001\u538b\u529b\u3002' },
  ko: { title: '\ub2e8\uc704 \ubcc0\ud658\uae30 | \uae38\uc774\u00b7\ubb34\uac8c\u00b7\uc628\ub3c4 \u2014 \ubb34\ub8cc \uc628\ub77c\uc778 \ud234', desc: '\ubb34\ub8cc \ub2e8\uc704 \ubcc0\ud658\uae30: \uae38\uc774(cm\u2192\uc778\uce58), \ubb34\uac8c(kg\u2192\ud30c\uc6b4\ub4dc), \uc628\ub3c4(\uc12d\uc528\u2192\ud654\uc528), \ubd80\ud53c, \uba74\uc801, \uc18d\ub3c4, \uc555\ub825\uae4c\uc9c0.' },
  pt: { title: 'Conversor de Unidades | Comprimento, Peso, Temperatura — Ferramenta Gratuita', desc: 'Conversor de unidades gratuito: comprimento, peso, temperatura, volume, \u00e1rea, velocidade, press\u00e3o.' },
};

export default function generateMetadata({ params }) {
  const locale = params.locale || 'en';
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/convert` },
  };
}