#!/usr/bin/env python3
import json
import os
import re

with open('recovered/full_page.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The format is: ...\"messages\":{\"app\":{...}}...
# 'messages' appears as literal text without quotes around it
idx = content.index('messages')
print(f"Found 'messages' at position {idx}")

# The format is: ...\"messages\":{\"app\":{...}}
# After 'messages', the next characters are: \" : {
# The opening brace of the messages object is at idx + 11
# Let's find the colon and then the opening brace
# 'messages' is 8 chars, then follows: \ " : {
# colon is at idx + 10
colon_pos = idx + 10  # position of :
start = colon_pos + 1  # position of { (the opening brace of messages object)
# Verify
print(f"Character at expected start: {repr(content[start])}")
if content[start] != '{':
    print(f"WARNING: Expected {{ but got {repr(content[start])} at position {start}")
    # Fallback: find the first { after colon_pos
    brace_pos = content.find('{', colon_pos)
    if brace_pos >= 0:
        start = brace_pos
    else:
        print("Could not find opening brace")
        exit(1)

# Now parse the JSON object
depth = 0
in_str = False
escaped = False
end = start

for i in range(start, len(content)):
    ch = content[i]
    
    if escaped:
        escaped = False
        continue
    
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

# Unescape the JSON string
# The content has \" instead of ", and \\n instead of \n, etc.
# For saving as proper JSON files, we need to convert
unescaped = msg_str.replace('\\"', '"').replace('\\n', '\n').replace('\\t', '\t').replace('\\r', '\r')

# Now extract individual tool messages
# Each tool is: "toolname":{"key":"value",...}
tools = {}
pattern = re.compile(r'"([a-zA-Z0-9_-]+)":(\{(?:[^{}]|(?:\{[^{}]*\}))*\})')

pos = 0
while pos < len(unescaped):
    match = pattern.search(unescaped, pos)
    if not match:
        break
    key = match.group(1)
    val_str = match.group(2)
    try:
        parsed = json.loads(val_str)
        tools[key] = parsed
    except json.JSONDecodeError as e:
        print(f"  Parse error for {key}: {e}")
    pos = match.end()

print(f"\nFound {len(tools)} tools in messages:")

# Save individual files
out_dir = 'recovered/final_msgs'
os.makedirs(out_dir, exist_ok=True)

for t in sorted(tools.keys()):
    msgs = tools[t]
    if isinstance(msgs, dict):
        filepath = f'{out_dir}/{t}.json'
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(msgs, f, indent=2, ensure_ascii=False)
        print(f"  {t}: {len(msgs)} keys")

# Final check for the 43 missing tools
missing = [
    'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker',
    'pomodoro', 'scientific-calc', 'ascii-art', 'base64', 'urlcode', 'uuid', 'hash',
    'jwt', 'json', 'regex', 'diff', 'lorem', 'markdown-preview', 'caseconverter',
    'charcount', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'numberbase',
    'roman', 'time-calc', 'timezone', 'datasize', 'standard-deviation', 'inflation',
    'creditcard', 'bac', 'cooking', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji',
]

# Also check about, guide
for extra in ['about', 'guide']:
    if extra in tools:
        print(f"  {extra}: {len(tools[extra])} keys")

print(f"\nMissing tools found in messages:")
found_count = 0
for t in missing:
    if t in tools:
        print(f"  ✅ {t}")
        found_count += 1
    else:
        print(f"  ❌ {t}")
print(f"Found {found_count}/{len(missing)}")
