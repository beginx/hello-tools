#!/usr/bin/env python3
import json
import os
import re

with open('recovered/full_page.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.index('messages')
start = idx + 11  # position of first { after "messages":

# In the RSC payload, \" (backslash-quote) is the string delimiter, not just "
# So we need to parse where \" followed by : } , etc. has different meaning
# Let me use a different approach: convert the RSC format to valid JSON

# The format is: {\"app\":{\"title\":\"Calorie Calculator\",...}}
# In Python string, this is: {"app":{"title":"Calorie Calculator",...}}
# if we just strip the backslashes before quotes

# But first we need to find the complete JSON object
# Let's count balanced braces, treating \" as a quote delimiter (2 chars)

i = start
depth = 0
in_str = False

while i < len(content):
    ch = content[i]
    
    if ch == '\\' and i + 1 < len(content) and content[i+1] == '"':
        # \" is a quote delimiter - toggle string mode
        in_str = not in_str
        i += 2
        continue
    
    # Other escaped sequences inside strings (like \\n)
    if ch == '\\' and in_str:
        i += 2  # skip escape sequence
        continue
    
    if ch == '"' and not in_str:
        in_str = True
        i += 1
        continue
    
    if ch == '"' and in_str:
        in_str = False
        i += 1
        continue
    
    if not in_str:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                i += 1
                break
    
    i += 1

msg_str = content[start:i]
print(f"Extracted {len(msg_str)} chars")

# Now convert to proper JSON: replace \" with " everywhere
# But be careful: \\n should become \n, \\t should become \t etc.
# Simple approach: \\" -> " (backslash-quote to quote)
proper = msg_str.replace('\\"', '"')

# Also handle double-escaped sequences
proper = proper.replace('\\\\n', '\\n').replace('\\\\t', '\\t').replace('\\\\r', '\\r')

# Try to parse
try:
    parsed = json.loads(proper)
    print(f"Parsed OK! Top-level keys: {len(parsed)}")
    
    out_dir = 'recovered/final_msgs'
    os.makedirs(out_dir, exist_ok=True)
    
    for t, msgs in sorted(parsed.items()):
        if isinstance(msgs, dict):
            filepath = f'{out_dir}/{t}.json'
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(msgs, f, indent=2, ensure_ascii=False)
            print(f"  {t}: {len(msgs)} keys")
        else:
            print(f"  {t}: not a dict ({type(msgs).__name__})")
    
    missing = [
        'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker',
        'pomodoro', 'scientific-calc', 'ascii-art', 'base64', 'urlcode', 'uuid', 'hash',
        'jwt', 'json', 'regex', 'diff', 'lorem', 'markdown-preview', 'caseconverter',
        'charcount', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'numberbase',
        'roman', 'time-calc', 'timezone', 'datasize', 'standard-deviation', 'inflation',
        'creditcard', 'bac', 'cooking', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji',
    ]
    
    print(f"\n=== Missing tools ===")
    for t in missing:
        if t in parsed:
            print(f"  ✅ {t}")
        else:
            print(f"  ❌ {t}")
    
except json.JSONDecodeError as e:
    print(f"JSON parse error: {e}")
    print(f"Error at char {e.pos}")
    print(f"Context: {proper[max(0,e.pos-80):e.pos+80]}")
    
    # Save for debugging
    with open('recovered/parse_debug.json', 'w', encoding='utf-8') as f:
        f.write(proper)
    print(f"Saved full content to recovered/parse_debug.json ({len(proper)} chars)")
