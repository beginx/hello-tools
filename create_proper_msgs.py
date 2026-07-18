#!/usr/bin/env python3
"""Create proper English message files for all 43 restored tools"""
import os, json

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']
MSGS_DIR = 'src/messages'

# Proper English messages for each tool with keys matching page.js
MESSAGES = {
    'about': {
        'title': 'About hello-tools',
        'seoDescription': 'About hello-tools: a collection of 100+ free online calculators, converters, and utilities. No ads, no tracking, no signup. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'artillery': {
        'title': 'Artillery Game',
        'angle': 'Angle',
        'power': 'Power',
        'fire': 'Fire!',
        'player': 'Player',
        'health': 'HP',
        'wind': 'Wind',
        'turn': 'Turn',
        'winner': 'Winner',
        'newGame': 'New Game',
        'seoDescription': 'Free online Artillery game: two-player tank battle with angle and power controls. Procedural terrain, wind effects, and projectile physics. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'ascii-art': {
        'title': 'ASCII Art Generator',
        'text': 'Text',
        'font': 'Font',
        'generate': 'Generate',
        'result': 'Result',
        'copy': 'Copy',
        'seoDescription': 'Free online ASCII art generator: convert text to ASCII art banners. Multiple font styles: standard, slant, banner, small. Perfect for terminal headers and code comments. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'bac': {
        'title': 'BAC Calculator',
        'weight': 'Weight (kg)',
        'gender': 'Gender',
        'male': 'Male',
        'female': 'Female',
        'drinks': 'Standard Drinks',
        'hours': 'Hours Since First Drink',
        'calculate': 'Calculate',
        'bacResult': 'BAC',
        'seoDescription': 'Free online BAC calculator: estimate your Blood Alcohol Content based on weight, gender, drinks consumed, and time elapsed. For educational purposes only. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'base64': {
        'title': 'Base64 Encoder/Decoder',
        'encode': 'Encode',
        'decode': 'Decode',
        'input': 'Input',
        'output': 'Output',
        'copy': 'Copy',
        'copied': 'Copied!',
        'error': 'Invalid input',
        'seoDescription': 'Free online Base64 encoder and decoder: encode text to Base64 or decode Base64 strings back to text. Supports UTF-8 encoding. Perfect for developers, APIs, and data encoding. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'caseconverter': {
        'title': 'Case Converter',
        'input': 'Input',
        'output': 'Output',
        'copy': 'Copy',
        'copied': 'Copied!',
        'seoDescription': 'Free online case converter: convert text to UPPERCASE, lowercase, Title Case, tOGGLE cASE, and InVeRsE. Instant text case transformation. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'charcount': {
        'title': 'Character Counter',
        'input': 'Input',
        'chars': 'Characters',
        'words': 'Words',
        'lines': 'Lines',
        'noSpaces': 'No Spaces',
        'seoDescription': 'Free online character counter: count characters, words, lines, and paragraphs in text. Real-time counting with character limit tracking. Perfect for writers, students, and social media. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'checkers': {
        'title': 'Checkers',
        'player': 'Player',
        'captured': 'Captured',
        'winner': 'Winner',
        'newGame': 'New Game',
        'seoDescription': 'Free online Checkers (Draughts): play against a simple AI. Standard 8x8 board, king pieces, forced captures. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'color-contrast': {
        'title': 'Color Contrast Checker',
        'foreground': 'Foreground',
        'background': 'Background',
        'contrastRatio': 'Contrast Ratio',
        'wcagAA': 'WCAG AA',
        'wcagAAA': 'WCAG AAA',
        'largeText': 'Large Text',
        'seoDescription': 'Free online color contrast checker: test foreground/background color combinations for WCAG 2.1 AA and AAA compliance. Real-time contrast ratio calculation. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'colorpicker': {
        'title': 'Color Picker',
        'search': 'Search',
        'copied': 'Copied!',
        'copyHex': 'Copy HEX',
        'copyRgb': 'Copy RGB',
        'seoDescription': 'Free online color picker: pick colors visually and convert between HEX, RGB, and HSL formats. HSV color wheel with saturation/value picker. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'cooking': {
        'title': 'Cooking Converter',
        'amount': 'Amount',
        'from': 'From',
        'to': 'To',
        'convert': 'Convert',
        'result': 'Result',
        'seoDescription': 'Free online cooking converter: convert between cups, tablespoons, teaspoons, milliliters, liters, fluid ounces, and pints. Perfect for recipe scaling. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'creditcard': {
        'title': 'Credit Card Payoff Calculator',
        'balance': 'Balance',
        'apr': 'APR (%)',
        'payment': 'Monthly Payment',
        'calculate': 'Calculate',
        'months': 'Months',
        'totalInterest': 'Total Interest',
        'seoDescription': 'Free online credit card payoff calculator: calculate months to pay off credit card debt and total interest paid. Plan your debt-free journey. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'datasize': {
        'title': 'Data Size Converter',
        'input': 'Input',
        'from': 'From',
        'to': 'To',
        'convert': 'Convert',
        'result': 'Result',
        'seoDescription': 'Free online data size converter: convert between bytes, KB, MB, GB, TB, and PB. Accurate binary and decimal conversions. Perfect for storage planning and bandwidth calculation. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'diff': {
        'title': 'Diff Checker',
        'originalLabel': 'Original',
        'modifiedLabel': 'Modified',
        'compare': 'Compare',
        'result': 'Diff',
        'seoDescription': 'Free online diff checker: compare two texts and highlight differences. Side-by-side and inline diff views. Perfect for code review, document comparison, and version control. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'emoji': {
        'title': 'Emoji Picker',
        'search': 'Search emoji...',
        'copy': 'Copy',
        'copied': 'Copied!',
        'seoDescription': 'Free online emoji picker: browse and copy 300+ emojis. Search by keyword, categorize by type. One-click copy to clipboard. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'guide': {
        'title': 'User Guide',
        'seoDescription': 'User guide for hello-tools: how to navigate, use tools, switch languages, and troubleshoot common issues. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'hash': {
        'title': 'Hash Generator',
        'algorithm': 'Algorithm',
        'input': 'Input',
        'output': 'Hash',
        'generate': 'Generate',
        'copy': 'Copy',
        'copied': 'Copied!',
        'error': 'Error',
        'seoDescription': 'Free online hash generator: generate SHA-256, SHA-512, SHA-1 hashes from text input. Secure cryptographic hashing for passwords, data integrity, and verification. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'inflation': {
        'title': 'Inflation Calculator',
        'amount': 'Amount',
        'fromYear': 'From Year',
        'toYear': 'To Year',
        'calculate': 'Calculate',
        'equivalentValue': 'Equivalent Value',
        'inflationRate': 'Inflation Rate',
        'seoDescription': 'Free online inflation calculator: calculate the purchasing power of money over time using US CPI data. See how inflation affects your savings and investments. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'json': {
        'title': 'JSON Formatter',
        'format': 'Format',
        'minify': 'Minify',
        'input': 'Input',
        'output': 'Output',
        'copy': 'Copy',
        'copied': 'Copied!',
        'valid': 'Valid JSON',
        'invalid': 'Invalid JSON',
        'error': 'Invalid JSON',
        'seoDescription': 'Free online JSON formatter: format, beautify, and minify JSON data. Validates JSON syntax and highlights errors. Perfect for developers and API debugging. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'jwt': {
        'title': 'JWT Decoder',
        'input': 'Input',
        'decode': 'Decode',
        'header': 'Header',
        'payload': 'Payload',
        'seoDescription': 'Free online JWT decoder: decode JSON Web Tokens to view header and payload. Debug and verify JWT tokens instantly. No data sent to server. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'lorem': {
        'title': 'Lorem Ipsum Generator',
        'paragraphs': 'Paragraphs',
        'generate': 'Generate',
        'result': 'Result',
        'copy': 'Copy',
        'copied': 'Copied!',
        'seoDescription': 'Free online Lorem Ipsum generator: generate placeholder text for design and development. Customizable paragraphs, words, and characters. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'markdown-preview': {
        'title': 'Markdown Preview',
        'markdown': 'Markdown',
        'placeholder': '# Heading\n\n**Bold** and *italic*\n\n- Item 1\n- Item 2',
        'seoDescription': 'Free online Markdown preview: write Markdown and see live HTML preview. Supports headings, bold, italic, code, lists, and links. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'mbti': {
        'title': 'MBTI Personality Test',
        'start': 'Start Test',
        'question': 'Question',
        'result': 'Your personality type',
        'restart': 'Restart',
        'seoDescription': 'Free online MBTI personality test: discover your Myers-Briggs personality type. 8 questions based on Jungian psychology. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'minesweeper': {
        'title': 'Minesweeper',
        'mines': 'Mines',
        'time': 'Time',
        'newGame': 'New Game',
        'easy': 'Easy (9x9, 10)',
        'medium': 'Medium (16x16, 40)',
        'hard': 'Hard (16x30, 99)',
        'gameOver': 'Game Over!',
        'youWin': 'You Win!',
        'seoDescription': 'Free online Minesweeper: clear the minefield without detonating mines. Three difficulties (Easy/Medium/Hard), flagging, and timer. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'namegen': {
        'title': 'Name Generator',
        'type': 'Type',
        'fantasy': 'Fantasy',
        'scifi': 'Sci-Fi',
        'realistic': 'Realistic',
        'japanese': 'Japanese',
        'business': 'Business',
        'count': 'Count',
        'generate': 'Generate',
        'results': 'Results',
        'copy': 'Copy All',
        'seoDescription': 'Free online name generator: generate fantasy names, sci-fi names, realistic names, Japanese names, and business names. Perfect for writers, gamers, and creators. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'numberbase': {
        'title': 'Number Base Converter',
        'input': 'Input',
        'from': 'From',
        'to': 'To',
        'convert': 'Convert',
        'output': 'Output',
        'error': 'Error',
        'seoDescription': 'Free online number base converter: convert between binary, octal, decimal, and hexadecimal. Supports large numbers and batch conversion. Perfect for programmers and students. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'pomodoro': {
        'title': 'Pomodoro Timer',
        'pomodoro': 'Pomodoro',
        'shortBreak': 'Short Break',
        'longBreak': 'Long Break',
        'start': 'Start',
        'pause': 'Pause',
        'reset': 'Reset',
        'mode': 'Mode',
        'completed': 'Completed',
        'totalTime': 'Total Time',
        'seoDescription': 'Free online Pomodoro timer: 25/5 minute work/break cycles. Customizable intervals, session tracking, and sound notifications. Boost your productivity. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'qreader': {
        'title': 'QR Code Reader',
        'uploadImage': 'Upload Image',
        'result': 'Result',
        'copy': 'Copy',
        'noQrFound': 'No QR code found',
        'error': 'Error reading QR',
        'seoDescription': 'Free online QR code reader: upload an image to decode QR codes. Supports various QR code formats. No camera required. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'regex': {
        'title': 'Regex Tester',
        'pattern': 'Pattern',
        'testString': 'Test String',
        'matches': 'Matches',
        'noMatches': 'No matches',
        'invalidRegex': 'Invalid regex',
        'seoDescription': 'Free online regex tester: test regular expressions with real-time matching. Supports JavaScript regex syntax with flags. Highlights matches and capture groups. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'roman': {
        'title': 'Roman Numeral Converter',
        'toRoman': 'To Roman',
        'toNumber': 'To Number',
        'input': 'Input',
        'convert': 'Convert',
        'output': 'Output',
        'seoDescription': 'Free online Roman numeral converter: convert numbers to Roman numerals and vice versa. Supports numbers 1-3999. Perfect for students, historians, and date conversion. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'scientific-calc': {
        'title': 'Scientific Calculator',
        'seoDescription': 'Free online scientific calculator: trigonometric functions (sin, cos, tan), logarithms (ln, log), constants (π, e), powers, parentheses. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'solitaire': {
        'title': 'Solitaire',
        'score': 'Score',
        'moves': 'Moves',
        'newGame': 'New Game',
        'seoDescription': 'Free online Solitaire (Klondike): play the classic card game in your browser. Drag and drop, auto-complete, undo, and score tracking. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'standard-deviation': {
        'title': 'Standard Deviation Calculator',
        'inputLabel': 'Enter numbers',
        'calculate': 'Calculate',
        'count': 'Count',
        'sum': 'Sum',
        'mean': 'Mean',
        'stdPop': 'Std Dev (Pop)',
        'stdSample': 'Std Dev (Sample)',
        'seoDescription': 'Free online standard deviation calculator: calculate population and sample standard deviation, variance, mean, and sum. Enter comma-separated numbers. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'tarot': {
        'title': 'Tarot Card Reading',
        'drawCard': 'Draw a Card',
        'drawing': 'Drawing...',
        'reversed': 'Reversed',
        'upright': 'Upright',
        'seoDescription': 'Free online tarot card reading: draw a random tarot card for daily guidance. 22 Major Arcana cards with upright and reversed meanings. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'time-calc': {
        'title': 'Time Calculator',
        'hours': 'Hours',
        'minutes': 'Minutes',
        'add': 'Add',
        'subtract': 'Subtract',
        'result': 'Result',
        'totalMinutes': 'Total Minutes',
        'seoDescription': 'Free online time calculator: add or subtract hours and minutes. Calculate time durations and intervals. Perfect for work schedules and time tracking. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'timezone': {
        'title': 'Time Zone Converter',
        'selectTimezone': 'Time',
        'from': 'From',
        'to': 'To',
        'convert': 'Convert',
        'convertedTime': 'Converted Time',
        'seoDescription': 'Free online time zone converter: convert time between world time zones. Supports major cities and UTC offsets. Perfect for scheduling international meetings. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'typing-test': {
        'title': 'Typing Test',
        'time15': '15 seconds',
        'time30': '30 seconds',
        'time60': '60 seconds',
        'words10': '10 words',
        'words25': '25 words',
        'wpm': 'WPM',
        'accuracy': 'Accuracy',
        'time': 'Time',
        'startTyping': 'Start typing...',
        'start': 'Start',
        'tryAgain': 'Try Again',
        'seoDescription': 'Free online typing test: measure your words per minute (WPM) and accuracy. Timed tests (15/30/60s) and word-count tests. Real-time feedback. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'urlcode': {
        'title': 'URL Encoder/Decoder',
        'encode': 'Encode',
        'decode': 'Decode',
        'input': 'Input',
        'output': 'Output',
        'copy': 'Copy',
        'copied': 'Copied!',
        'error': 'Invalid input',
        'seoDescription': 'Free online URL encoder and decoder: encode special characters in URLs or decode percent-encoded strings. Perfect for web developers and API testing. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'uuid': {
        'title': 'UUID Generator',
        'count': 'Count',
        'generate': 'Generate',
        'result': 'Result',
        'copy': 'Copy',
        'copied': 'Copied!',
        'seoDescription': 'Free online UUID generator: generate Version 4 UUIDs (Universally Unique Identifiers) in bulk. Cryptographically secure random UUIDs for databases, APIs, and distributed systems. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'video-poker': {
        'title': 'Video Poker',
        'credits': 'Credits',
        'bet': 'Bet',
        'lastWin': 'Last Win',
        'deal': 'Deal',
        'draw': 'Draw',
        'win': 'Win',
        'lose': 'Lose',
        'seoDescription': 'Free online Video Poker (Jacks or Better): classic casino poker game. Bet 1-5 credits, hold/draw cards, win payouts for pairs of Jacks or better. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'whatismyip': {
        'title': 'What Is My IP',
        'refetch': 'Check My IP',
        'loading': 'Loading...',
        'ipAddress': 'IP Address',
        'location': 'Location',
        'isp': 'ISP',
        'error': 'Error loading data',
        'seoDescription': 'Free online IP address lookup: see your public IP address, location, and ISP. No tracking, no logs. Instant IP detection. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
    'zodiac': {
        'title': 'Zodiac Sign Calculator',
        'month': 'Month',
        'day': 'Day',
        'year': 'Year',
        'findSign': 'Find Sign',
        'yourSign': 'Your Zodiac Sign',
        'seoDescription': 'Free online zodiac sign calculator: find your Western zodiac sign by birth date. Includes dates, symbols, and characteristics for all 12 signs. Mac OS 9 retro style.',
        'footer': 'hello-tools 2026'
    },
}

# Create message files
for tool, msgs in MESSAGES.items():
    for loc in LOCALES:
        loc_dir = f'{MSGS_DIR}/{loc}'
        os.makedirs(loc_dir, exist_ok=True)
        
        # For non-English, use English as fallback (will be translated later)
        fp = f'{loc_dir}/{tool}.json'
        with open(fp, 'w', encoding='utf-8') as f:
            json.dump(msgs, f, ensure_ascii=False, indent=2)
        print(f'  ✅ {loc}/{tool}.json')

print(f'\nCreated {len(MESSAGES)} tools × {len(LOCALES)} locales = {len(MESSAGES)*len(LOCALES)} files')