#!/usr/bin/env python3
"""Create message JSON files for the 43 restored tools in all 5 locales"""
import os, json

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']
RECOVERED_DIR = 'recovered/final_msgs'
MSGS_DIR = 'src/messages'

# The 43 restored tools
TOOLS = [
    'about', 'artillery', 'ascii-art', 'bac', 'base64', 'caseconverter', 'charcount',
    'checkers', 'color-contrast', 'colorpicker', 'cooking', 'creditcard', 'datasize',
    'diff', 'emoji', 'guide', 'hash', 'inflation', 'json', 'jwt', 'lorem',
    'markdown-preview', 'mbti', 'minesweeper', 'namegen', 'numberbase', 'pomodoro',
    'qreader', 'regex', 'roman', 'scientific-calc', 'solitaire', 'standard-deviation',
    'tarot', 'time-calc', 'timezone', 'typing-test', 'urlcode', 'uuid',
    'video-poker', 'whatismyip', 'zodiac'
]

def load_en_messages(tool):
    """Load English messages from recovered data"""
    fp = f'{RECOVERED_DIR}/{tool}.json'
    if os.path.exists(fp):
        with open(fp, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def create_messages():
    for tool in TOOLS:
        en_msgs = load_en_messages(tool)
        if not en_msgs:
            print(f'  ⚠️  No English messages for {tool}')
            # Create minimal messages
            en_msgs = {
                'title': tool.replace('-', ' ').title(),
                'seoDescription': f'{tool.replace("-", " ").title()} tool for quick calculations and conversions.',
                'footer': 'hello-tools 2026'
            }
        
        for loc in LOCALES:
            loc_dir = f'{MSGS_DIR}/{loc}'
            os.makedirs(loc_dir, exist_ok=True)
            
            if loc == 'en':
                msgs = en_msgs
            else:
                # Use English as fallback for other locales
                msgs = en_msgs.copy()
            
            # Ensure required keys exist
            if 'title' not in msgs:
                msgs['title'] = tool.replace('-', ' ').title()
            if 'seoDescription' not in msgs:
                msgs['seoDescription'] = f'{tool.replace("-", " ").title()} tool for quick calculations and conversions.'
            if 'footer' not in msgs:
                msgs['footer'] = 'hello-tools 2026'
            
            fp = f'{loc_dir}/{tool}.json'
            with open(fp, 'w', encoding='utf-8') as f:
                json.dump(msgs, f, ensure_ascii=False, indent=2)
            print(f'  ✅ {loc}/{tool}.json')

create_messages()
print('\nDone!')