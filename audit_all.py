import os, re

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
pageDir = os.path.join(BASE, 'src', 'app', '[locale]')
layoutPath = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')

# Get all actual tool pages (directories with page.js)
actual_tools = set()
for item in os.listdir(pageDir):
    if os.path.isfile(os.path.join(pageDir, item, 'page.js')):
        actual_tools.add(item)

print(f'Actual page.js directories: {len(actual_tools)}')
print(f'  Tools: {sorted(actual_tools)}')
print()

# Read layout.js
with open(layoutPath, 'r', encoding='utf-8') as f:
    layout_content = f.read()

# 1. Extract toolMap
toolmap_match = re.search(r'const toolMap\s*=\s*\{([^}]+)\};', layout_content)
toolmap_tools = set()
if toolmap_match:
    for entry in re.finditer(r"'/([^']+)':\s*'([^']+)'", toolmap_match.group(1)):
        toolmap_tools.add(entry.group(2))
    print(f'toolMap entries: {len(toolmap_tools)}')
    print(f'  Mapped: {sorted(toolmap_tools)}')
else:
    print('ERROR: toolMap not found!')
print()

# 2. Extract tools per locale
locale_blocks = {}
for m in re.finditer(r'(\w+):\s*\{', layout_content[:200]):
    first_locale = m.group(1)
    break

# Parse locale blocks
current_locale = None
current_start = 0
for m in re.finditer(r'(\w+):\s*\{', layout_content):
    if current_locale:
        locale_blocks[current_locale] = (current_start, m.start())
    current_locale = m.group(1)
    current_start = m.start()
# Last block ends at toolMap
last_end = layout_content.find('function getToolKey')
if last_end < 0:
    last_end = layout_content.find('const toolMap')
if current_locale:
    locale_blocks[current_locale] = (current_start, last_end)

print(f'Locale blocks found: {list(locale_blocks.keys())}')
print()

# Check each locale block for tool coverage
all_locale_tools = {}
for loc, (start, end) in locale_blocks.items():
    block = layout_content[start:end]
    tools_in_block = set()
    for m in re.finditer(r'^\s+(\w+):\s*\{', block, re.MULTILINE):
        tools_in_block.add(m.group(1))
    all_locale_tools[loc] = tools_in_block
    
    missing = actual_tools - tools_in_block
    
    # Expected common tools that aren't in layout block
    expected_missing = {'calorie'}  # calorie is default, might be named differently
    
    actual_missing = missing
    if actual_missing:
        print(f'[{loc}] Missing tools ({len(actual_missing)}): {sorted(actual_missing)}')

print()

# 3. Check toolMap vs actual
map_missing = actual_tools - toolmap_tools
map_extra = toolmap_tools - actual_tools
if map_missing:
    print(f'toolMap MISSING ({len(map_missing)}): {sorted(map_missing)}')
if map_extra:
    print(f'toolMap EXTRA (have mapping but no page.js) ({len(map_extra)}): {sorted(map_extra)}')

print()

# 4. Check footer links in each page.js
print('=== FOOTER / RELATED LINKS CHECK ===')
link_issues = []
link_ok = []

for item in sorted(actual_tools):
    pagePath = os.path.join(pageDir, item, 'page.js')
    with open(pagePath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all href patterns with locale
    # Check if /locale/toolname links actually correspond to existing pages
    links = set()
    for m in re.finditer(r'href={\s*`/\$\{locale\}(\S+?)`\s*}', content):
        links.add(m.group(1))
    
    broken = []
    for link in links:
        link_tool = link.strip('/').split('/')[0]
        if link_tool not in actual_tools and not link_tool.startswith('#'):
            broken.append(link)
    
    if broken:
        link_issues.append((item, broken))
        print(f'  [{item}] BROKEN LINKS: {broken}')
    else:
        link_ok.append(item)

print(f'  Footer/related links clean: {len(link_ok)}, Issues: {len(link_issues)}')