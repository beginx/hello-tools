import json, os

BASE = r"C:\Users\1one\AppData\Local\Temp\opencode\hw0505"
msgs_dir = os.path.join(BASE, "src", "messages")

fixed = 0
for root, dirs, files in os.walk(msgs_dir):
    for f in files:
        if not f.endswith(".json"):
            continue
        path = os.path.join(root, f)
        with open(path, "r", encoding="utf-8") as fh:
            text = fh.read()
        old = text
        
        # Fix 1: "lastValue""seoDescription" -> "lastValue","seoDescription"
        # This is the main issue: a string value immediately followed by "seoDescription"
        text = text.replace('""seoDescription"', '","seoDescription"')
        
        # Fix 2: "lastValue"}"seoDescription" -> "lastValue"},"seoDescription"  
        # (unlikely but just in case)
        text = text.replace('"}"seoDescription"', '"},"seoDescription"')
        
        # Fix 3: multiline tip case - last line ends with "  and next has "seoDescription"
        text = text.replace('\n  "seoDescription"', ',\n  "seoDescription"')
        
        # Validate
        try:
            data = json.loads(text)
            if text != old:
                with open(path, "w", encoding="utf-8") as fh:
                    fh.write(text)
                fixed += 1
                print(f"OK: {path}")
        except json.JSONDecodeError as e:
            print(f"BROKEN: {path}: {e}")
            # Try more aggressive: find the exact spot
            idx = text.find('"seoDescription"')
            if idx > 0:
                # Find what's before it
                before = text[max(0,idx-10):idx]
                print(f"  Context: ...{repr(before)}[{repr(text[idx:idx+30])}]")

print(f"\nFixed: {fixed}")