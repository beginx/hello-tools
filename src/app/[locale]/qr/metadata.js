const metaByLocale = {
  en: { title: 'QR Code Generator — Free Online QR Code Maker', desc: 'Generate QR codes for free. Enter URL or text, customize size and error correction, download as PNG.' },
  es: { title: 'Generador de C\u00f3digos QR — Creador Gratuito', desc: 'Genera c\u00f3digos QR gratis. Ingresa URL o texto, personaliza tama\u00f1o y correcci\u00f3n de errores.' },
  zh: { title: 'QR\u7801\u751f\u6210\u5668 \u2014 \u514d\u8d39\u5728\u7ebfQR\u7801\u5236\u4f5c', desc: '\u514d\u8d39\u751f\u6210QR\u7801\u3002\u8f93\u5165URL\u6216\u6587\u672c\uff0c\u81ea\u5b9a\u4e49\u5927\u5c0f\u548c\u9519\u8bef\u7ea7\u522b\u3002' },
  ko: { title: 'QR \ucf54\ub4dc \uc0dd\uc131\uae30 \u2014 \ubb34\ub8cc \uc628\ub77c\uc778', desc: '\ubb34\ub8cc\ub85c QR \ucf54\ub4dc\ub97c \uc0dd\uc131\ud558\uc138\uc694. URL\uc774\ub098 \ud14d\uc2a4\ud2b8\ub97c \uc785\ub825\ud558\uace0 \ud06c\uae30\uc640 \uc624\ub958 \uc815\uc815 \ub808\ubca8\uc744 \uc124\uc815\ud558\uc138\uc694.' },
  pt: { title: 'Gerador de C\u00f3digo QR — Criador Gratuito Online', desc: 'Gere c\u00f3digos QR gratuitamente. Insira URL ou texto, personalize tamanho e corre\u00e7\u00e3o de erros.' },
};

export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/qr` },
  };
}