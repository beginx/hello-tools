#!/usr/bin/env python3
"""Fix layout.js toolMap and scientific-calc"""
import os, re

# Fix 1: layout.js - fix the toolMap object
with open('src/app/[locale]/layout.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The issue is that the toolMap was split across lines incorrectly
# Let's find the toolMap and fix it
# The original had it on one long line, now it has newlines inserted

# Find the toolMap definition
toolmap_start = content.find("const toolMap = {")
if toolmap_start != -1:
    # Find the closing }
    brace_count = 0
    pos = toolmap_start
    for i, ch in enumerate(content[toolmap_start:]):
        if ch == '{': brace_count += 1
        elif ch == '}':
            brace_count -= 1
            if brace_count == 0:
                pos = toolmap_start + i
                break
    
    # Extract the toolMap content
    toolmap_content = content[toolmap_start:pos+1]
    
    # Now rebuild it properly - one line with all entries
    # Extract all key-value pairs
    pairs = re.findall(r'"?/[a-z0-9-]+"?\s*:\s*"[a-z0-9-]+"', toolmap_content)
    
    # Add new pairs
    new_tools = ['base64', 'urlcode', 'uuid', 'hash', 'jwt', 'json', 'numberbase', 'roman', 'caseconverter', 'charcount', 'lorem', 'diff', 'datasize', 'standard-deviation', 'inflation', 'bac', 'creditcard', 'time-calc', 'cooking', 'timezone', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji', 'pomodoro', 'scientific-calc', 'ascii-art', 'regex', 'markdown-preview', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker', 'about', 'guide']
    
    for tool in new_tools:
        if f'"/{tool}"' not in toolmap_content:
            pairs.append(f'"/{tool}": "{tool}"')
    
    # Rebuild
    new_toolmap = "const toolMap = { " + ", ".join(pairs) + " };"
    content = content[:toolmap_start] + new_toolmap + content[pos+1:]

with open('src/app/[locale]/layout.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed layout.js toolMap")

# Fix 2: scientific-calc/page.js - add 'use client'
with open('src/app/[locale]/scientific-calc/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

if not content.startswith("'use client'"):
    content = "'use client';\n\n" + content
    with open('src/app/[locale]/scientific-calc/page.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added 'use client' to scientific-calc/page.js")

print("Done!")