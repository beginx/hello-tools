const locales = ['en', 'es', 'zh', 'ko', 'pt'];

const baseUrl = 'https://oxoxox1.com';

export async function GET() {
  const urls = locales.map((locale) => {
    const priority = locale === 'en' ? '1.0' : '0.8';
    return `
  <url>
    <loc>${baseUrl}/${locale}</loc>
    <lastmod>2026-05-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}