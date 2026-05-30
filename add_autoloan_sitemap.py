import os, xml.etree.ElementTree as ET

BASE = r'C:\Users\1one\Documents\dev\hello-tools'

SITEMAP_PATH = os.path.join(BASE, 'public', 'sitemap.xml')
with open(SITEMAP_PATH, 'r', encoding='utf-8') as f:
    sitemap = f.read()

autoloan_urls = '''  <!-- Auto Loan Calculator -->
  <url><loc>https://oxoxox1.com/en/autoloan</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://oxoxox1.com/es/autoloan</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://oxoxox1.com/zh/autoloan</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://oxoxox1.com/ko/autoloan</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://oxoxox1.com/pt/autoloan</loc><lastmod>2026-05-17</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
'''

# Insert before </urlset>
sitemap = sitemap.replace('</urlset>', autoloan_urls + '</urlset>')

with open(SITEMAP_PATH, 'w', encoding='utf-8') as f:
    f.write(sitemap)

print('sitemap.xml updated with autoloan URLs!')

# Validate XML
tree = ET.parse(SITEMAP_PATH)
root = tree.getroot()
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = root.findall('.//s:url', ns)
print(f'Total URLs in sitemap: {len(urls)}')