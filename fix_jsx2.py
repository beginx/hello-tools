#!/usr/bin/env python3
"""Fix JSX style syntax issues - properly"""
import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the triple braces issue: style={{ maxWidth: 520, width: '100%' }}} > -> style={{ maxWidth: 520, width: '100%' }}>
    content = content.replace("style={{ maxWidth: 520, width: '100%' }}} >", "style={{ maxWidth: 520, width: '100%' }}>")
    content = content.replace("style={{ maxWidth: 600, width: '100%' }}} >", "style={{ maxWidth: 600, width: '100%' }}>")
    
    # Also fix any remaining double-close issues
    content = content.replace("width: '100%' }}}", "width: '100%' }}")
    content = content.replace("width: '100%' } }", "width: '100%' }}")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed: {filepath}")

files = [
    'src/app/[locale]/artillery/page.js',
    'src/app/[locale]/ascii-art/page.js',
    'src/app/[locale]/checkers/page.js',
    'src/app/[locale]/color-contrast/page.js',
    'src/app/[locale]/colorpicker/page.js',
    'src/app/[locale]/markdown-preview/page.js',
    'src/app/[locale]/minesweeper/page.js',
    'src/app/[locale]/namegen/page.js',
    'src/app/[locale]/pomodoro/page.js',
    'src/app/[locale]/qreader/page.js',
    'src/app/[locale]/regex/page.js',
    'src/app/[locale]/scientific-calc/page.js',
    'src/app/[locale]/solitaire/page.js',
    'src/app/[locale]/typing-test/page.js',
    'src/app/[locale]/video-poker/page.js',
]

for f in files:
    fix_file(f)

print("\nDone!")