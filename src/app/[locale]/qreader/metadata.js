export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "QR Code Reader - Scan QR Codes Online",
    'es': "QR Code Reader - Scan QR Codes Online",
    'zh': "QR Code Reader - Scan QR Codes Online",
    'ko': "QR Code Reader - Scan QR Codes Online",
    'pt': "QR Code Reader - Scan QR Codes Online",
  };
  const descs = {
    'en': "Free online qreader tool.",
    'es': "Free online qreader tool.",
    'zh': "Free online qreader tool.",
    'ko': "Free online qreader tool.",
    'pt': "Free online qreader tool.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/qreader` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/qreader` },
  };
}
