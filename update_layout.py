#!/usr/bin/env python3
"""Update layout.js with 43 new tools in tools object and toolMap"""
import re

# Read current layout.js
with open('src/app/[locale]/layout.js', 'r', encoding='utf-8') as f:
    content = f.read()

# New tools to add (English definitions)
new_tools_en = {
    'base64': { 'name': 'Base64 Encoder/Decoder - Encode & Decode Text', 'desc': 'Free online Base64 encoder and decoder: encode text to Base64 or decode Base64 strings back to text. Supports UTF-8 encoding. Perfect for developers, APIs, and data encoding. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'urlcode': { 'name': 'URL Encoder/Decoder - Percent Encoding', 'desc': 'Free online URL encoder and decoder: encode special characters in URLs or decode percent-encoded strings. Perfect for web developers and API testing. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'uuid': { 'name': 'UUID Generator - Generate UUID v4', 'desc': 'Free online UUID generator: generate Version 4 UUIDs (Universally Unique Identifiers) in bulk. Cryptographically secure random UUIDs for databases, APIs, and distributed systems. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'hash': { 'name': 'Hash Generator - SHA-256, SHA-512, SHA-1', 'desc': 'Free online hash generator: generate SHA-256, SHA-512, SHA-1 hashes from text input. Secure cryptographic hashing for passwords, data integrity, and verification. Mac OS 9 retro style.', 'cat': 'SecurityApplication' },
    'jwt': { 'name': 'JWT Decoder - Decode JSON Web Tokens', 'desc': 'Free online JWT decoder: decode JSON Web Tokens to view header and payload. Debug and verify JWT tokens instantly. No data sent to server. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication, SecurityApplication' },
    'json': { 'name': 'JSON Formatter - Format & Minify JSON', 'desc': 'Free online JSON formatter: format, beautify, and minify JSON data. Validates JSON syntax and highlights errors. Perfect for developers and API debugging. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'numberbase': { 'name': 'Number Base Converter - Binary, Octal, Decimal, Hex', 'desc': 'Free online number base converter: convert between binary, octal, decimal, and hexadecimal. Supports large numbers and batch conversion. Perfect for programmers and students. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'roman': { 'name': 'Roman Numeral Converter - Numbers to Roman', 'desc': 'Free online Roman numeral converter: convert numbers to Roman numerals and vice versa. Supports numbers 1-3999. Perfect for students, historians, and date conversion. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'caseconverter': { 'name': 'Case Converter - Uppercase, Lowercase, Title Case', 'desc': 'Free online case converter: convert text to UPPERCASE, lowercase, Title Case, tOGGLE cASE, and InVeRsE. Instant text case transformation. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'charcount': { 'name': 'Character Counter - Count Characters, Words, Lines', 'desc': 'Free online character counter: count characters, words, lines, and paragraphs in text. Real-time counting with character limit tracking. Perfect for writers, students, and social media. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'lorem': { 'name': 'Lorem Ipsum Generator - Placeholder Text', 'desc': 'Free online Lorem Ipsum generator: generate placeholder text for design and development. Customizable paragraphs, words, and characters. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'diff': { 'name': 'Diff Checker - Compare Text Differences', 'desc': 'Free online diff checker: compare two texts and highlight differences. Side-by-side and inline diff views. Perfect for code review, document comparison, and version control. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'datasize': { 'name': 'Data Size Converter - Bytes, KB, MB, GB, TB', 'desc': 'Free online data size converter: convert between bytes, KB, MB, GB, TB, and PB. Accurate binary and decimal conversions. Perfect for storage planning and bandwidth calculation. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'standard-deviation': { 'name': 'Standard Deviation Calculator - Population & Sample', 'desc': 'Free online standard deviation calculator: calculate population and sample standard deviation, variance, mean, and sum. Enter comma-separated numbers. Mac OS 9 retro style.', 'cat': 'EducationApplication' },
    'inflation': { 'name': 'Inflation Calculator - CPI & Historical Value', 'desc': 'Free online inflation calculator: calculate the purchasing power of money over time using US CPI data. See how inflation affects your savings and investments. Mac OS 9 retro style.', 'cat': 'FinanceApplication' },
    'bac': { 'name': 'BAC Calculator - Blood Alcohol Content', 'desc': 'Free online BAC calculator: estimate your Blood Alcohol Content based on weight, gender, drinks consumed, and time elapsed. For educational purposes only. Mac OS 9 retro style.', 'cat': 'HealthApplication' },
    'creditcard': { 'name': 'Credit Card Payoff Calculator - Debt Repayment', 'desc': 'Free online credit card payoff calculator: calculate months to pay off credit card debt and total interest paid. Plan your debt-free journey. Mac OS 9 retro style.', 'cat': 'FinanceApplication' },
    'time-calc': { 'name': 'Time Calculator - Add/Subtract Hours & Minutes', 'desc': 'Free online time calculator: add or subtract hours and minutes. Calculate time durations and intervals. Perfect for work schedules and time tracking. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'cooking': { 'name': 'Cooking Converter - Cups, Tablespoons, ml, oz', 'desc': 'Free online cooking converter: convert between cups, tablespoons, teaspoons, milliliters, liters, fluid ounces, and pints. Perfect for recipe scaling. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'timezone': { 'name': 'Time Zone Converter - World Time Conversion', 'desc': 'Free online time zone converter: convert time between world time zones. Supports major cities and UTC offsets. Perfect for scheduling international meetings. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'whatismyip': { 'name': 'What Is My IP - Public IP Address Lookup', 'desc': 'Free online IP address lookup: see your public IP address, location, and ISP. No tracking, no logs. Instant IP detection. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'mbti': { 'name': 'MBTI Personality Test - 16 Personalities', 'desc': 'Free online MBTI personality test: discover your Myers-Briggs personality type. 8 questions based on Jungian psychology. Mac OS 9 retro style.', 'cat': 'EducationApplication' },
    'zodiac': { 'name': 'Zodiac Sign Calculator - Find Your Star Sign', 'desc': 'Free online zodiac sign calculator: find your Western zodiac sign by birth date. Includes dates, symbols, and characteristics for all 12 signs. Mac OS 9 retro style.', 'cat': 'EntertainmentApplication' },
    'tarot': { 'name': 'Tarot Card Reading - Free Daily Card', 'desc': 'Free online tarot card reading: draw a random tarot card for daily guidance. 22 Major Arcana cards with upright and reversed meanings. Mac OS 9 retro style.', 'cat': 'EntertainmentApplication' },
    'emoji': { 'name': 'Emoji Picker - Copy & Paste Emojis', 'desc': 'Free online emoji picker: browse and copy 300+ emojis. Search by keyword, categorize by type. One-click copy to clipboard. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'pomodoro': { 'name': 'Pomodoro Timer - Focus & Productivity Timer', 'desc': 'Free online Pomodoro timer: 25/5 minute work/break cycles. Customizable intervals, session tracking, and sound notifications. Boost your productivity. Mac OS 9 retro style.', 'cat': 'ProductivityApplication' },
    'scientific-calc': { 'name': 'Scientific Calculator - Functions & Constants', 'desc': 'Free online scientific calculator: trigonometric functions (sin, cos, tan), logarithms (ln, log), constants (π, e), powers, parentheses. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'ascii-art': { 'name': 'ASCII Art Generator - Text to ASCII Art', 'desc': 'Free online ASCII art generator: convert text to ASCII art banners. Multiple font styles: standard, slant, banner, small. Perfect for terminal headers and code comments. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'regex': { 'name': 'Regex Tester - Test Regular Expressions', 'desc': 'Free online regex tester: test regular expressions with real-time matching. Supports JavaScript regex syntax with flags. Highlights matches and capture groups. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'markdown-preview': { 'name': 'Markdown Preview - Live Markdown Editor', 'desc': 'Free online Markdown preview: write Markdown and see live HTML preview. Supports headings, bold, italic, code, lists, and links. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'colorpicker': { 'name': 'Color Picker - HEX, RGB, HSL Converter', 'desc': 'Free online color picker: pick colors visually and convert between HEX, RGB, and HSL formats. HSV color wheel with saturation/value picker. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'color-contrast': { 'name': 'Color Contrast Checker - WCAG AA/AAA Compliance', 'desc': 'Free online color contrast checker: test foreground/background color combinations for WCAG 2.1 AA and AAA compliance. Real-time contrast ratio calculation. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'qreader': { 'name': 'QR Code Reader - Scan QR Codes from Image', 'desc': 'Free online QR code reader: upload an image to decode QR codes. Supports various QR code formats. No camera required. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'namegen': { 'name': 'Name Generator - Fantasy, Sci-Fi, Realistic Names', 'desc': 'Free online name generator: generate fantasy names, sci-fi names, realistic names, Japanese names, and business names. Perfect for writers, gamers, and creators. Mac OS 9 retro style.', 'cat': 'EntertainmentApplication' },
    'typing-test': { 'name': 'Typing Test - WPM & Accuracy', 'desc': 'Free online typing test: measure your words per minute (WPM) and accuracy. Timed tests (15/30/60s) and word-count tests. Real-time feedback. Mac OS 9 retro style.', 'cat': 'EducationApplication' },
    'solitaire': { 'name': 'Solitaire - Classic Klondike Card Game', 'desc': 'Free online Solitaire (Klondike): play the classic card game in your browser. Drag and drop, auto-complete, undo, and score tracking. Mac OS 9 retro style.', 'cat': 'EntertainmentApplication' },
    'minesweeper': { 'name': 'Minesweeper - Classic Puzzle Game', 'desc': 'Free online Minesweeper: clear the minefield without detonating mines. Three difficulties (Easy/Medium/Hard), flagging, and timer. Mac OS 9 retro style.', 'cat': 'EntertainmentApplication' },
    'checkers': { 'name': 'Checkers - Play vs Computer', 'desc': 'Free online Checkers (Draughts): play against a simple AI. Standard 8x8 board, king pieces, forced captures. Mac OS 9 retro style.', 'cat': 'EntertainmentApplication' },
    'artillery': { 'name': 'Artillery Game - Turn-Based Tank Battle', 'desc': 'Free online Artillery game: two-player tank battle with angle and power controls. Procedural terrain, wind effects, and projectile physics. Mac OS 9 retro style.', 'cat': 'EntertainmentApplication' },
    'video-poker': { 'name': 'Video Poker - Jacks or Better', 'desc': 'Free online Video Poker (Jacks or Better): classic casino poker game. Bet 1-5 credits, hold/draw cards, win payouts for pairs of Jacks or better. Mac OS 9 retro style.', 'cat': 'EntertainmentApplication' },
    'about': { 'name': 'About hello-tools - Free Online Tools', 'desc': 'About hello-tools: a collection of 100+ free online calculators, converters, and utilities. No ads, no tracking, no signup. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
    'guide': { 'name': 'User Guide - How to Use hello-tools', 'desc': 'User guide for hello-tools: how to navigate, use tools, switch languages, and troubleshoot common issues. Mac OS 9 retro style.', 'cat': 'UtilitiesApplication' },
}

# Minimal fallback for other locales (will use English as base)
new_tools_fallback = {}
for k, v in new_tools_en.items():
    new_tools_fallback[k] = { 'name': v['name'], 'desc': v['desc'], 'cat': v['cat'] }

# Build the tools object additions
locales = ['en', 'es', 'zh', 'ko', 'pt']
tools_additions = []
for loc in locales:
    tools_additions.append(f"  {loc}: {{")
    tools_to_use = new_tools_en if loc == 'en' else new_tools_fallback
    for k, v in tools_to_use.items():
        name = v['name'].replace('"', '\\"')
        desc = v['desc'].replace('"', '\\"')
        cat = v['cat']
        tools_additions.append(f"    {k}: {{ name: \"{name}\", desc: \"{desc}\", cat: \"{cat}\" }},")
    tools_additions.append("  },")

tools_str = "\n".join(tools_additions)

# Find the tools object and insert after the existing content
# The tools object starts with "const tools = {"
# We need to insert our new tools before the closing "};"

# First, let's add to the toolMap
tool_map_entries = []
for k in new_tools_en.keys():
    tool_map_entries.append(f"  '/{k}': '{k}',")

tool_map_str = "\n".join(tool_map_entries)

# Now do the replacement
# Find the closing of the tools object
# The tools object ends with "};"
# We want to insert our new tools before that closing

# Let's find the "};" that closes the tools object (after the pt locale)
# The pattern is: the tools object has en, es, zh, ko, pt keys
# After pt: { ... }, there's a "};"

# Find the position after the pt locale closing
pt_end = content.find("  },\n};")
if pt_end == -1:
    # Try alternative
    pt_end = content.find("  }\n};")
    
if pt_end != -1:
    # Insert before the "};"
    content = content[:pt_end + 2] + "\n" + tools_str + content[pt_end + 2:]

# Now update the toolMap in getToolKey function
# Find the toolMap object
toolmap_start = content.find("const toolMap = {")
if toolmap_start != -1:
    # Find the closing }
    brace_count = 0
    pos = toolmap_start
    for i, ch in enumerate(content[toolmap_start:]):
        if ch == '{': brace_count += 1
        elif ch == '}':
            brace_count -= 1
            if brace_count == 0:
                pos = toolmap_start + i
                break
    # Insert our new entries before the closing }
    content = content[:pos] + "\n" + tool_map_str + content[pos:]

# Write back
with open('src/app/[locale]/layout.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated layout.js with 43 new tools!")