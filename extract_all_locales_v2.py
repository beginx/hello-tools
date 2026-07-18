#!/usr/bin/env python3
import json, os, re, subprocess

# The 43 missing tools and their chunk files
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

# The locales in the order they appear in the chunks (based on analysis)
# Each chunk has 5 s.exports blocks, one per locale
LOCALE_ORDER = ['en', 'zh', 'es', 'ko', 'pt']

def extract_exports(content):
    """Split a chunk into individual s.exports={...} blocks"""
    blocks = []
    pos = 0
    while True:
        start = content.find('s.exports={', pos)
        if start == -1:
            break
        start += len('s.exports=')
        # Find matching closing brace
        depth = 0
        in_str = False
        escaped = False
        end = start
        for i in range(start, len(content)):
            ch = content[i]
            if escaped:
                escaped = False
                continue
            if ch == '\\' and in_str:
                escaped = True
                continue
            if ch == '"':
                in_str = not in_str
                continue
            if not in_str:
                if ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        break
        block = content[start:end]
        blocks.append(block)
        pos = end
    return blocks

def parse_js_object(js_str):
    """Parse a JS object literal like {key:"value",key2:"value2"}"""
    # Convert to JSON by quoting keys
    # Pattern: {key:"value",key2:"value2",...}
    result = {}
    
    # Remove outer braces
    inner = js_str.strip()
    if inner.startswith('{') and inner.endswith('}'):
        inner = inner[1:-1]
    
    # Parse key-value pairs
    # Pattern: key:"value" or key:'value' or key:number or key:{...}
    i = 0
    while i < len(inner):
        # Skip whitespace and commas
        while i < len(inner) and inner[i] in ' \t\n\r,':
            i += 1
        if i >= len(inner):
            break
        
        # Read key
        key_match = re.match(r'([a-zA-Z_$][a-zA-Z0-9_$]*)', inner[i:])
        if not key_match:
            i += 1
            continue
        
        key = key_match.group(1)
        i += len(key)
        
        # Skip :
        while i < len(inner) and inner[i] in ' \t\n\r':
            i += 1
        if i < len(inner) and inner[i] == ':':
            i += 1
        
        # Skip whitespace
        while i < len(inner) and inner[i] in ' \t\n\r':
            i += 1
        
        # Read value
        if i < len(inner) and inner[i] == '"':
            # String value with double quotes
            i += 1
            val_parts = []
            while i < len(inner):
                if inner[i] == '\\':
                    i += 1
                    if i < len(inner):
                        val_parts.append(inner[i])
                        i += 1
                elif inner[i] == '"':
                    i += 1
                    break
                else:
                    val_parts.append(inner[i])
                    i += 1
            result[key] = ''.join(val_parts)
        elif i < len(inner) and inner[i] == "'":
            # String value with single quotes
            i += 1
            val_parts = []
            while i < len(inner):
                if inner[i] == '\\':
                    i += 1
                    if i < len(inner):
                        val_parts.append(inner[i])
                        i += 1
                elif inner[i] == "'":
                    i += 1
                    break
                else:
                    val_parts.append(inner[i])
                    i += 1
            result[key] = ''.join(val_parts)
        elif i < len(inner) and (inner[i].isdigit() or inner[i] == '-'):
            # Number
            num_match = re.match(r'-?\d+(\.\d+)?', inner[i:])
            if num_match:
                num_str = num_match.group()
                result[key] = float(num_str) if '.' in num_str else int(num_str)
                i += len(num_str)
        elif i < len(inner) and inner[i] == '{':
            # Nested object - skip it
            depth = 1
            i += 1
            while i < len(inner) and depth > 0:
                if inner[i] == '{': depth += 1
                elif inner[i] == '}': depth -= 1
                i += 1
        elif i < len(inner) and inner[i] == '[':
            # Array - skip it
            depth = 1
            i += 1
            while i < len(inner) and depth > 0:
                if inner[i] == '[': depth += 1
                elif inner[i] == ']': depth -= 1
                i += 1
        else:
            # Boolean, null, undefined
            for kw in ['true', 'false', 'null', 'undefined']:
                if inner[i:i+len(kw)] == kw:
                    result[key] = kw
                    i += len(kw)
                    break
            else:
                i += 1
    
    return result

# Extract messages for all tools
out_dir = 'recovered/msg_all'
os.makedirs(out_dir, exist_ok=True)

tools_with_names = {
    'typing-test': 'typing-test',
    'solitaire': 'solitaire', 
    'minesweeper': 'minesweeper',
    'checkers': 'checkers',
    'artillery': 'artillery',
    'video-poker': 'video-poker',
    'pomodoro': 'pomodoro',
    'scientific-calc': 'scientific-calc',
    'ascii-art': 'ascii-art',
    'base64': 'base64',
    'urlcode': 'urlcode',
    'uuid': 'uuid',
    'hash': 'hash',
    'jwt': 'jwt',
    'json': 'json-pretty',
    'regex': 'regex',
    'diff': 'diff',
    'lorem': 'lorem',
    'markdown-preview': 'markdown-preview',
    'caseconverter': 'caseconverter',
    'charcount': 'charcount',
    'colorpicker': 'colorpicker',
    'color-contrast': 'color-contrast',
    'qreader': 'qreader',
    'namegen': 'namegen',
    'numberbase': 'numberbase',
    'roman': 'roman',
    'time-calc': 'time-calc',
    'timezone': 'timezone',
    'datasize': 'datasize',
    'standard-deviation': 'standard-deviation',
    'inflation': 'inflation',
    'creditcard': 'creditcard',
    'bac': 'bac',
    'cooking': 'cooking',
    'whatismyip': 'whatismyip',
    'mbti': 'mbti',
    'zodiac': 'zodiac',
    'tarot': 'tarot',
    'emoji': 'emoji',
}

total = 0
for tool, chunk_key in sorted(tools_with_names.items()):
    chunk_file = chunks.get(chunk_key)
    if not chunk_file:
        print(f'{tool}: no chunk file mapping')
        continue
    
    filepath = f'recovered/chunks/{chunk_file}'
    if not os.path.exists(filepath):
        print(f'{tool}: chunk file not found: {chunk_file}')
        continue
    
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    blocks = extract_exports(content)
    
    # The first 5 blocks are the 5 locale message objects
    locale_msgs = {}
    for idx, block in enumerate(blocks[:5]):
        if idx < len(LOCALE_ORDER):
            locale = LOCALE_ORDER[idx]
            if len(block) > 10:  # meaningful content
                parsed = parse_js_object(block)
                if parsed and len(parsed) > 5:  # at least 5 keys = real messages
                    locale_msgs[locale] = parsed
    
    if locale_msgs:
        tool_dir = f'{out_dir}/{tool}'
        os.makedirs(tool_dir, exist_ok=True)
        
        for locale in LOCALE_ORDER:
            if locale in locale_msgs:
                filepath = f'{tool_dir}/{locale}.json'
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(locale_msgs[locale], f, indent=2, ensure_ascii=False)
                count = len(locale_msgs[locale])
                print(f'✅ {tool}/{locale}: {count} keys')
                total += 1
            else:
                # Copy English as fallback
                if 'en' in locale_msgs:
                    filepath = f'{tool_dir}/{locale}.json'
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(locale_msgs['en'], f, indent=2, ensure_ascii=False)
                    print(f'⚠️ {tool}/{locale}: fallback to EN ({len(locale_msgs["en"])} keys)')
                    total += 1
    else:
        print(f'❌ {tool}: no message blocks found')

print(f'\nTotal message files created: {total}')

# Also handle about, guide (if they have chunks we missed)
for extra in ['about', 'guide']:
    print(f'{extra}: needs special handling (probably no dedicated chunk)')
