# Fix literal \\uXXXX sequences in investment page.js
# The gen script had raw strings where \\u became literal backslash-u
import re

path = r'C:\Users\1one\Documents\dev\hello-tools\src\app\[locale]\investment\page.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace literal \\uXXXX with actual unicode chars
def replace_literal_unicode(s):
    # Pattern: literal backslash followed by u followed by 4 hex digits
    return re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), s)

content = replace_literal_unicode(content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed literal \\uXXXX sequences in investment page.js')

# Verify
with open(path, 'r', encoding='utf-8') as f:
    verify = f.read()
if '한국어' in verify and '中文' in verify:
    print('Verified: Korean and Chinese are actual unicode now')
else:
    print('WARNING: Fix may not have worked correctly')