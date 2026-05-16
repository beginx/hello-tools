import os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
PAGES_DIR = os.path.join(BASE, 'src', 'app', '[locale]')

tools = ['tdee', 'calorieburn', 'pregnancy', 'ovulation', 'cagr']

# The file has literal \\uXXXX (double backslash + u) which JS sees as literal "\uXXXX" text
# Fix: convert to actual unicode characters that get embedded as UTF-8 in the JSX
for tool in tools:
    file_path = os.path.join(PAGES_DIR, tool, 'page.js')
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace literal \u sequences with actual characters
    # \\u00f1 -> ñ
    # \\u4e2d\\u6587 -> 中文  
    # \\ud55c\\uad6d\\uc5b4 -> 한국어
    # \\u00ea -> ê (for português)
    # \\u00e3 -> ã (for português)
    # \\u00e7 -> ç (for português)
    
    replacements = {
        'Espa\\u00f1ol': 'Espa\u00f1ol',  # JS will parse \u00f1 as ñ
        '\\u4e2d\\u6587': '\u4e2d\u6587',  # Write actual characters
        '\\ud55c\\uad6d\\uc5b4': '\ud55c\uad6d\uc5b4',
        'Portugu\\u00eas': 'Portugu\u00eas',
    }
    
    old_content = content
    for old, new in replacements.items():
        # Check for double-backslash (literal) version
        literal_old = old.replace('\\u', '\\\\u')
        if literal_old in content:
            content = content.replace(literal_old, new)
            print(f'{tool}: replaced {repr(literal_old)} -> {new}')
        elif old in content:
            # Single backslash version is actually fine in JS
            pass
    
    if content != old_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'{tool}: SAVED')

print('\nDone!')