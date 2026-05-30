import re

with open(r'C:\Users\1one\Documents\dev\hello-tools\src\app\[locale]\investment\page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the ko option line
match = re.search(r'<option value="ko">.*?</option>', content)
if match:
    line = match.group()
    print('FOUND:', repr(line))
    for ch in line:
        if ord(ch) > 127:
            print(f'  Unicode char: {ch} (U+{ord(ch):04X})')
else:
    print('NOT FOUND')

# Replace literal \uXXXX with actual unicode
# The gen script wrote literal backslash-u sequences
# We need to replace the raw string \\ud55c\\uad6d\\uc5b4 etc with actual chars
fixes = {
    '\\ud55c\\uad6d\\uc5b4': '한국어',
    '\\u4e2d\\u6587': '中文',
}
# Also handle the case where Python already wrote actual unicode
# Let's just check what's actually in the file
idx = content.find('한국어')
if idx >= 0:
    print('Korean already actual unicode at position', idx)
else:
    print('Korean is escaped')
    # Check for literal backslash sequences
    if '\\\\ud55c' in content:
        print('Found double-escaped')
    elif '\\ud55c' in content:
        print('Found single-escaped (literal)')