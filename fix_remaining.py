#!/usr/bin/env python3
"""Fix two remaining issues: standard-deviation key and scientific-calc JSX"""
import os

# Fix 1: layout.js - quote the standard-deviation key
with open('src/app/[locale]/layout.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace standard-deviation: with "standard-deviation":
content = content.replace('standard-deviation:', '"standard-deviation":')

with open('src/app/[locale]/layout.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed layout.js")

# Fix 2: scientific-calc/page.js - fix the className concatenation
with open('src/app/[locale]/scientific-calc/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The issue is with className="os9-btn h-10 text-sm" + (['=','C'].includes(btn) ? ' os9-btn-primary' : '') + (btn === '0' ? ' col-span-2' : '')
# This JSX expression needs to be wrapped in {} properly
# Let me find and fix the specific line

# The problem is likely with the map function generating buttons
# Let me look at the file
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'className="os9-btn h-10 text-sm"' in line and '+ ([' in line:
        print(f"Line {i}: {line[:100]}")

# Let me regenerate this specific page properly
print("Will regenerate scientific-calc")