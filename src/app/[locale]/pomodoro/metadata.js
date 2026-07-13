export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Pomodoro Timer - Focus & Break Timer",
    'es': "Pomodoro Timer - Focus & Break Timer",
    'zh': "Pomodoro Timer - Focus & Break Timer",
    'ko': "Pomodoro Timer - Focus & Break Timer",
    'pt': "Pomodoro Timer - Focus & Break Timer",
  };
  const descs = {
    'en': "Free online Pomodoro timer. Boost productivity with 25-minute focus sessions and 5-minute breaks. Customizable work/break intervals. Perfect for studying, work, and deep focus.",
    'es': "免费在线番茄钟计时器。25分钟专注+5分钟休息，提升工作效率。",
    'zh': "Temporizador Pomodoro gratuito. Aumente su productividad.",
    'ko': "무료 온라인 뽀모도로 타이머. 25분 집중 + 5분 휴식으로 생산성을 높이세요. 공부, 업무, 딥포커스에 완벽한 시간 관리 도구입니다.",
    'pt': "Temporizador Pomodoro gratuito online.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/pomodoro` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/pomodoro` },
  };
}
