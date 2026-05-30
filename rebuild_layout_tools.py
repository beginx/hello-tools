import re, os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')
PAGE_DIR = os.path.join(BASE, 'src', 'app', '[locale]')

# === STEP 1: Extract existing layout.js header and footer ===
with open(LAYOUT, 'r', encoding='utf-8') as f:
    full = f.read()

# Find "const tools = {" and the closing "};" before "function getToolKey"
tools_start = full.find('const tools = {')
tools_end = full.find('function getToolKey')

# Extract header (before tools) and footer (after tools)
header = full[:tools_start]  # includes "const tools = {"
footer = full[tools_end:]    # starts with "function getToolKey..."

# Also need to remove the "const tools = {" from header
# Let header end at "const tools"
header = full[:tools_start + len('const tools = {') - 1]  # without trailing {
# Actually let's be precise:
tools_start_marker = 'const tools = {'
tools_start_idx = full.find(tools_start_marker)
tools_end_marker = '};\n\nfunction getToolKey'
tools_end_idx = full.find(tools_end_marker) + len('};')

header = full[:tools_start_idx]
footer = full[tools_end_idx:]

print(f'Header length: {len(header)}')
print(f'Footer length: {len(footer)}')
print(f'Header ends with: {repr(header[-40:])}')
print(f'Footer starts with: {repr(footer[:60])}')

# Get actual tool list
actual_tools = sorted([
    item for item in os.listdir(PAGE_DIR)
    if os.path.isfile(os.path.join(PAGE_DIR, item, 'page.js'))
])
print(f'\nActual tools: {len(actual_tools)}')

# === STEP 2: Extract EN tools with their name/desc/cat from current layout ===
# Find EN block boundaries
en_marker = '\n  en: {'
en_start = full.find(en_marker)
es_marker = '\n  es: {'
en_end = full.find(es_marker, en_start)

en_block = full[en_start + len(en_marker):en_end]

en_tools = {}
for m in re.finditer(r'^\s+(\w+):\s*\{([^}]+)\}', en_block, re.MULTILINE):
    key = m.group(1)
    body = m.group(2)
    nm = re.search(r'name:\s*"([^"]*)"', body)
    dc = re.search(r'desc:\s*"([^"]*)"', body)
    ct = re.search(r'cat:\s*"([^"]*)"', body)
    if nm and dc and ct:
        en_tools[key] = {
            'name': nm.group(1).replace('"', '\\"'),
            'desc': dc.group(1).replace('"', '\\"'),
            'cat': ct.group(1)
        }

print(f'EN tools extracted: {len(en_tools)}')

# Check which actual tools are missing from EN
en_missing = set(actual_tools) - set(en_tools.keys())
if en_missing:
    print(f'EN still missing some: {sorted(en_missing)}')
else:
    print('EN has all tools!')

# === STEP 3: Generate tools object for all 5 locales ===
def generate_tools_block(en_dict, locale, actual_list):
    """Generate a locale tools block with EN entries adapted."""
    lines = []
    lines.append(f'  {locale}: {{')
    
    for tool in sorted(actual_list):
        if tool not in en_dict:
            print(f'WARNING: {tool} not in EN dict, skipping')
            continue
        en = en_dict[tool]
        name = en['name']
        desc = en['desc']
        cat = en['cat']
        
        # Adapt for non-EN locales
        if locale != 'en':
            # Add locale suffix to desc if not already there
            if locale == 'es' and 'Estilo retro Mac OS 9' not in desc:
                desc = desc.rstrip('.').rstrip('.') + '. Estilo retro Mac OS 9.'
            elif locale == 'zh' and '复古风格' not in desc:
                desc = desc.replace('Mac OS 9 retro style.', '').replace('Mac OS 9', '').rstrip('. ')
                desc = desc + '。Mac OS 9复古风格。'
            elif locale == 'ko' and '레트로' not in desc:
                desc = desc.rstrip('.').rstrip('.') + '. Mac OS 9 레트로 스타일.'
            elif locale == 'pt' and 'Estilo retro Mac OS 9' not in desc:
                desc = desc.rstrip('.').rstrip('.') + '. Estilo retro Mac OS 9.'
            
            # Escape quotes
            name = name.replace('"', '\\"')
            desc = desc.replace('"', '\\"')
        
        lines.append(f'    {tool}: {{ name: "{name}", desc: "{desc}", cat: "{cat}" }},')
    
    lines.append('  },')
    return '\n'.join(lines)

tools_parts = []
for loc in ['en', 'es', 'zh', 'ko', 'pt']:
    block = generate_tools_block(en_tools, loc, actual_tools)
    tools_parts.append(block)
    tool_count = len(re.findall(r'^\s+\w+:\s*\{', block, re.MULTILINE))
    print(f'{loc}: {tool_count} tools generated')

tools_obj = 'const tools = {\n' + '\n'.join(tools_parts) + '\n};'

# === STEP 4: Also regenerate toolMap ===
tool_entries = [f"'/{t}': '{t}'" for t in actual_tools]
tool_map = f'  const toolMap = {{ {", ".join(tool_entries)} }};'

# Build final content
new_content = header + '\n' + tools_obj + '\n\n' + footer

# Replace the old toolMap line with new one
old_toolmap_pattern = re.search(r'const toolMap\s*=\s*\{[^}]+\};', new_content)
if old_toolmap_pattern:
    new_content = new_content.replace(old_toolmap_pattern.group(0), tool_map)

# === STEP 5: Write back ===
with open(LAYOUT, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'\nWritten! Total lines: {len(new_content.splitlines())}')

# Final verification
final_en_count = len(re.findall(r'^\s+\w+:\s*\{', new_content.split('en: {')[1].split('es: {')[0], re.MULTILINE))
print(f'Final EN tools: {final_en_count}')
print(f'Has toolMap for all 59: {all(f"/{t}" in new_content for t in actual_tools)}')

# Check for any errors in generated content
if 'undefined' in new_content:
    print('WARNING: "undefined" found in output!')
if 'null' in new_content.lower() and 'null' not in new_content.split('"')[1::2]:
    pass  # null in JS code is fine