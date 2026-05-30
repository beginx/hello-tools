import json, sys, subprocess

result = subprocess.run(
    ['curl.exe', '-s', 'https://api.github.com/repos/beginx0/hw0505/commits/7d3b154'],
    capture_output=True, timeout=15
)
d = json.loads(result.stdout)
sha = d.get('sha', '?')[:12] if d.get('sha') else '?'
author = d.get('commit', {}).get('author', {}).get('name', '?')
date = d.get('commit', {}).get('author', {}).get('date', '?')
print(f'Commit: {sha}')
print(f'Author: {author}')
print(f'Date: {date}')
print(f'Message: {d.get("commit",{}).get("message","?").split(chr(10))[0]}')