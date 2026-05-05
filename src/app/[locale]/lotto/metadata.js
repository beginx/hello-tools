const metaByLocale = {
  en: { title: 'Lottery Number Generator — Powerball, Mega Millions — Free Online Tool', desc: 'Generate random lottery numbers for Powerball, Mega Millions, EuroMillions, and UK Lotto. Cryptographically secure random number generator. Free Mac OS 9 retro style tool.' },
  es: { title: 'Generador de Números de Lotería — Powerball, Mega Millions — Herramienta Gratuita', desc: 'Genere números de lotería aleatorios para Powerball, Mega Millions, EuroMillions y UK Lotto. Generador criptográficamente seguro.' },
  zh: { title: '彩票号码生成器 — Powerball, Mega Millions — 免费在线工具', desc: '为Powerball、Mega Millions、EuroMillions和UK Lotto生成随机彩票号码。密码学安全随机数生成器。' },
  ko: { title: '로또 번호 생성기 — 파워볼, 메가밀리언즈 — 무료 온라인 도구', desc: '파워볼, 메가밀리언즈, 유로밀리언즈, UK 로또 번호를 생성하세요. 암호학적으로 안전한 난수 생성기입니다.' },
  pt: { title: 'Gerador de Números da Loteria — Powerball, Mega Millions — Ferramenta Gratuita', desc: 'Gere números de loteria aleatórios para Powerball, Mega Millions, EuroMillions e UK Lotto. Gerador criptograficamente seguro.' },
};

export default function generateMetadata({ params }) {
  const locale = params.locale || 'en';
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/lotto` },
  };
}