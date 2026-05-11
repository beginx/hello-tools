import re

with open('src/messages/ko/fraction.json', 'rb') as f:
    raw = f.read()

# Replace literal backslash-u sequences
# \\ud48c\\uc774 -> \\ud480\\uc774
old1 = b'\\ud48c\\uc774'
new1 = b'\\ud480\\uc774'
raw = raw.replace(old1, new1)

# \\ub367\\ud558\\uace0 -> \\ub354\\ud558\\uace0
old2 = b'\\ub367\\ud558\\uace0'
new2 = b'\\ub354\\ud558\\uace0'
raw = raw.replace(old2, new2)

# \\uc55c\\uc218 -> \\uc57d\\uc218
old3 = b'\\uc55c\\uc218'
new3 = b'\\uc57d\\uc218'
raw = raw.replace(old3, new3)

with open('src/messages/ko/fraction.json', 'wb') as f:
    f.write(raw)

print('Done. Checking results...')

# Verify
with open('src/messages/ko/fraction.json', 'r', encoding='utf-8') as f:
    content = f.read()

import json
data = json.loads(content)
print('seoDesc:', data['seoDesc'])
print('seoAddDesc:', data['seoAddDesc'])
print('seoDivideDesc:', data['seoDivideDesc'])