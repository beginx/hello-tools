export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Minesweeper - Classic Puzzle Game Online",
    'es': "Minesweeper - Classic Puzzle Game Online",
    'zh': "Minesweeper - Classic Puzzle Game Online",
    'ko': "Minesweeper - Classic Puzzle Game Online",
    'pt': "Minesweeper - Classic Puzzle Game Online",
  };
  const descs = {
    'en': "Free online Minesweeper game. Play the classic logic puzzle with three difficulty levels: Beginner (9×9), Intermediate (16×16), and Expert (30×16). Left click to reveal, right click to flag mines. No download required.",
    'es': "免费在线扫雷游戏。三种难度级别。",
    'zh': "Buscaminas gratis online. Juega al clásico con 3 niveles.",
    'ko': "무료 온라인 지뢰찾기 게임. 초급(9×9), 중급(16×16), 고급(30×16) 세 가지 난이도로 클래식 논리 퍼즐을 즐기세요. 클릭으로 열고 우클릭으로 깃발을 꽂으세요.",
    'pt': "Campo minado grátis online. Jogue o clássico com 3 níveis.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/minesweeper` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/minesweeper` },
  };
}
