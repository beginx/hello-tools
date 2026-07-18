#!/usr/bin/env python3
import json, os, re, subprocess, sys

MISSING_TOOLS = [
    'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker',
    'pomodoro', 'scientific-calc', 'ascii-art', 'base64', 'urlcode', 'uuid', 'hash',
    'jwt', 'json', 'regex', 'diff', 'lorem', 'markdown-preview', 'caseconverter',
    'charcount', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'numberbase',
    'roman', 'time-calc', 'timezone', 'datasize', 'standard-deviation', 'inflation',
    'creditcard', 'bac', 'cooking', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji',
    'about', 'guide'
]

# Try to extract schema.org data from each page using curl + grep
os.makedirs('recovered/meta', exist_ok=True)

for tool in MISSING_TOOLS:
    try:
        result = subprocess.run(
            ['curl', '-s', f'https://oxoxox1.com/en/{tool}'],
            capture_output=True, text=True, timeout=15
        )
        html = result.stdout
        
        # Extract schema.org JSON
        schema_match = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        if schema_match:
            schema_str = schema_match.group(1)
            # Unescape HTML entities
            schema_str = schema_str.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"')
            try:
                schema = json.loads(schema_str)
                name = schema.get('name', '')
                desc = schema.get('description', '')
                cat = schema.get('applicationCategory', '')
                print(f'✅ {tool}: {name[:60]}')
                with open(f'recovered/meta/{tool}.json', 'w') as f:
                    json.dump({'name': name, 'description': desc, 'category': cat}, f, indent=2)
            except json.JSONDecodeError as e:
                print(f'❌ {tool}: JSON parse error: {e}')
                with open(f'recovered/meta/{tool}_schema_raw.txt', 'w') as f:
                    f.write(schema_str[:2000])
        else:
            print(f'❌ {tool}: no schema found')
    except Exception as e:
        print(f'❌ {tool}: {e}')
