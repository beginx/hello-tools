const metaByLocale = {
  en: { title: 'Password Generator — Strong Random Password — Free Online Tool', desc: 'Generate strong, secure random passwords instantly in your browser. Customizable length, uppercase, lowercase, numbers, and symbols. Free Mac OS 9 retro style tool.' },
  es: { title: 'Generador de Contraseñas — Contraseña Segura Aleatoria — Herramienta Gratuita', desc: 'Genere contraseñas seguras y aleatorias al instante en su navegador. Longitud personalizable, mayúsculas, minúsculas, números y símbolos.' },
  zh: { title: '密码生成器 — 强随机密码 — 免费在线工具', desc: '在浏览器中即时生成强大安全的随机密码。可自定义长度、大写字母、小写字母、数字和符号。' },
  ko: { title: '비밀번호 생성기 — 강력한 랜덤 비밀번호 — 무료 온라인 도구', desc: '브라우저에서 즉시 강력하고 안전한 랜덤 비밀번호를 생성하세요. 길이, 대문자, 소문자, 숫자, 기호를 맞춤 설정할 수 있습니다.' },
  pt: { title: 'Gerador de Senhas — Senha Forte Aleatória — Ferramenta Gratuita', desc: 'Gere senhas seguras e aleatórias instantaneamente no seu navegador. Comprimento personalizável, maiúsculas, minúsculas, números e símbolos.' },
};

export default function generateMetadata({ params }) {
  const locale = params.locale || 'en';
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/password` },
  };
}