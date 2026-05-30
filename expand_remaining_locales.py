import os, re

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT_PATH = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')

with open(LAYOUT_PATH, 'r', encoding='utf-8') as f:
    content = f.read()
lines = content.split('\n')

# Find all locale block boundaries
boundaries = {}
for i, line in enumerate(lines):
    for loc in ['en:', 'es:', 'zh:', 'ko:', 'pt:']:
        if line.strip() == loc + ' {' or line.strip().startswith(loc + ' {'):
            boundaries[loc.rstrip(':')] = i

print('Block boundaries:')
for k, v in sorted(boundaries.items()):
    print(f'  {k}: line {v+1}')

# Find end of tools block (line of '};' that closes the tools object)
# It should be right before 'function getToolKey'
tool_end = None
for i, line in enumerate(lines):
    if 'function getToolKey' in line:
        tool_end = i - 1
        break

print(f'tools block ends at line {tool_end+1 if tool_end else "?"}')
print(f'Total lines: {len(lines)}')

# Extract all EN tool keys and their name/desc/cat
en_start = boundaries.get('en', 0)
en_end = boundaries.get('es', len(lines))
en_block = '\n'.join(lines[en_start:en_end])
en_tools = {}
for m in re.finditer(r'^\s+(\w+):\s*\{([^}]+)\}', en_block, re.MULTILINE):
    key = m.group(1)
    body = m.group(2)
    nm = re.search(r'name: "([^"]+)"', body)
    dc = re.search(r'desc: "([^"]+)"', body)
    ct = re.search(r'cat: "([^"]+)"', body)
    if nm and dc and ct:
        en_tools[key] = {'name': nm.group(1), 'desc': dc.group(1), 'cat': ct.group(1)}

print(f'\nEN tools: {len(en_tools)}')

# For each non-EN locale, find missing tools and generate entries
for loc in ['es', 'zh', 'ko', 'pt']:
    if loc not in boundaries:
        continue
    loc_start = boundaries[loc]
    # Find next locale boundary or tools end
    next_locales = [l for l in ['es', 'zh', 'ko', 'pt'] if l != loc and l in boundaries]
    next_boundary = None
    for nl in sorted(next_locales, key=lambda x: boundaries[x]):
        if boundaries[nl] > loc_start:
            next_boundary = boundaries[nl]
            break
    if next_boundary is None:
        next_boundary = tool_end
    
    loc_block = '\n'.join(lines[loc_start:next_boundary])
    existing_keys = set()
    for m in re.finditer(r'^\s+(\w+):\s*\{', loc_block, re.MULTILINE):
        existing_keys.add(m.group(1))
    
    missing_keys = sorted(set(en_tools.keys()) - existing_keys)
    print(f'{loc}: {len(existing_keys)} present, {len(missing_keys)} missing')
    
    if missing_keys:
        # Generate entries for missing tools
        new_entries = []
        for tool in missing_keys:
            en = en_tools[tool]
            name = en['name']
            desc = en['desc']
            cat = en['cat']
            
            if loc == 'es':
                # Spanish: add "Estilo retro Mac OS 9." to desc if missing
                if not desc.endswith('Estilo retro Mac OS 9.'):
                    desc = desc.rstrip('.') + '. Estilo retro Mac OS 9.'
            elif loc == 'zh':
                # Chinese: add Mac OS 9复古风格
                if 'Mac OS 9' not in desc:
                    desc = desc.rstrip('。') + '。Mac OS 9复古风格。'
                elif not desc.endswith('。'):
                    desc += '。'
            elif loc == 'ko':
                # Korean: add Mac OS 9 레트로 스타일
                if 'Mac OS 9' not in desc:
                    desc = desc.rstrip('.') + '. Mac OS 9 레트로 스타일.'
            elif loc == 'pt':
                if not desc.endswith('Estilo retro Mac OS 9.'):
                    desc = desc.rstrip('.') + '. Estilo retro Mac OS 9.'
            
            # Escape double quotes
            name = name.replace('"', '\\"')
            desc = desc.replace('"', '\\"')
            
            new_entries.append(f'    {tool}: {{ name: "{name}", desc: "{desc}", cat: "{cat}" }},')
        
        # Insert before the closing '  },' of this locale block
        insert_line = next_boundary - 1  # line with '  },'
        indent = '    '
        insert_lines = []
        for entry in new_entries:
            insert_lines.append(entry)
        
        # Actually, simpler: find the closing `  },` line of this block
        # and insert our entries before it
        closing_idx = None
        for i in range(next_boundary - 1, loc_start, -1):
            line = lines[i].strip()
            if line == '},' or line == '},':
                # Check this is our block's closing, not a tool entry closing
                if i < next_boundary - 1:  # not the last line of block
                    pass
                closing_idx = i
                break
        
        # Find the actual closing: look for "  }," that is NOT a tool entry
        # A tool entry has "},  " or "}," at end but is preceded by indented line
        # The block closing "  }," is followed by next locale header
        for i in range(next_boundary - 1, loc_start, -1):
            line = lines[i]
            # Block closing is "  }," with only 2 spaces indent (not 4)
            if line.strip() == '},' and (line.startswith('  ') and not line.startswith('    ')):
                closing_idx = i
                break
        
        if closing_idx:
            # Insert new entries before closing line
            for entry in reversed(new_entries):
                lines.insert(closing_idx, entry)
            print(f'  Inserted {len(new_entries)} entries before line {closing_idx+1}')
        else:
            print(f'  ERROR: could not find closing for {loc} block')

# Write back
content = '\n'.join(lines)
with open(LAYOUT_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nFinal lines: {len(lines)}')
print('Done!')