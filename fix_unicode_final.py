import os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
PAGES_DIR = os.path.join(BASE, 'src', 'app', '[locale]')

tools = ['tdee', 'calorieburn', 'pregnancy', 'ovulation', 'cagr']

# The correct language select HTML with actual unicode characters (JS-safe)
select_html = '''            <select className="os9-select !w-auto" value={locale} onChange={(e) => changeLang(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Espa\\u00f1ol</option>
              <option value="zh">&#x4E2D;&#x6587;</option>
              <option value="ko">&#xD55C;&#xAD6D;&#xC5B4;</option>
              <option value="pt">Portugu\\u00eas</option>
            </select>'''

# Actually simpler: use \\uXXXX which JSX natively supports
# The issue is Python's handling of the escape sequences
# Just write them as-is and let JSX handle it

# Wait - the files already HAVE \\uXXXX but it's being rendered as literal text
# Let me check if the issue is double-backslash

# Test: read raw bytes
for tool in tools:
    file_path = os.path.join(PAGES_DIR, tool, 'page.js')
    with open(file_path, 'rb') as f:
        raw = f.read()
    
    # Find the select section
    idx = raw.find(b'English')
    if idx >= 0:
        section = raw[idx:idx+200]
        print(f'{tool} raw bytes:')
        print(section)
        print()
        
        # Replace \\u (0x5C 0x75) with actual utf-8 encoded chars
        # But first check if it's \\u (two chars) or \u (one char represented as \u in repr)
        
        # The bytes show b'Espa\\\\u00f1ol' in repr means the actual file has: Espa\u00f1ol
        # Because in repr, \\\\u = \\u = literal backslash + u
        # Wait no - repr of bytes shows escaped bytes
        pass