import subprocess, os, sys

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
PAGE_DIR = os.path.join(BASE, 'src', 'app', '[locale]')

tools = sorted([item for item in os.listdir(PAGE_DIR) if os.path.isfile(os.path.join(PAGE_DIR, item, 'page.js'))])

# Exclude privacy (no en route needed)
results = {}
for tool in tools:
    url = f'https://oxoxox1.com/en/{tool}'
    try:
        result = subprocess.run(
            ['curl.exe', '-s', '-o', 'NUL', '-w', '%{http_code}'],
            input=url.encode(),
            capture_output=True,
            timeout=15,
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        # curl needs URL as argument, not stdin
        result = subprocess.run(
            ['curl.exe', '-s', '-o', 'NUL', '-w', '%{http_code}', url],
            capture_output=True,
            timeout=15,
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        status = result.stdout.decode().strip()
        if status == '000':
            results[tool] = f'000 (timeout/dns fail)'
        elif status.startswith('5'):
            results[tool] = f'{status} SERVER ERROR'
        elif status.startswith('4'):
            results[tool] = f'{status} CLIENT ERROR'
        elif status.startswith('2') or status.startswith('3'):
            results[tool] = f'{status} OK'
        else:
            results[tool] = f'{status} UNKNOWN'
    except subprocess.TimeoutExpired:
        results[tool] = 'TIMEOUT'
    except Exception as e:
        results[tool] = f'FAIL: {str(e)[:40]}'
    
    # Rate limit protection
    if tool != tools[-1]:
        import time
        time.sleep(0.3)
    
    print(f'  {tool:20s} -> {results[tool]}')

# Summary
ok = sum(1 for v in results.values() if 'OK' in v)
fail = sum(1 for v in results.values() if 'ERROR' in v or 'FAIL' in v or 'TIMEOUT' in v)
print(f'\n={"="*50}=')
print(f'Total: {len(tools)}, OK: {ok}, Issues: {fail}')
if fail > 0:
    print(f'\nProblematic pages:')
    for t, r in results.items():
        if 'ERROR' in r or 'FAIL' in r or 'TIMEOUT' in r or '000' in r:
            print(f'  /en/{t:20s} -> {r}')
else:
    print('All pages OK!')