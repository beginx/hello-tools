import re

with open('src/messages/ko/fraction.json', 'rb') as f:
    raw = f.read()

print(f"File size: {len(raw)} bytes")
print(f"Contains \\\\u (literal backslash-u): {b'\\\\u' in raw}")

# Find all literal \uXXXX patterns
pattern = b'\\\\u[0-9a-fA-F]{4}'
matches = list(re.finditer(pattern, raw))
print(f"Found {len(matches)} unicode escape sequences")

# Check the problematic area
# Look for the sequence around '풌이' = \ud48c\uc774
# In literal form: \ud48c\uc774 is bytes: 5c 75 64 34 38 63 5c 75 63 37 37 34
esc_pool = b'5c7564343863'  # \ud48c
esc_pool2 = b'5c7563373734'  # \uc774
target = bytes.fromhex('5c7564343863') + bytes.fromhex('5c7563373734')
print(f"Looking for literal \\\\ud48c\\\\uc774: {target in raw}")

# For 덧하고 = \ub367\ud558\uace0
target2 = bytes.fromhex('5c7562333637') + bytes.fromhex('5c7564353538') + bytes.fromhex('5c7561636530')
print(f"Looking for \\\\ub367\\\\ud558\\\\uace0: {target2 in raw}")

# For 앜수 = \uc55c\uc218
target3 = bytes.fromhex('5c7563353563') + bytes.fromhex('5c7563323138')
print(f"Looking for \\\\uc55c\\\\uc218: {target3 in raw}")

# Find the exact match
for m in matches:
    code = m.group().decode('ascii')
    pos = m.start()
    if code in ['\\ud48c', '\\ub367', '\\uc55c']:
        print(f"FOUND TYPO at {pos}: {code}")
        # Show surrounding 30 bytes
        ctx = raw[max(0,pos-5):pos+20]
        print(f"  Context hex: {ctx.hex()}")
        print(f"  Context str: {ctx.decode('utf-8', errors='replace')}")