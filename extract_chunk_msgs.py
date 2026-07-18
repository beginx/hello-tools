#!/usr/bin/env python3
import json
import os
import re

# Tools and their chunk files
chunks = {
    'typing-test': 'chunks_07jm9wqg3b6wq.js',
    'solitaire': 'chunks_0w~2dpqg2-wo4.js',
    'minesweeper': 'chunks_001vr.g0eljfe.js',
    'checkers': 'chunks_0w~.exosunibe.js',
    'artillery': 'chunks_0xmcsnimk0bil.js',
    'video-poker': 'chunks_15a.bt-1d46e5.js',
    'pomodoro': 'chunks_0at2sxqs93g6d.js',
    'scientific-calc': 'chunks_0l6x-mky~p8qs.js',
    'ascii-art': 'chunks_0gljg957v-z~m.js',
    'base64': 'chunks_0mu2e-.x2aa7r.js',
    'urlcode': 'chunks_0ljb4xylbky8j.js',
    'uuid': 'chunks_10ef3p29fp9g9.js',
    'hash': 'chunks_028ewe8yd~8ch.js',
    'jwt': 'chunks_0kgpocvbu2q_e.js',
    'json-pretty': 'chunks_0j~0u2spyph_b.js',
    'regex': 'chunks_0j7-712dthay_.js',
    'diff': 'chunks_0p8~r6mp16~la.js',
    'lorem': 'chunks_0ueify3s5gmlz.js',
    'markdown-preview': 'chunks_0l~1-aojymxp3.js',
    'caseconverter': 'chunks_0_ex5snz.9qio.js',
    'charcount': 'chunks_0hb_f.jel13x_.js',
    'colorpicker': 'chunks_0z99m2-02wbub.js',
    'color-contrast': 'chunks_0s5074j3qcw3t.js',
    'qreader': 'chunks_08_fyfg4___fi.js',
    'namegen': 'chunks_0_-o2kjbftdh-.js',
    'numberbase': 'chunks_1213q37t_h470.js',
    'roman': 'chunks_0~xl6apvi0.6~.js',
    'time-calc': 'chunks_0yxz1ob19vm2f.js',
    'timezone': 'chunks_0lniz6m2.n6ww.js',
    'datasize': 'chunks_010bsef46pc~7.js',
    'standard-deviation': 'chunks_0t7q3225tt3~d.js',
    'inflation': 'chunks_0hyc~7x89t8bf.js',
    'creditcard': 'chunks_02wjz-3-q_qe4.js',
    'bac': 'chunks_0opb5u6u505y4.js',
    'cooking': 'chunks_08rw_.9nqu.1f.js',
    'whatismyip': 'chunks_0rb8a8zxchcet.js',
    'mbti': 'chunks_0dma7vrrlcihs.js',
    'zodiac': 'chunks_029tg.njun3fi.js',
    'tarot': 'chunks_16pf7v_b7gmmk.js',
    'emoji': 'chunks_0s6izs-58ob1_.js',
}

# Actually, let's first check what tools exist and their correct chunk mappings
# by examining the live pages
import subprocess
import sys

out_dir = 'recovered/final_msgs'
os.makedirs(out_dir, exist_ok=True)

for tool, chunk_file in sorted(chunks.items()):
    filepath = f'recovered/chunks/{chunk_file}'
    if not os.path.exists(filepath):
        print(f'{tool}: chunk file not found')
        continue
    
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    # Find JS object literal like: {title:"...",key:"value",...}
    # The message object is usually near the beginning of the chunk
    # Pattern: look for the first large object with message-like keys
    
    # Strategy: find known message keys
    known_keys = ['title', 'seoDescription', 'footer', 'subtitle', 'placeholder',
                  'calculate', 'clear', 'result', 'copy', 'error', 'howToUse',
                  'selectLang', 'english', 'korean', 'start', 'reset', 'wpm',
                  'accuracy', 'generate', 'newGame', 'deal', 'hit', 'stand']
    
    messages = {}
    
    # Find all JS object property assignments: key:"value" or key:'value'
    patterns = [
        (r'([a-zA-Z]+):"((?:[^"\\]|\\.)*)"', lambda m: (m.group(1), m.group(2))),
        (r"([a-zA-Z]+):'((?:[^'\\]|\\.)*)'", lambda m: (m.group(1), m.group(2))),
    ]
    
    for pattern, extractor in patterns:
        for match in re.finditer(pattern, content):
            key, value = extractor(match)
            # Filter: only message-like keys (lowercase starts, not css/dom stuff)
            if key in known_keys or (key[0].islower() and len(key) > 2 and not key.startswith('os9') 
                and not key.startswith('solitaire') and key not in ['none', 'default', 'pointer',
                'block', 'flex', 'grid', 'inline', 'hidden', 'absolute', 'relative', 'fixed',
                'center', 'left', 'right', 'top', 'bottom', 'auto', 'px', 'rem', 'em',
                'maxWidth', 'minWidth', 'width', 'height', 'color', 'background', 'border',
                'margin', 'padding', 'fontSize', 'fontWeight', 'lineHeight', 'textAlign',
                'whiteSpace', 'overflow', 'display', 'position', 'zIndex', 'opacity',
                'transform', 'transition', 'animation', 'cursor', 'userSelect',
                'borderRadius', 'boxShadow', 'textShadow', 'letterSpacing']):
                # Decode unicode escapes
                val = value.replace('\\u0026', '&').replace('\\u0027', "'").replace('\\u003c', '<').replace('\\u003e', '>')
                messages[key] = val
    
    if messages:
        # Save
        filepath = f'{out_dir}/{tool}.json'
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(messages, f, indent=2, ensure_ascii=False)
        print(f'✅ {tool}: {len(messages)} keys -> {list(messages.keys())[:10]}...')
    else:
        print(f'❌ {tool}: no messages found')
        # Debug: show what's in the first 500 chars
        print(f'   Content preview: {content[:200]}')
