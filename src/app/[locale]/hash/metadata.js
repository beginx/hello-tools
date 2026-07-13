export default async function generateMetadata({ params }) {
  const { locale } = await params;
  const titles = {
    'en': "Hash Generator - MD5, SHA-256, SHA-512",
    'es': "Hash Generator - MD5, SHA-256, SHA-512",
    'zh': "Hash Generator - MD5, SHA-256, SHA-512",
    'ko': "Hash Generator - MD5, SHA-256, SHA-512",
    'pt': "Hash Generator - MD5, SHA-256, SHA-512",
  };
  const descs = {
    'en': "Free online hash generator. Generate MD5, SHA-256, and SHA-512 hashes instantly from any text input. Secure client-side hashing using Web Crypto API. Perfect for developers, file integrity checks, and password hashing.",
    'es': "免费在线哈希生成器。即时生成 MD5、SHA-256、SHA-512 哈希值。使用 Web Crypto API 安全客户端哈希。适合开发者、文件完整性校验和密码哈希。",
    'zh': "Generador de hash gratuito en línea. Genere hashes MD5, SHA-256 y SHA-512 al instante. Hashing seguro del lado del cliente con Web Crypto API.",
    'ko': "무료 온라인 해시 생성기. MD5, SHA-256, SHA-512 해시를 텍스트로부터 즉시 생성합니다. Web Crypto API를 사용한 안전한 클라이언트 측 해싱. 개발자, 파일 무결성 검사, 비밀번호 해싱에 적합합니다.",
    'pt': "Gerador de hash online gratuito. Gere hashes MD5, SHA-256 e SHA-512 instantaneamente. Hashing seguro no lado do cliente com Web Crypto API.",
  };
  const title = titles[locale] || titles.en;
  const description = descs[locale] || descs.en;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', url: `https://oxoxox1.com/${locale}/hash` },
    alternates: { canonical: `https://oxoxox1.com/${locale}/hash` },
  };
}
