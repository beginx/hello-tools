import os, re

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
PAGES_DIR = os.path.join(BASE, 'src', 'app', '[locale]')

tools = ['tdee', 'calorieburn', 'pregnancy', 'ovulation', 'cagr']

# Map of u-escapes to actual characters
unicode_fixes = {
    '\\u00f1': '\u00f1',    # ñ
    '\\u4e2d\\u6587': '\u4e2d\u6587',  # 中文
    '\\ud55c\\uad6d\\uc5b4': '\ud55c\uad6d\uc5b4',  # 한국어
    '\\u00ea': '\u00ea',    # ê
    '\\u00e3': '\u00e3',    # ã
    '\\u00e7': '\u00e7',    # ç
}

for tool in tools:
    file_path = os.path.join(PAGES_DIR, tool, 'page.js')
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if the file has literal \uXXXX patterns
    # These are 6-char sequences like \u4e2d which should be actual unicode chars
    # But \u00f1 inside a JS string IS valid (JS will parse it as ñ)
    # The problem is that \u4e2d\u6587 and \ud55c\uad6d\uc5b4 are NOT being parsed
    # Actually wait - in a JSX file, "Espa\u00f1ol" works because JS interprets \u00f1
    # But "\u4e2d\u6587" should also work in JS...
    
    # Let's check what we actually have
    if 'Espa\\u00f1ol' in content:
        print(f'{tool}: has literal backslash-u pattern')
    elif 'Espa\u00f1ol' in content:
        print(f'{tool}: has actual unicode')
    else:
        print(f'{tool}: checking raw bytes...')
        # Read raw bytes to see what's actually there
        with open(file_path, 'rb') as f:
            raw = f.read()
        idx = raw.find(b'Espa')
        if idx >= 0:
            snippet = raw[idx:idx+20]
            print(f'  Raw bytes around Espa: {snippet}')

print('\n---')

# Actually the issue might be different. Let's check the raw hex
for tool in tools:
    file_path = os.path.join(PAGES_DIR, tool, 'page.js')
    with open(file_path, 'rb') as f:
        raw = f.read()
    
    # Check for literal backslash-u (5c 75) vs actual UTF-8 encoded unicode
    idx_en = raw.find(b'English')
    if idx_en >= 0:
        snippet = raw[idx_en:idx_en+120]
        print(f'{tool}: {snippet}')
    print()