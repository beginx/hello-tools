import json, os, re

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
        
        # Fix: lastkey":"value""seoDescription" -> lastkey":"value","seoDescription"
        # Pattern: a string value followed directly by "seoDescription" without comma
        # This handles cases like: "lastkey":"lastval""seoDescription"
        # And: "lastkey":"lastval"}"seoDescription"
        
        # Replace ): "..."  }"seoDescription" -> "..." },"seoDescription"
        text = re.sub(r'"}(?="seoDescription")', '"},', text)
        
        # Replace: "..."  "seoDescription" -> "...","seoDescription"  (when preceding char is a quote)
        text = re.sub(r'(""seoDescription")', r'\1' + ',"seoDescription"', text)
        
        # Try to validate
        try:
            json.loads(text)
        except json.JSONDecodeError:
            # More aggressive: find "seoDescription" and ensure preceding char is ,
            idx = text.find('"seoDescription"')
            if idx > 0 and text[idx-1] != "," and text[idx-1] != "{":
                # Insert comma before "seoDescription"
                text = text[:idx] + "," + text[idx:]
        
        if text != old:
            # Final validation
            try:
                json.loads(text)
                with open(path, "w", encoding="utf-8") as fh:
                    fh.write(text)
                fixed += 1
                print(f"Fixed: {path}")
            except json.JSONDecodeError as e:
                print(f"STILL BROKEN: {path}: {e}")

print(f"\nTotal fixed: {fixed}")