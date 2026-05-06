const metaByLocale = {
  en: { title: 'Photo Editor — Resize, Crop, Compress Images Online — Free Tool', desc: 'Free online photo editor: resize, crop, and compress images. Convert between JPEG, PNG, and WebP formats. Instant browser-based image editing. Mac OS 9 retro style.' },
  es: { title: 'Editor de Fotos — Redimensionar, Recortar, Comprimir Imágenes — Herramienta Gratuita', desc: 'Editor de fotos gratuito: redimensione, recorte y comprima imágenes. Convierta entre JPEG, PNG y WebP.' },
  zh: { title: '照片编辑器 — 在线调整大小、裁剪、压缩图片 — 免费工具', desc: '免费在线照片编辑器：调整大小、裁剪和压缩图像。在JPEG、PNG和WebP格式之间转换。' },
  ko: { title: '사진 편집기 — 이미지 리사이즈, 자르기, 압축 — 무료 온라인 도구', desc: '무료 온라인 사진 편집기: 이미지 리사이즈, 자르기, 압축. JPEG/PNG/WebP 포맷 변환까지 한 번에.' },
  pt: { title: 'Editor de Fotos — Redimensionar, Cortar, Comprimir Imagens — Ferramenta Gratuita', desc: 'Editor de fotos gratuito: redimensione, corte e comprima imagens. Converta entre JPEG, PNG e WebP.' },
};

export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/photo` },
  };
}