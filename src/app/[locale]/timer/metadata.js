export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    en: 'Stopwatch & Timer - Free Online Stopwatch and Countdown Timer',
    es: 'Cronómetro y Temporizador - Cronómetro Online Gratuito',
    zh: '秒表和计时器 - 免费在线秒表和倒计时',
    ko: '스톱워치 & 타이머 - 무료 온라인 스톱워치',
    pt: 'Cronômetro e Temporizador - Cronômetro Online Grátis'
  };
  const descs = {
    en: 'Free online stopwatch and countdown timer. Measure elapsed time with lap recording, or set a countdown timer. Works offline in your browser. Mac OS 9 retro style.',
    es: 'Cronómetro online gratuito y temporizador de cuenta atrás. Mida el tiempo transcurrido con registro de vueltas.',
    zh: '免费的在线秒表和倒计时器。测量经过时间并记录计次，或设置倒计时。',
    ko: '무료 온라인 스톱워치 및 카운트다운 타이머. 랩 기록과 함께 경과 시간 측정, 또는 카운트다운 타이머 설정.',
    pt: 'Cronômetro online gratuito e temporizador de contagem regressiva. Meça o tempo decorrido com registro de voltas.'
  };
  return {
    title: titles[locale] || titles.en,
    description: descs[locale] || descs.en,
  };
}