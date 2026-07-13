export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Text Diff Checker - Compare Text Online",
    'es': "Text Diff Checker - Compare Text Online",
    'zh': "Text Diff Checker - Compare Text Online",
    'ko': "Text Diff Checker - Compare Text Online",
    'pt': "Text Diff Checker - Compare Text Online",
  };
  const descs = {
    'en': "Free online text diff checker and comparison tool. Compare two texts and see differences instantly with color-coded additions, deletions, and unchanged lines. Perfect for comparing code, documents, and prose. Privacy-first: all processing happens in your browser.",
    'es': "免费在线文本对比工具。即时比较两段文本的差异。",
    'zh': "Comparador de textos gratuito. Compare dos textos y vea diferencias al instante.",
    'ko': "무료 온라인 텍스트 비교 도구. 두 텍스트의 차이점을 색상으로 즉시 확인하세요. 코드, 문서, 글 비교에 완벽합니다. 모든 처리는 브라우저에서 이루어집니다.",
    'pt': "Comparador de textos gratuito. Compare dois textos e veja diferenças.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/diff` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/diff` },
  };
}
