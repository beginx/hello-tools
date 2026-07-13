export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "What Is My IP? - Check Public IP Address",
    'es': "What Is My IP? - Check Public IP Address",
    'zh': "What Is My IP? - Check Public IP Address",
    'ko': "What Is My IP? - Check Public IP Address",
    'pt': "What Is My IP? - Check Public IP Address",
  };
  const descs = {
    'en': "Free online What Is My IP tool. Instantly check your public IPv4 and IPv6 address, ISP, and approximate location. No signup required, works instantly in your browser.",
    'es': "免费在线IP地址查询工具。即时查看您的公网IPv4/IPv6地址、运营商和大致位置。无需注册，浏览器即可使用。",
    'zh': "Free online What Is My IP tool. Instantly check your public IPv4 and IPv6 address, ISP, and approximate location. No signup required, works instantly in your browser.",
    'ko': "무료 내 IP 확인 도구. 공인 IPv4/IPv6 주소, 통신사, 대략적인 위치를 즉시 확인할 수 있습니다. 가입 불필요, 브라우저에서 바로 확인.",
    'pt': "Free online What Is My IP tool. Instantly check your public IPv4 and IPv6 address, ISP, and approximate location. No signup required, works instantly in your browser.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/whatismyip` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/whatismyip` },
  };
}
