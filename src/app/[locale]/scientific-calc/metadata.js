export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Scientific Calculator - Trig, Log, Powers",
    'es': "Scientific Calculator - Trig, Log, Powers",
    'zh': "Scientific Calculator - Trig, Log, Powers",
    'ko': "Scientific Calculator - Trig, Log, Powers",
    'pt': "Scientific Calculator - Trig, Log, Powers",
  };
  const descs = {
    'en': "Free online scientific calculator with trigonometric functions (sin, cos, tan), logarithms (log, ln), square root, powers, factorial, pi, and exponent. Perfect for students, engineers, and scientists.",
    'es': "免费在线科学计算器，支持三角函数、对数、平方根、幂、阶乘、π和e。",
    'zh': "Calculadora científica gratuita con funciones trigonométricas, logaritmos, raíz cuadrada, potencias, factorial, pi y e.",
    'ko': "무료 온라인 공학용 계산기. 삼각함수(sin, cos, tan), 로그(log, ln), 제곱근, 거듭제곱, 팩토리얼, 원주율, 자연상수를 지원합니다. 학생, 엔지니어, 과학자에게 적합합니다.",
    'pt': "Calculadora científica gratuita com funções trigonométricas, logaritmos, raiz quadrada, potências, fatorial, pi e e.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/scientific-calc` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/scientific-calc` },
  };
}
