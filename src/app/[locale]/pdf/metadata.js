const metaByLocale = {
  en: { title: 'PDF Tools — Compress, Merge, Split, Convert — Free Online Tool', desc: 'Free online PDF tools: compress, merge, split PDFs, convert images to PDF, and convert PDF pages to images. All processing is done in your browser — nothing is uploaded to any server.' },
  es: { title: 'Herramientas PDF — Comprimir, Unir, Dividir, Convertir — Gratis', desc: 'Herramientas PDF gratuitas: comprimir, unir, dividir PDFs, convertir imágenes a PDF y páginas PDF a imágenes. Todo en su navegador.' },
  zh: { title: 'PDF工具 — 压缩、合并、拆分、转换 — 免费在线工具', desc: '免费在线PDF工具：压缩、合并、拆分PDF，图片转PDF，PDF转图片。所有处理在浏览器中完成。' },
  ko: { title: 'PDF 도구 — 압축, 병합, 분할, 변환 — 무료 온라인 도구', desc: '무료 온라인 PDF 도구: PDF 압축, 병합, 분할, 이미지를 PDF로, PDF를 이미지로 변환합니다. 모든 처리는 브라우저에서 이루어집니다.' },
  pt: { title: 'Ferramentas PDF — Comprimir, Unir, Dividir, Converter — Grátis', desc: 'Ferramentas PDF gratuitas: comprimir, unir, dividir PDFs, converter imagens em PDF e páginas PDF em imagens. Tudo no seu navegador.' },
};

export default function generateMetadata({ params }) {
  const locale = params.locale || 'en';
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/pdf` },
  };
}