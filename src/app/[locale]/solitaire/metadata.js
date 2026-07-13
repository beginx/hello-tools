export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Solitaire - Klondike Card Game Online",
    'es': "Solitaire - Klondike Card Game Online",
    'zh': "Solitaire - Klondike Card Game Online",
    'ko': "Solitaire - Klondike Card Game Online",
    'pt': "Solitaire - Klondike Card Game Online",
  };
  const descs = {
    'en': "Free online Solitaire (Klondike) card game. Play the classic patience card game with no download. Draw 3 cards, drag or click to move, auto-complete foundations. Perfect for casual gaming and brain training.",
    'es': "免费在线纸牌接龙。经典克朗代克无需下载。",
    'zh': "Solitario Klondike gratis online. Juega al clásico sin descargar.",
    'ko': "무료 온라인 솔리테르(클론다이크) 카드 게임. 클래식 인내심 카드 게임을 다운로드 없이 즐기세요. 3장씩 뽑고 클릭으로 이동, 기초 쌓기 자동 완성. 캐주얼 게임과 두뇌 훈련에 완벽합니다.",
    'pt': "Paciência Klondike grátis online. Jogue o clássico sem baixar.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/solitaire` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/solitaire` },
  };
}
