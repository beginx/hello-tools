#!/usr/bin/env python3
"""Restore all 43 missing tools from extracted data"""
import json, os, shutil

BASE = 'src'
LOCALES = ['en', 'es', 'zh', 'ko', 'pt']

# All 43 tools to restore
TOOLS = [
    'typing-test', 'solitaire', 'minesweeper', 'checkers', 'artillery', 'video-poker',
    'pomodoro', 'scientific-calc', 'ascii-art', 'base64', 'urlcode', 'uuid', 'hash',
    'jwt', 'json', 'regex', 'diff', 'lorem', 'markdown-preview', 'caseconverter',
    'charcount', 'colorpicker', 'color-contrast', 'qreader', 'namegen', 'numberbase',
    'roman', 'time-calc', 'timezone', 'datasize', 'standard-deviation', 'inflation',
    'creditcard', 'bac', 'cooking', 'whatismyip', 'mbti', 'zodiac', 'tarot', 'emoji',
    'about', 'guide'
]

# Schema.org metadata extracted from live pages
META = {
    'typing-test': {'name': 'Typing Speed Test - WPM & Accuracy Online | Korean 한글 타자', 'cat': 'EducationApplication'},
    'solitaire': {'name': 'Solitaire - Klondike Card Game Online', 'cat': 'GameApplication'},
    'minesweeper': {'name': 'Minesweeper - Classic Puzzle Game Online', 'cat': 'GameApplication'},
    'checkers': {'name': 'Checkers - Draughts Game Online | Play vs AI', 'cat': 'GameApplication'},
    'artillery': {'name': 'Cannon Duel - Artillery Game Online', 'cat': 'GameApplication'},
    'video-poker': {'name': 'Video Poker - Jacks or Better Casino Game', 'cat': 'GameApplication'},
    'pomodoro': {'name': 'Pomodoro Timer - Focus & Break Timer', 'cat': 'UtilitiesApplication'},
    'scientific-calc': {'name': 'Scientific Calculator - Trig, Log, Powers', 'cat': 'UtilitiesApplication'},
    'ascii-art': {'name': 'ASCII Art Generator - Text to ASCII Art', 'cat': 'EntertainmentApplication'},
    'base64': {'name': 'Base64 Encoder/Decoder - Encode & Decode Online', 'cat': 'DeveloperApplication'},
    'urlcode': {'name': 'URL Encoder/Decoder - Encode & Decode URLs', 'cat': 'DeveloperApplication'},
    'uuid': {'name': 'UUID Generator - Generate Unique IDs', 'cat': 'DeveloperApplication'},
    'hash': {'name': 'Hash Generator - MD5, SHA-256, SHA-512', 'cat': 'DeveloperApplication'},
    'jwt': {'name': 'JWT Decoder - Decode JSON Web Tokens', 'cat': 'DeveloperApplication'},
    'json': {'name': 'JSON Formatter & Validator - Pretty Print JSON', 'cat': 'DeveloperApplication'},
    'regex': {'name': 'Regex Tester - Test Regular Expressions Online', 'cat': 'DeveloperApplication'},
    'diff': {'name': 'Text Diff Checker - Compare Text Online', 'cat': 'DeveloperApplication'},
    'lorem': {'name': 'Lorem Ipsum Generator - Placeholder Text', 'cat': 'UtilitiesApplication'},
    'markdown-preview': {'name': 'Markdown Preview - Markdown Editor & Preview', 'cat': 'DeveloperApplication'},
    'caseconverter': {'name': 'Case Converter - UPPERCASE, lowercase, Title Case', 'cat': 'UtilitiesApplication'},
    'charcount': {'name': 'Character Counter - Count Letters, Words & Lines', 'cat': 'UtilitiesApplication'},
    'colorpicker': {'name': 'Color Picker & Converter - HEX, RGB, HSL', 'cat': 'UtilitiesApplication'},
    'color-contrast': {'name': 'Color Contrast Checker - WCAG Accessibility', 'cat': 'DeveloperApplication'},
    'qreader': {'name': 'QR Code Reader - Scan QR Codes Online', 'cat': 'UtilitiesApplication'},
    'namegen': {'name': 'Name Generator - Random Name Generator', 'cat': 'EntertainmentApplication'},
    'numberbase': {'name': 'Number Base Converter - Binary, Hex, Octal', 'cat': 'UtilitiesApplication'},
    'roman': {'name': 'Roman Numeral Converter - Convert Numbers', 'cat': 'UtilitiesApplication'},
    'time-calc': {'name': 'Time Calculator - Add & Subtract Time', 'cat': 'UtilitiesApplication'},
    'timezone': {'name': 'Timezone Converter - World Clock & Time Converter', 'cat': 'UtilitiesApplication'},
    'datasize': {'name': 'Data Size Converter - Bytes, KB, MB, GB', 'cat': 'UtilitiesApplication'},
    'standard-deviation': {'name': 'Standard Deviation Calculator - Statistics', 'cat': 'EducationApplication'},
    'inflation': {'name': 'Inflation Calculator - Calculate Inflation Rate', 'cat': 'FinanceApplication'},
    'creditcard': {'name': 'Credit Card Payoff Calculator - Debt Repayment', 'cat': 'FinanceApplication'},
    'bac': {'name': 'BAC Calculator - Blood Alcohol Content', 'cat': 'HealthApplication'},
    'cooking': {'name': 'Cooking Measurement Converter - Recipe Converter', 'cat': 'UtilitiesApplication'},
    'whatismyip': {'name': 'What Is My IP? - Check Public IP Address', 'cat': 'UtilitiesApplication'},
    'mbti': {'name': 'MBTI Personality Test - 16 Types', 'cat': 'EntertainmentApplication'},
    'zodiac': {'name': 'Chinese Zodiac Calculator - Find Your Sign', 'cat': 'EntertainmentApplication'},
    'tarot': {'name': 'Tarot Card Reading - Single & 3-Card Spread', 'cat': 'EntertainmentApplication'},
    'emoji': {'name': 'Emoji Picker - Search & Copy Emojis', 'cat': 'UtilitiesApplication'},
    'about': {'name': 'About hello-tools - Free Online Tools', 'cat': 'UtilitiesApplication'},
    'guide': {'name': 'Guides & Tutorials - How to Use hello-tools', 'cat': 'UtilitiesApplication'},
}

# ========== STEP 1: Restore message JSON files ==========
print("=== STEP 1: Restoring message JSON files ===")

for tool in TOOLS:
    extracted_dir = f'recovered/msg_all/{tool}'
    
    # Check if we have extracted messages
    has_extracted = os.path.isdir(extracted_dir)
    
    for locale in LOCALES:
        msg_dir = f'{BASE}/messages/{locale}'
        os.makedirs(msg_dir, exist_ok=True)
        dst = f'{msg_dir}/{tool}.json'
        
        if has_extracted:
            src = f'{extracted_dir}/{locale}.json'
            if os.path.exists(src):
                # Copy as-is
                shutil.copy2(src, dst)
                continue
        
        # Fallback: check if we have English from earlier extraction
        if has_extracted:
            src_en = f'{extracted_dir}/en.json'
            if os.path.exists(src_en):
                shutil.copy2(src_en, dst)
                print(f'  ⚠️ {tool}/{locale}: fallback EN')
                continue
        
        # Last resort: create minimal message file
        meta = META.get(tool, {})
        name = meta.get('name', tool.replace('-', ' ').title())
        msgs = {
            'title': name.split(' - ')[0] if ' - ' in name else name,
            'seoDescription': f'Free online {tool.replace("-", " ")} tool.',
            'footer': 'hello-tools 2026'
        }
        with open(dst, 'w', encoding='utf-8') as f:
            json.dump(msgs, f, indent=2, ensure_ascii=False)
        print(f'  ❌ {tool}/{locale}: minimal created')

print("Message files restored!")

# ========== STEP 2: Create page directories ==========
print("\n=== STEP 2: Creating page directories ===")
for tool in TOOLS:
    dir_path = f'{BASE}/app/[locale]/{tool}'
    os.makedirs(dir_path, exist_ok=True)
    print(f'  📁 {tool}')

# ========== STEP 3: Generate metadata.js files ==========
print("\n=== STEP 3: Generating metadata.js ===")

for tool in TOOLS:
    meta = META.get(tool, {})
    name_en = meta.get('name', tool)
    cat = meta.get('cat', 'UtilitiesApplication')
    
    # Build locale-specific titles
    titles_js = {}
    for locale in LOCALES:
        titles_js[locale] = name_en
    
    # Build locale descriptions from messages if available
    descs_js = {}
    for locale in LOCALES:
        msg_file = f'{BASE}/messages/{locale}/{tool}.json'
        if os.path.exists(msg_file):
            with open(msg_file, encoding='utf-8') as f:
                msgs = json.load(f)
            desc = msgs.get('seoDescription', name_en)
            descs_js[locale] = desc
        else:
            descs_js[locale] = name_en
    
    # Generate metadata.js
    lines = ['export default async function generateMetadata({ params }) {']
    lines.append('  const { locale } = await params;')
    lines.append('  const titles = {')
    for locale in LOCALES:
        lines.append(f"    '{locale}': {json.dumps(titles_js[locale], ensure_ascii=False)},")
    lines.append('  };')
    lines.append('  const descs = {')
    for locale in LOCALES:
        desc = descs_js.get(locale, descs_js.get('en', ''))
        lines.append(f"    '{locale}': {json.dumps(desc, ensure_ascii=False)},")
    lines.append('  };')
    lines.append('  const title = titles[locale] || titles.en;')
    lines.append('  const description = descs[locale] || descs.en;')
    lines.append('  return {')
    lines.append('    title,')
    lines.append('    description,')
    lines.append('    openGraph: { title, description, type: \'website\', url: `https://oxoxox1.com/${locale}/' + tool + '` },')
    lines.append('    alternates: { canonical: `https://oxoxox1.com/${locale}/' + tool + '` },')
    lines.append('  };')
    lines.append('}')
    
    with open(f'{BASE}/app/[locale]/{tool}/metadata.js', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f'  📝 {tool}/metadata.js')

# ========== STEP 4: Generate page.js files ==========
print("\n=== STEP 4: Generating page.js ===")

# Template for a simple page with just SEO content (about, guide)
SIMPLE_TEMPLATE = ''''use client';

import { useParams } from 'next/navigation';
import enMsgs from '../../../messages/en/{tool}.json';
import esMsgs from '../../../messages/es/{tool}.json';
import zhMsgs from '../../../messages/zh/{tool}.json';
import koMsgs from '../../../messages/ko/{tool}.json';
import ptMsgs from '../../../messages/pt/{tool}.json';
const pageMsgs = {{ en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs }};

export default function {name}Page() {{
  const params = useParams();
  const locale = params?.locale || 'en';
  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;
  const changeLang = (l) => {{ window.location.href = '/' + l + '/{tool}'; }};

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: 'var(--os9-bg)' }}>
      <div className="os9-window" style={{ maxWidth: 680, width: '100%' }}>
        <div className="os9-titlebar relative">
          <div className="os9-window-controls">
            <div className="os9-dot os9-dot-close" />
            <div className="os9-dot os9-dot-minimize" />
            <div className="os9-dot os9-dot-zoom" />
          </div>
          <span className="tracking-[0.5px] text-sm">{{t('title')}}</span>
        </div>
        <div className="os9-window-body">
          <div className="flex justify-between items-center mb-4">
            <select className="os9-select !w-auto text-sm" value={{locale}} onChange={{(e) => changeLang(e.target.value)}}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <p className="text-sm whitespace-pre-line" style={{ opacity: 0.85, lineHeight: 1.6 }}>{{t('seoDescription')}}</p>
        </div>
      </div>
      <div className="os9-footer" style={{ maxWidth: 680, width: '100%' }}>
        <a href={{'/' + locale}} className="underline" style={{ opacity: 0.7 }}>Home</a>
        <span className="mx-2">|</span>
        {{t('footer')}}
      </div>
    </div>
  );
}}
'''

# Tools that should get the simple template (SEO-only)
SIMPLE_TOOLS = ['about', 'guide']

for tool in TOOLS:
    name_camel = ''.join(word.capitalize() for word in tool.replace('-', ' ').split())
    
    if tool in SIMPLE_TOOLS:
        filepath = f'{BASE}/app/[locale]/{tool}/page.js'
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"'use client';\n\n")
            f.write(f"import {{ useParams }} from 'next/navigation';\n")
            for loc in LOCALES:
                f.write(f"import {loc}Msgs from '../../../messages/{loc}/{tool}.json';\n")
            f.write(f"const pageMsgs = {{ en: enMsgs, es: esMsgs, zh: zhMsgs, ko: koMsgs, pt: ptMsgs }};\n\n")
            f.write(f"export default function {name_camel}Page() {{\n")
            f.write(f"  const params = useParams();\n")
            f.write(f"  const locale = params?.locale || 'en';\n")
            f.write(f"  const t = (k) => (pageMsgs[locale] || pageMsgs.en)[k] || k;\n")
            f.write(f"  const changeLang = (l) => {{ window.location.href = '/' + l + '/{tool}'; }};\n\n")
            f.write(f"  return (\n")
            f.write(f"    <div className=\\

print("\n=== Restoration complete! ===")
print(f"Message files created for {len(TOOLS)} tools x 5 locales")
print(f"Metadata files created for {len(TOOLS)} tools")
print()
print("NOTE: page.js files for interactive tools need manual implementation.")
print("The following tools need custom page.js:")
for t in TOOLS:
    if t not in SIMPLE_TOOLS:
        print(f"  - {t}")
