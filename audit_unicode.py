import os, re, sys

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
pageDir = os.path.join(BASE, 'src', 'app', '[locale]')

locale_names = {
    'en': 'English',
    'es': 'Espa\u00f1ol',
    'zh': '\u4e2d\u6587',
    'ko': '\ud55c\uad6d\uc5b4',
    'pt': 'Portugu\u00eas',
}

issues = []
ok = []

for item in sorted(os.listdir(pageDir)):
    pagePath = os.path.join(pageDir, item, 'page.js')
    if not os.path.isfile(pagePath):
        continue
    with open(pagePath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tool_issues = []
    
    # 1. Check language select dropdown
    select_match = re.search(r'(<select[^>]*value\s*=\s*\{locale\}[^>]*>.*?</select>)', content, re.DOTALL)
    if select_match:
        select_html = select_match.group(1)
        for loc, name in locale_names.items():
            opt_pattern = f'<option value="{loc}">'
            idx = select_html.find(opt_pattern)
            if idx >= 0:
                rest = select_html[idx + len(opt_pattern):]
                end_idx = rest.find('</option>')
                option_text = rest[:end_idx] if end_idx >= 0 else rest[:20]
                if option_text != name:
                    tool_issues.append(f'  lang "{loc}" shows "{repr(option_text)}" (should be "{repr(name)}")')
    elif '<select' in content:
        tool_issues.append('  lang select found but no locale binding pattern')
    
    # 2. Check for literal \uXXXX in HTML context
    for m in re.finditer(r'\\u[0-9a-fA-F]{4}', content):
        pos = m.start()
        start = max(0, pos - 40)
        end = min(len(content), pos + 40)
        ctx = content[start:end]
        # Only flag if in HTML context (not JS string like '\\uXXXX')
        if '"' in ctx or "'" in ctx or '>' in ctx or '<' in ctx:
            # Check if it's actually a literal backslash-u in the HTML
            if '>\\u' in ctx or '\\u<' in ctx:
                tool_issues.append(f'  literal \\uXXXX in HTML at pos {pos}: ...{repr(ctx)}...')
    
    if tool_issues:
        issues.append((item, tool_issues))
    else:
        ok.append(item)

print('=== PAGES WITH OK DROPDOWN ===')
for p in ok:
    print(f'  {p}')

print()
print('=== ISSUES FOUND ===')
if issues:
    for item, tool_issues in issues:
        print(f'  [{item}]')
        for i in tool_issues:
            print(f'    {i}')
else:
    print('  None!')

# Summary
total = len(ok) + len(issues)
print(f'\nTotal pages checked: {total}')
print(f'Clean: {len(ok)}, Issues: {len(issues)}')