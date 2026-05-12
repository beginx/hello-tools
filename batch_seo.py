import json, os, re

BASE = r"C:\Users\1one\AppData\Local\Temp\opencode\hw0505"
LOCALE_DIR = os.path.join(BASE, "src", "app", "[locale]")
MSGS_DIR = os.path.join(BASE, "src", "messages")

# Tools already done
DONE = {"age","grade","fraction","tip","daysuntil","convert","salary",
        "average","percent","date","discount","duration","idealweight"}

# All tools that have a page.js directory
all_tools = [d for d in os.listdir(LOCALE_DIR) 
             if os.path.isdir(os.path.join(LOCALE_DIR, d))]

remaining = [t for t in all_tools if t not in DONE]
print(f"Remaining tools: {len(remaining)}")
print(", ".join(remaining))

# Tools that have messages JSON vs tools that don't
msgs_tools = set()
for f in os.listdir(os.path.join(MSGS_DIR, "en")):
    if f.endswith(".json") and f != "app.json":
        msgs_tools.add(f[:-5])

# Check each remaining tool
for tool in sorted(remaining):
    page_file = os.path.join(LOCALE_DIR, tool, "page.js")
    if not os.path.exists(page_file):
        print(f"  {tool}: NO page.js!")
        continue
    
    with open(page_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    has_seo = 'seoDescription' in content
    total_lines = content.count('\n') + 1
    
    # Find footer position
    footer_idx = content.rfind('os9-footer')
    clear_idx = content.rfind("clear")
    
    # Check if clear button is within 30 lines of footer
    lines = content.split('\n')
    footer_line = None
    clear_button_line = None
    for i, line in enumerate(lines):
        if 'os9-footer' in line:
            footer_line = i
        if "'clear'" in line or '"clear"' in line:
            if 'button' in line or 'onClick' in line:
                clear_button_line = i
    
    print(f"  {tool}: lines={total_lines} footer_line={footer_line} clear_line={clear_button_line} has_seo={has_seo}")