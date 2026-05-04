import "./globals.css";

export const metadata = {
  title: "🍎 칼로리 계산기 | Hello Tools — 무료 BMR/TDEE/영양소 계산",
  description: "기초대사량(BMR), 활동대사량(TDEE), 목표별 칼로리와 영양소(탄단지)를 한번에 계산하는 무료 칼로리 계산기입니다. Mac OS 9 스타일의 레트로 디자인.",
  keywords: "칼로리 계산기, BMR 계산, TDEE 계산, 기초대사량, 영양소 계산, 다이어트, 벌크업, 탄단지",
  openGraph: {
    title: "🍎 칼로리 계산기 | Hello Tools",
    description: "BMR/TDEE/영양소를 한번에 계산하는 무료 도구",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: 'var(--os9-bg)' }}>
        {children}
        {/* AdSense 초기화 */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({});
          `
        }} />
      </body>
    </html>
  );
}