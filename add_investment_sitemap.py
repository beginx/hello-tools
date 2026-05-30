import os, xml.etree.ElementTree as ET

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
SITEMAP_PATH = os.path.join(BASE, 'public', 'sitemap.xml')

with open(SITEMAP_PATH, 'r', encoding='utf-8') as f:
    sitemap = f.read()

investment_urls = '''  <!-- Investment Calculator -->
  <url><loc>https://oxoxox1.com/en/investment</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://oxoxox1.com/es/investment</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://oxoxox1.com/zh/investment</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://oxoxox1.com/ko/investment</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://oxoxox1.com/pt/investment</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
'''

sitemap = sitemap.replace('</urlset>', investment_urls + '</urlset>')

with open(SITEMAP_PATH, 'w', encoding='utf-8') as f:
    f.write(sitemap)

tree = ET.parse(SITEMAP_PATH)
root = tree.getroot()
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = root.findall('.//s:url', ns)
print(f'sitemap.xml updated! Total URLs: {len(urls)}')