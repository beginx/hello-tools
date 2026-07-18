#!/usr/bin/env python3
import json
import os
import re

with open('recovered/full_page.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.index('messages')
start = idx + 11  # skip 'messages\\":'

# Extract the messages JSON object
depth = 0
in_str = False
escaped = False
end = start

for i in range(start, len(content)):
    ch = content[i]
    
    if escaped:
        escaped = False
        continue
    
    # In the RSC payload, `\\` inside strings is the escape char
    # But here we're parsing at a higher level
    # The actual JSON structure uses `\` to escape `"` characters
    if ch == '\\' and in_str:
        escaped = True
        continue
    
    if ch == '"':
        in_str = not in_str
        continue
    
    if not in_str:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break

msg_str = content[start:end]
print(f"Extracted {len(msg_str)} chars")

# Now we need to properly unescape the JSON
# The format is: {\"app\":{\"title\":\"Calorie Calculator\",...}}
# This is actually valid JSON if we just strip the backslash escapes properly
# The escape pattern: \ before " inside the JSON payload

# Convert to proper JSON by removing backslashes before quotes
# But be careful: \\n should stay as \n
proper_json = msg_str.replace('\\"', '"')

# Now try to parse as JSON
try:
    parsed = json.loads(proper_json)
    print(f"Successfully parsed! Top-level keys: {len(parsed)}")
    
    # Save individual message files
    out_dir = 'recovered/final_msgs'
    os.makedirs(out_dir, exist_ok=True)
    
    for t, msgs in sorted(parsed.items()):
        if isinstance(msgs, dict):
            filepath = f'{out_dir}/{t}.json'
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(msgs, f, indent=2, ensure_ascii=False)
            print(f"  {t}: {len(msgs)} keys")
    
    # Check for missing tools
    missing = [
        'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker',
        'pomodoro', 'scientific-calc', 'ascii-art', 'base64', 'urlcode', 'uuid', 'hash',
        'jwt', 'json', 'regex', 'diff', 'lorem', 'markdown-preview', 'caseconverter',
        'charcount', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'numberbase',
        'roman', 'time-calc', 'timezone', 'datasize', 'standard-deviation', 'inflation',
        'creditcard', 'bac', 'cooking', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji',
    ]
    
    print(f"\nMissing tools check:")
    for t in missing:
        if t in parsed:
            print(f"  ✅ {t}")
        else:
            print(f"  ❌ {t} NOT FOUND")
    
except json.JSONDecodeError as e:
    print(f"Parse error: {e}")
    # Show the area around the error
    line = e.lineno
    col = e.colno
    lines = proper_json[:e.pos].count('\n')
    print(f"Error at line ~{lines}, position {e.pos}")
    print(f"Context: ...{proper_json[max(0,e.pos-40):e.pos+40]}...")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
