import re

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT_PATH = BASE + r'\src\app\[locale]\layout.js'

with open(LAYOUT_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. toolMap: /duedate -> /pregnancy
content = content.replace(
    "'/duedate': 'duedate'",
    "'/pregnancy': 'pregnancy'"
)

# 2. In all locale blocks, find "duedate:" entries and change to "pregnancy:"
# English block already has 'pregnancy' (fixed manually above)
# Check es, zh, ko, pt blocks - they likely still have duedate from the update_layout.py run
# Let's replace all remaining duedate: entries that are tool metadata (not the actual duedate page)
content = re.sub(
    r'duedate: \{ name: "([^"]+)"',
    lambda m: 'pregnancy: { name: "' + m.group(1).replace('Due Date', 'Pregnancy Due Date').replace('Fecha de Parto', 'Fecha de Parto - Embarazo').replace('Data de Parto', 'Data de Parto - Gravidez'),
    content
)

# Actually simpler: just replace locale-specific duedate entries
replacements = [
    # es
    ('duedate: { name: "Calculadora de Fecha de Parto - Embarazo"', 'pregnancy: { name: "Calculadora de Fecha de Parto - Embarazo"'),
    # zh - find duedate entry with Chinese text
    ('duedate: { name: "\\u9884\\u4ea7\\u671f\\u8ba1\\u7b97\\u5668 - \\u6000\\u5b55\\u65e5\\u671f"', 'pregnancy: { name: "\\u9884\\u4ea7\\u671f\\u8ba1\\u7b97\\u5668 - \\u6000\\u5b55\\u65e5\\u671f"'),
    # ko
    ('duedate: { name: "\\ucd9c\\uc0b0\\uc608\\uc815\\uc77c \\uacc4\\uc0b0\\uae30 - \\uc784\\uc2e0 \\uae30\\uac04"', 'pregnancy: { name: "\\ucd9c\\uc0b0\\uc608\\uc815\\uc77c \\uacc4\\uc0b0\\uae30 - \\uc784\\uc2e0 \\uae30\\uac04"'),
    # pt 
    ('duedate: { name: "Calculadora de Data de Parto - Gravidez"', 'pregnancy: { name: "Calculadora de Data de Parto - Gravidez"'),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        print(f'Replaced: {old[:50]}...')
    else:
        print(f'NOT FOUND: {old[:50]}...')

with open(LAYOUT_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print('\nlayout.js fixed.')