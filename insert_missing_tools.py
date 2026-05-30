import re, os

LAYOUT = r'C:\Users\1one\Documents\dev\hello-tools\src\app\[locale]\layout.js'
PAGE_DIR = r'C:\Users\1one\Documents\dev\hello-tools\src\app\[locale]'

with open(LAYOUT, 'r', encoding='utf-8') as f:
    content = f.read()
lines = content.split('\n')

# Get all actual tool names
actual_tools = sorted([
    item for item in os.listdir(PAGE_DIR)
    if os.path.isfile(os.path.join(PAGE_DIR, item, 'page.js'))
])

# Find locale boundaries
locale_order = ['en', 'es', 'zh', 'ko', 'pt']
block_starts = {}
for loc in locale_order:
    for i, line in enumerate(lines):
        if line.strip() == f'{loc}: {{':
            block_starts[loc] = i
            break

# EN extra tools (from age: to wordcounter:) - these are the "new" tools
en_start = block_starts['en']
en_end = block_starts['es']
en_lines = lines[en_start:en_end]

# Find age: line index in EN block
age_idx = None
for i, line in enumerate(en_lines):
    if line.strip().startswith('age:'):
        age_idx = i
        break

# Extract the extra tool lines from age: to the closing }, 
extra_lines_en = []
if age_idx is not None:
    for i in range(age_idx, len(en_lines)):
        line = en_lines[i]
        if line.strip() == '},':
            break
        extra_lines_en.append(line)
    print(f'EN extra tool lines: {len(extra_lines_en)} (from age: to before closing)')
    for line in extra_lines_en[:3]:
        print(f'  {line.strip()[:60]}...')
    print(f'  ...')
    for line in extra_lines_en[-2:]:
        print(f'  {line.strip()[:60]}...')

# Now for each non-EN locale, find the closing and insert
for loc in ['es', 'zh', 'ko', 'pt']:
    loc_start = block_starts[loc]
    loc_end = len(lines)
    for nl in locale_order:
        if nl != loc and nl in block_starts and block_starts[nl] > loc_start:
            loc_end = block_starts[nl]
            break
    
    loc_block = lines[loc_start:loc_end]
    present = set(re.findall(r'^\s+(\w+):\s*\{', '\n'.join(loc_block), re.MULTILINE))
    missing = sorted(set(actual_tools) - present)
    
    if not missing:
        print(f'{loc}: all tools present!')
        continue
    
    # Find closing line (2-space "  },")
    closing_idx = None
    for i in range(loc_end - 1, loc_start, -1):
        line = lines[i]
        if line.strip() == '},' and line.startswith('  ') and not line.startswith('    '):
            closing_idx = i
            break
    
    if closing_idx:
        # Insert missing tool entries before closing
        # Use EN entries but modify the name/desc to remove "Free online " prefix if needed
        for tool in reversed(missing):
            # Find this tool in extra_lines_en
            for el in reversed(extra_lines_en):
                if el.strip().startswith(f'{tool}:'):
                    lines.insert(closing_idx, el)
                    break
            else:
                # Tool might not be in extra set (it's in base set)
                # Find in full EN block
                for i, el in enumerate(en_lines):
                    if el.strip().startswith(f'{tool}:'):
                        lines.insert(closing_idx, el)
                        break
        
        print(f'{loc}: inserted {len(missing)} tools before line {closing_idx+1}')
    else:
        print(f'{loc}: ERROR - could not find closing!')

# Write back
content = '\n'.join(lines)
with open(LAYOUT, 'w', encoding='utf-8') as f:
    f.write(content)

# Verify final counts
print('\n=== FINAL VERIFICATION ===')
for loc in locale_order:
    loc_start = block_starts[loc]
    loc_end = len(lines)
    for nl in locale_order:
        if nl != loc and nl in block_starts and block_starts[nl] > loc_start:
            loc_end = block_starts[nl]
            break
    block = '\n'.join(lines[loc_start:loc_end])
    present = set(re.findall(r'^\s+(\w+):\s*\{', block, re.MULTILINE))
    missing = sorted(set(actual_tools) - present)
    print(f'{loc}: {len(present)} tools (missing: {len(missing)})')
    if missing:
        print(f'  Still missing: {missing}')

print(f'\nTotal lines: {len(lines)}')