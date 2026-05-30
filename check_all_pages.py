import os, subprocess, time, sys

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
PAGE_DIR = os.path.join(BASE, 'src', 'app', '[locale]')

# First start dev server
proc = subprocess.Popen(
    ['npx', 'next', 'dev', '-p', '3457'],
    cwd=BASE,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
    creationflags=subprocess.CREATE_NO_WINDOW
)

time.sleep(10)

tools = sorted([item for item in os.listdir(PAGE_DIR) if os.path.isfile(os.path.join(PAGE_DIR, item, 'page.js'))])

results = {}
for tool in tools:
    url = f'http://localhost:3457/en/{tool}'
    try:
        import urllib.request
        req = urllib.request.Request(url)
        resp = urllib.request.urlopen(req, timeout=10)
        status = resp.status
        body = resp.read().decode('utf-8', errors='replace')
        # Check for error indicators
        if status >= 400:
            results[tool] = f'{status} ERROR'
        elif 'error' in body[:500].lower() or 'not found' in body[:500].lower():
            results[tool] = f'{status} (error in body)'
        else:
            results[tool] = f'{status} OK'
    except Exception as e:
        results[tool] = f'FAIL: {str(e)[:60]}'
    print(f'  {tool:20s} -> {results[tool]}')

# Summary
ok = sum(1 for v in results.values() if 'OK' in v)
fail = sum(1 for v in results.values() if 'FAIL' in v or 'ERROR' in v or 'error in body' in v)
print(f'\nTotal: {len(tools)}, OK: {ok}, Issues: {fail}')
if fail > 0:
    print('Problematic:')
    for t, r in results.items():
        if 'FAIL' in r or 'ERROR' in r or 'error in body' in r:
            print(f'  {t}: {r}')

# Cleanup
proc.terminate()
proc.wait()