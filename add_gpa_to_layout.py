import os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT_PATH = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')

with open(LAYOUT_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add gpa to en block (before the closing }, of the en block)
content = content.replace(
    'cagr: { name: "CAGR Calculator - Compound Annual Growth Rate", desc: "Free online CAGR calculator: calculate Compound Annual Growth Rate for investments. Enter initial value, final value, and years to find your average annual return. Perfect for stocks, funds, and business growth analysis. Mac OS 9 retro style.", cat: "FinanceApplication" },\n  },',
    '''cagr: { name: "CAGR Calculator - Compound Annual Growth Rate", desc: "Free online CAGR calculator: calculate Compound Annual Growth Rate for investments. Enter initial value, final value, and years to find your average annual return. Perfect for stocks, funds, and business growth analysis. Mac OS 9 retro style.", cat: "FinanceApplication" },
    gpa: { name: "GPA Calculator - Grade Point Average", desc: "Free online GPA calculator: calculate your Grade Point Average on 4.0, 4.3, or 4.5 scale. Add courses with custom names, credits, and letter grades. Perfect for college and university students. Mac OS 9 retro style.", cat: "EducationApplication" },
  },'''
)

# 2. Add gpa to toolMap
content = content.replace(
    ",'/cagr': 'cagr' };",
    ",'/cagr': 'cagr', '/gpa': 'gpa' };"
)

with open(LAYOUT_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print('layout.js updated with GPA!')

# 3. Update sitemap.xml
SITEMAP_PATH = os.path.join(BASE, 'public', 'sitemap.xml')
with open(SITEMAP_PATH, 'r', encoding='utf-8') as f:
    sitemap = f.read()

# Insert before </urlset>
gpa_urls = '''  <!-- GPA Calculator -->
  <url><loc>https://oxoxox1.com/en/gpa</loc><lastmod>2026-05-16</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://oxoxox1.com/es/gpa</loc><lastmod>2026-05-16</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://oxoxox1.com/zh/gpa</loc><lastmod>2026-05-16</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://oxoxox1.com/ko/gpa</loc><lastmod>2026-05-16</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://oxoxox1.com/pt/gpa</loc><lastmod>2026-05-16</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
'''

sitemap = sitemap.replace('</urlset>', gpa_urls + '</urlset>')

with open(SITEMAP_PATH, 'w', encoding='utf-8') as f:
    f.write(sitemap)

print('sitemap.xml updated with GPA URLs!')

# Validate
import xml.etree.ElementTree as ET
try:
    tree = ET.parse(SITEMAP_PATH)
    root = tree.getroot()
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = root.findall('.//s:url', ns)
    print(f'Total URLs in sitemap: {len(urls)}')
except Exception as e:
    print(f'XML ERROR: {e}')