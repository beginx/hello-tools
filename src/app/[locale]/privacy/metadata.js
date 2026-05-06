const metaByLocale = {
  en: { title: 'Privacy Policy — hello-tools', desc: 'Privacy Policy for hello-tools (oxoxox1.com). Learn how we collect, use, and protect your data.' },
  es: { title: 'Política de Privacidad — hello-tools', desc: 'Política de Privacidad de hello-tools (oxoxox1.com). Conozca cómo recopilamos, usamos y protegemos sus datos.' },
  zh: { title: '隐私政策 — hello-tools', desc: 'hello-tools（oxoxox1.com）的隐私政策。了解我们如何收集、使用和保护您的数据。' },
  ko: { title: '개인정보처리방침 — hello-tools', desc: 'hello-tools(oxoxox1.com)의 개인정보처리방침입니다. 당사가 귀하의 데이터를 어떻게 수집, 이용, 보호하는지 확인하세요.' },
  pt: { title: 'Política de Privacidade — hello-tools', desc: 'Política de Privacidade do hello-tools (oxoxox1.com). Saiba como coletamos, usamos e protegemos seus dados.' },
};

export default function generateMetadata({ params }) {
  const locale = params.locale || 'en';
  const m = metaByLocale[locale] || metaByLocale.en;
  return {
    title: m.title,
    description: m.desc,
    openGraph: { title: m.title, description: m.desc, type: 'website' },
    alternates: { canonical: `https://oxoxox1.com/${locale}/privacy` },
  };
}