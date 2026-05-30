import re, os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')
PAGE_DIR = os.path.join(BASE, 'src', 'app', '[locale]')
SITEMAP = os.path.join(BASE, 'public', 'sitemap.xml')

actual_tools = sorted([item for item in os.listdir(PAGE_DIR) if os.path.isfile(os.path.join(PAGE_DIR, item, 'page.js'))])

print('='*60)
print('FINAL AUDIT: layout.js, page.js, sitemap.xml')
print('='*60)

# 1. Layout.js tools block
with open(LAYOUT, 'r', encoding='utf-8') as f:
    layout = f.read()

print(f'\n1. LAYOUT.JS TOOLS BLOCK')
print(f'   Total lines: {len(layout.splitlines())}')

for loc in ['en', 'es', 'zh', 'ko', 'pt']:
    marker = f'  {loc}: {{'
    next_markers = [f'  {nl}: {{' for nl in ['en', 'es', 'zh', 'ko', 'pt'] if nl != loc]
    
    start = layout.find(marker)
    if start < 0:
        print(f'   {loc}: NOT FOUND!')
        continue
    
    end = len(layout)
    for nm in next_markers:
        idx = layout.find(nm, start + len(marker))
        if idx >= 0 and idx < end:
            end = idx
    
    block = layout[start:end]
    tools_found = set(re.findall(r'^\s+(\w+):\s*\{', block, re.MULTILINE))
    missing = set(actual_tools) - tools_found
    extra = tools_found - set(actual_tools)
    
    status = 'OK' if not missing else 'MISSING'
    print(f'   {loc}: {len(tools_found)} tools {status}')
    if missing:
        print(f'      Missing: {sorted(missing)}')
    if extra:
        print(f'      Extra: {sorted(extra)}')

# 2. ToolMap
tm_match = re.search(r'const toolMap\s*=\s*\{([^}]+)\};', layout)
if tm_match:
    tm_entries = set()
    for m in re.finditer(r"'/(\w+)':\s*'(\w+)'", tm_match.group(1)):
        tm_entries.add(m.group(1))
    
    tm_missing = set(actual_tools) - tm_entries
    print(f'\n2. TOOLMAP ({len(tm_entries)} entries)')
    if not tm_missing:
        print(f'   TOOLMAP: OK (all {len(actual_tools)} tools mapped)')
    else:
        print(f'   TOOLMAP MISSING: {sorted(tm_missing)}')

# 3. Page.js unicode check
print(f'\n3. PAGE.JS UNICODE CHECK')
issues = 0
for tool in sorted(actual_tools):
    path = os.path.join(PAGE_DIR, tool, 'page.js')
    if not os.path.isfile(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for literal \\uXXXX in HTML context
    for m in re.finditer(r'\\u[0-9a-fA-F]{4}', content):
        pos = m.start()
        ctx = content[max(0,pos-30):pos+30]
        if 'option' in ctx or '<' in ctx or '>' in ctx:
            print(f'   [{tool}] literal \\uXXXX at pos {pos}: ...{repr(ctx[:20])}...')
            issues += 1
    
    # Check language select has actual unicode
    select_match = re.search(r'<select[^>]*value\s*=\s*\{locale\}[^>]*>', content, re.DOTALL)
    if select_match:
        ko_option = re.search(r'<option value="ko">(.*?)</option>', content)
        if ko_option:
            text = ko_option.group(1)
            if '\\u' in repr(text) and ('한국어' not in text and '\ud55c\uad6d\uc5b4' not in text):
                print(f'   [{tool}] KO option broken: {repr(text)}')
                issues += 1
    
print(f'   Unicode issues: {issues}')

# 4. Broken links in page.js
print(f'\n4. BROKEN LINKS CHECK')
broken = 0
for tool in sorted(actual_tools):
    path = os.path.join(PAGE_DIR, tool, 'page.js')
    if not os.path.isfile(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for m in re.finditer(r'href={\s*`/\$\{locale\}(\S+?)`\s*}', content):
        link = m.group(1).strip('/')
        if link not in actual_tools:
            print(f'   [{tool}] broken link: /{link}')
            broken += 1

print(f'   Broken links: {broken}')

# 5. Sitemap check
print(f'\n5. SITEMAP CHECK')
import xml.etree.ElementTree as ET
try:
    tree = ET.parse(SITEMAP)
    root = tree.getroot()
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = root.findall('.//s:url', ns)
    print(f'   Total URLs: {len(urls)}')
    
    # Check each tool has 5 locale URLs
    for tool in sorted(actual_tools):
        tool_urls = [u for u in urls if f'/{tool}' in (u.find('s:loc', ns).text if u.find('s:loc', ns) is not None else '')]
        locales_found = set()
        for u in tool_urls:
            loc_text = u.find('s:loc', ns).text if u.find('s:loc', ns) is not None else ''
            for lc in ['en', 'es', 'zh', 'ko', 'pt']:
                if f'/{lc}/{tool}' in loc_text:
                    locales_found.add(lc)
        if len(locales_found) < 5:
            missing_l = [l for l in ['en','es','zh','ko','pt'] if l not in locales_found]
            print(f'   [{tool}] missing locales: {missing_l}')

except Exception as e:
    print(f'   Sitemap parse error: {e}')

print('\n' + '='*60)
print('AUDIT COMPLETE')
print('='*60)