import re

with open(r'C:\Users\1one\Documents\dev\hello-tools\src\app\[locale]\layout.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find en: { block
start = content.find('  en: {')
end = content.find('  es: {')
if start >= 0 and end >= 0:
    block = content[start:end]
    tools = re.findall(r'^\s+(\w+):\s*\{', block, re.MULTILINE)
    print(f'EN block ({start}-{end}): {len(tools)} tools')
    print(f'Tools: {tools}')
    extra_idx = block.find('age: {')
    print(f'age: {extra_idx >= 0}')
    print(f'Has 60? {"average: {" in block}')
    print(f'Block ends: ...{block[-60:]}')
else:
    print('EN block not found')