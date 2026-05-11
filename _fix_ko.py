import json

with open('src/messages/ko/fraction.json', 'r', encoding='utf-8') as f:
    raw = f.read()

print("Original raw repr (first 200 chars):")
print(repr(raw[:200]))

# Fix 1: 풌이 -> 풀이  (U+D48C U+C774 -> U+D480 U+C774)
old1 = chr(0xD48C) + chr(0xC774)  # 풌이
new1 = chr(0xD480) + chr(0xC774)  # 풀이
print(f"\nFix 1: '{old1}' -> '{new1}'")
print(f"  old1 found: {old1 in raw}")
raw = raw.replace(old1, new1)

# Fix 2: 덧하고 -> 더하고 (U+B367 U+D558 U+ACE0 -> U+B354 U+D558 U+ACE0)
old2 = chr(0xB367) + chr(0xD558) + chr(0xACE0)  # 덧하고
new2 = chr(0xB354) + chr(0xD558) + chr(0xACE0)  # 더하고
print(f"\nFix 2: '{old2}' -> '{new2}'")
print(f"  old2 found: {old2 in raw}")
raw = raw.replace(old2, new2)

# Fix 3: 앜수 -> 약수  (U+C55C U+C218 -> U+C57D U+C218)
old3 = chr(0xC55C) + chr(0xC218)  # 앜수
new3 = chr(0xC57D) + chr(0xC218)  # 약수
print(f"\nFix 3: '{old3}' -> '{new3}'")
print(f"  old3 found: {old3 in raw}")
raw = raw.replace(old3, new3)

# Write back
with open('src/messages/ko/fraction.json', 'w', encoding='utf-8') as f:
    f.write(raw)

# Verify
with open('src/messages/ko/fraction.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
print(f"\n=== VERIFIED ===")
print(f"seoDesc: {d['seoDesc']}")
print(f"seoAddDesc: {d['seoAddDesc']}")
print(f"seoDivideDesc: {d['seoDivideDesc']}")