import re

LAYOUT = r'C:\Users\1one\Documents\dev\hello-tools\src\app\[locale]\layout.js'
PAGE_DIR = r'C:\Users\1one\Documents\dev\hello-tools\src\app\[locale]'

with open(LAYOUT, 'r', encoding='utf-8') as f:
    content = f.read()
lines = content.split('\n')

# Get all actual tool names
import os
actual_tools = sorted([
    item for item in os.listdir(PAGE_DIR)
    if os.path.isfile(os.path.join(PAGE_DIR, item, 'page.js'))
])

# Find locale block boundaries
locale_order = ['en', 'es', 'zh', 'ko', 'pt']
block_lines = {}
for loc in locale_order:
    for i, line in enumerate(lines):
        if line.strip() == f'{loc}: {{':
            block_lines[loc] = i
            break

print('Block start lines:', block_lines)

# For each locale, find what tools are present and what's missing
for loc in locale_order:
    start = block_lines[loc]
    # Find end: next locale or function getToolKey
    end = len(lines)
    for nl in locale_order:
        if nl != loc and nl in block_lines and block_lines[nl] > start:
            end = min(end, block_lines[nl])
    
    block = '\n'.join(lines[start:end])
    present = set(re.findall(r'^\s+(\w+):\s*\{', block, re.MULTILINE))
    missing = sorted(set(actual_tools) - present)
    print(f'{loc}: {len(present)} present, missing {len(missing)}')
    if missing:
        print(f'  Missing: {missing}')

# Find the closing "  }," for each locale (the indented one, not tool entry "},")
closing_lines = {}
for loc in locale_order:
    start = block_lines[loc]
    end = len(lines)
    for nl in locale_order:
        if nl != loc and nl in block_lines and block_lines[nl] > start:
            end = block_lines[nl]
            break
    
    # Find the last "  }," (2-space indent) before end
    for i in range(end - 1, start, -1):
        line = lines[i]
        if line.strip() == '},' and line.startswith('  ') and not line.startswith('    '):
            closing_lines[loc] = i
            break

print(f'\nClosing lines: {closing_lines}')