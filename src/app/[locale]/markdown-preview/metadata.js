export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Markdown Preview - Markdown Editor & Preview",
    'es': "Markdown Preview - Markdown Editor & Preview",
    'zh': "Markdown Preview - Markdown Editor & Preview",
    'ko': "Markdown Preview - Markdown Editor & Preview",
    'pt': "Markdown Preview - Markdown Editor & Preview",
  };
  const descs = {
    'en': "Free online Markdown previewer. Write Markdown and see the live HTML preview instantly. Supports headings, bold, italic, links, images, tables, code blocks, and more. Perfect for README files, documentation, and note-taking.",
    'es': "免费在线Markdown预览器。实时查看HTML预览。",
    'zh': "Vista previa gratuita de Markdown en línea. Escriba Markdown y vea HTML en vivo.",
    'ko': "무료 온라인 마크다운 미리보기. 마크다운을 작성하면 실시간 HTML 미리보기를 확인할 수 있습니다. 제목, 굵게, 기울임, 링크, 이미지, 표, 코드 블록 등을 지원합니다.",
    'pt': "Visualizador Markdown online gratuito. Veja HTML ao vivo.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/markdown-preview` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/markdown-preview` },
  };
}
