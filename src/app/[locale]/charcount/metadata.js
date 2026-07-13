export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Character Counter - Count Letters, Words & Lines",
    'es': "Character Counter - Count Letters, Words & Lines",
    'zh': "Character Counter - Count Letters, Words & Lines",
    'ko': "Character Counter - Count Letters, Words & Lines",
    'pt': "Character Counter - Count Letters, Words & Lines",
  };
  const descs = {
    'en': "Free online character counter. Count characters, words, lines, sentences, and spaces instantly. Perfect for social media posts, essays, and SEO meta descriptions.",
    'es': "免费在线字符计数器。",
    'zh': "Contador de caracteres gratuito en línea.",
    'ko': "무료 온라인 글자 수 세기. 글자, 단어, 줄, 문장, 공백을 실시간으로 카운트하세요. SNS 게시물, 에세이, SEO 메타 설명에 완벽합니다.",
    'pt': "Contador de caracteres online gratuito.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/charcount` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/charcount` },
  };
}
