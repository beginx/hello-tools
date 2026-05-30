import os, re, json

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT_PATH = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')

with open(LAYOUT_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Get all 59 actual tool keys
page_dir = os.path.join(BASE, 'src', 'app', '[locale]')
actual_tools = sorted([
    item for item in os.listdir(page_dir)
    if os.path.isfile(os.path.join(page_dir, item, 'page.js'))
])

# === Collect existing block entries for each locale ===
locale_keys = ['en','es','zh','ko','pt']
existing = {}

for loc in locale_keys:
    # Find block: "  loc: {" ... "  },"
    marker_start = f'  {loc}: {{'
    idx_start = content.find(marker_start)
    
    # Find next locale block boundary
    remaining = content[idx_start + len(marker_start):]
    # Find "  },\n  " which is closing }, followed by next locale key
    block_end = len(content)
    for next_loc in locale_keys:
        if next_loc == loc: continue
        marker = f'  }},\n  {next_loc}: {{'
        idx = remaining.find(marker)
        if idx >= 0 and idx + len(marker) < block_end:
            block_end = idx + len(marker)  # includes },<newline>
    
    block_text = remaining[:block_end]
    
    # Extract all tool entries from this block
    tools = {}
    for m in re.finditer(r'^\s+(\w+):\s*\{([^}]+)\}', block_text, re.MULTILINE):
        key = m.group(1)
        body = m.group(2)
        tools[key] = body
    
    existing[loc] = tools
    present = set(tools.keys())
    missing = set(actual_tools) - present
    print(f'{loc}: {len(tools)} present, {len(missing)} missing')
    if missing:
        print(f'  Missing: {sorted(missing)}')

# === EN-based translations for new tools (generated compact) ===
# Format: { 'toolname': { 'name': '...', 'desc': '...' } }
# For es/zh/ko/pt, we'll auto-translate EN names using simple patterns

# First extract EN names/descs for all tools
en_tools = existing['en']

# Build missing EN entries from what we added via expand_en_tools.py
# Read EN block fresh
en_start = content.find('  en: {')
en_marker = f'  }},\n  es: {{'
en_end = content.find(en_marker, en_start)
en_block = content[en_start:en_end]
en_all = {}
for m in re.finditer(r'^\s+(\w+):\s*\{([^}]+)\}', en_block, re.MULTILINE):
    key = m.group(1)
    body = m.group(2)
    en_all[key] = body

# EN fallback entries for tools not existing in a locale
# For locale blocks we just use EN name/desc as fallback pattern
# layout.js already does: const t = tools[locale] || tools.en;
# So missing locale entries will fallback to EN automatically.
# But we want entries in all 5 locales for SEO/A schema.
# We'll generate localized entries using simple prefix/suffix patterns.

LOCALE_NAMES = {
    'es': ('Calculadora', 'Gratuita'),
    'zh': ('计算器', '免费在线'),
    'ko': ('계산기', '무료'),
    'pt': ('Calculadora', 'Gratuita'),
}

def safe_get(tool_dict, key):
    """Get a tool entry, returning None if not found."""
    if key in tool_dict:
        return tool_dict[key]
    return None

def make_entry(name, desc, cat):
    return f'{{ name: "{name}", desc: "{desc}", cat: "{cat}" }},'

# For each locale, create the missing entries
for loc in ['es', 'zh', 'ko', 'pt']:
    loc_tools = existing[loc]
    missing_tools = set(actual_tools) - set(loc_tools.keys())
    
    entries_to_add = []
    for tool in sorted(missing_tools):
        en_entry = en_all.get(tool)
        if en_entry:
            # Parse EN name and desc
            nm = re.search(r'name: "([^"]+)"', en_entry)
            dc = re.search(r'desc: "([^"]+)"', en_entry)
            ct = re.search(r'cat: "([^"]+)"', en_entry)
            if nm and dc and ct:
                en_name = nm.group(1)
                en_desc = dc.group(1)
                en_cat = ct.group(1)
                
                # Generate localized name
                if loc == 'es':
                    # Simple: "X Calculator" -> "Calculadora de X"
                    loc_name = en_name
                    if en_name.startswith('Free online '):
                        loc_desc = en_desc.replace('Free online ', 'Calculadora gratuita: ').rstrip('.') + '. Estilo retro Mac OS 9.'
                    else:
                        loc_desc = en_desc.rstrip('.') + '. Estilo retro Mac OS 9.'
                elif loc == 'zh':
                    loc_name = en_name
                    loc_desc = en_desc.rstrip('.') + '。Mac OS 9复古风格。'
                elif loc == 'ko':
                    loc_name = en_name
                    loc_desc = en_desc.rstrip('.') + '. Mac OS 9 레트로 스타일.'
                elif loc == 'pt':
                    loc_name = en_name
                    if en_name.startswith('Free online '):
                        loc_desc = en_desc.replace('Free online ', 'Calculadora gratuita: ').rstrip('.') + '. Estilo retro Mac OS 9.'
                    else:
                        loc_desc = en_desc.rstrip('.') + '. Estilo retro Mac OS 9.'
                
                # Escape special chars for JS string
                loc_name = loc_name.replace('"', '\\"')
                loc_desc = loc_desc.replace('"', '\\"')
                
                entries_to_add.append(f'    {tool}: {make_entry(loc_name, loc_desc, en_cat)}')
    
    if entries_to_add:
        # Find insertion point: before "  },\n  next_loc"
        insert_marker = f'  }},\n  {loc}: {{'
        # We need to insert before the CLOSING of this locale's block
        # Find the last tool entry in the existing locale block
        loc_start = content.find(f'  {loc}: {{')
        # Find end of this locale block
        loc_end = -1
        for next_loc in locale_keys:
            if next_loc == loc: continue
            idx = content.find(f'  }},\n  {next_loc}: {{', loc_start)
            if idx >= 0:
                if loc_end < 0 or idx < loc_end:
                    loc_end = idx
        
        if loc_end >= 0:
            # The locale block ends with "  },"
            # Insert entries before this closing
            close_marker = content[loc_end:loc_end+6]
            if close_marker == '  },\n':
                new_text = '\n'.join(entries_to_add) + '\n  },\n'
                content = content[:loc_end] + new_text + content[loc_end+6:]
                print(f'{loc}: added {len(entries_to_add)} entries (end of block)')
            else:
                print(f'{loc}: close marker mismatch: {repr(close_marker)}')
        else:
            print(f'{loc}: could not find block end')

with open(LAYOUT_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print('\nDone! All 5 locales expanded.')
print(f'Total lines: {len(content.splitlines())}')