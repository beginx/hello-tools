import re, os

path = r'C:\Users\1one\Documents\dev\hello-tools\src\app\[locale]\investment\page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

issues = []

# 1. JSX balance
opens = content.count('{')
closes = content.count('}')
if opens != closes:
    issues.append(f'Unbalanced braces: open={opens}, close={closes}')

# 2. Backticks
bt = content.count('`')
if bt % 2 != 0:
    issues.append(f'Unbalanced backticks: {bt}')

# 3. Check imports exist
import re as re2
for m in re2.finditer(r"import\s+\w+\s+from\s+'([^']+)'", content):
    imp_path = m.group(1)
    base = os.path.dirname(path)
    full = os.path.normpath(os.path.join(base, imp_path))
    if not os.path.isfile(full + '.js') and not os.path.isfile(full):
        # allow node_modules resolution
        if not imp_path.startswith('.'):
            continue
        issues.append(f'Import not found: {imp_path}')
        print(f'  MISSING: {imp_path} -> {full}')

# 4. Check for double template literal escaping
# The gen script might have double-escaped things
# Look for \\` which means escaped backtick inside string
double_backtick = content.count('\\\\`')
if double_backtick > 0:
    issues.append(f'Double-escaped backticks found: {double_backtick}')

# 5. Check for \\uXXXX that should be actual unicode
# In HTML context (dropdown)
for m in re2.finditer(r'\\u[0-9a-fA-F]{4}', content):
    pos = m.start()
    ctx = content[max(0,pos-30):pos+30]
    if 'option' in ctx or '>' in ctx or '<' in ctx:
        issues.append(f'Literal \\uXXXX in HTML at pos {pos}')

# 6. Check the language dropdown
select = re2.search(r'<option value="ko">(.*?)</option>', content)
if select:
    ko_text = select.group(1)
    if ko_text != '한국어':
        issues.append(f'KO dropdown shows "{ko_text}" instead of 한국어')
        print(f'  KO dropdown text: {repr(ko_text)}')

# 7. Quick structure check
print(f'File: {path}')
print(f'Size: {len(content)} bytes, {len(content.splitlines())} lines')
print(f'Has "use client": {"use client" in content}')
print(f'Has default export: {"export default function" in content}')
print(f'Has useParams: {"useParams" in content}')
print(f'Has t() wrapper: {"const t = " in content}')

if issues:
    print(f'\nISSUES ({len(issues)}):')
    for i in issues:
        print(f'  - {i}')
else:
    print('\nNo issues found!')