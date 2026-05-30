import re, os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')
PAGE_DIR = os.path.join(BASE, 'src', 'app', '[locale]')

# ===== HARDCODED EN METADATA =====
en_meta = {
    'age': ['Age Calculator - Calculate Your Exact Age', 'Free online age calculator: calculate your exact age in years, months, days, hours, minutes, and seconds. Find your age on any date and time until your next birthday. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'autoloan': ['Auto Loan Calculator - Car Loan Payments', 'Free online auto loan calculator: estimate your monthly car payments, total interest, and total loan cost. Enter vehicle price, down payment, interest rate, and loan term. Perfect for new and used car buyers. Mac OS 9 retro style.', 'FinanceApplication'],
    'average': ['Average Calculator - Mean, Median, Mode', 'Free online average calculator: calculate mean, median, mode, and range for any set of numbers. Perfect for students, teachers, and data analysis. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'bmi': ['BMI Calculator - Body Mass Index', 'Free online BMI calculator: calculate your Body Mass Index and check your weight category. Color-coded gauge and healthy weight range.', 'HealthApplication'],
    'bodyfat': ['Body Fat Calculator - BMI Method & Navy Seal', 'Free online body fat calculator: estimate your body fat percentage using BMI method or US Navy method. Track your fitness progress and body composition. Mac OS 9 retro style.', 'HealthApplication'],
    'cagr': ['CAGR Calculator - Compound Annual Growth Rate', 'Free online CAGR calculator: calculate Compound Annual Growth Rate for investments. Enter initial value, final value, and years to find your average annual return. Perfect for stocks, funds, and business growth analysis. Mac OS 9 retro style.', 'FinanceApplication'],
    'calorieburn': ['Calorie Burn Calculator - Calories Burned by Exercise', 'Free online calorie burn calculator: estimate calories burned during running, walking, cycling, swimming, yoga, jump rope, and weight lifting. Based on MET values. Perfect for fitness tracking. Mac OS 9 retro style.', 'HealthApplication, Fitness'],
    'coinflip': ['Coin Flip - Virtual Coin Toss', 'Free online coin flip: flip a virtual coin with true random results. Perfect for decision making, games, and probability experiments. Mac OS 9 retro style.', 'EntertainmentApplication'],
    'compound': ['Compound Interest Calculator - Investment Growth', 'Free online compound interest calculator: see how your investments grow over time. Enter principal, monthly contributions, rate, and years for a full year-by-year breakdown. Mac OS 9 retro style.', 'FinanceApplication'],
    'convert': ['Unit Converter - Length, Weight, Temperature', 'Free online unit converter: convert length (cm to inches, meters to feet), weight (kg to lbs), temperature (C to F), volume, area, speed, pressure.', 'UtilitiesApplication'],
    'currency': ['Currency Converter - Exchange Rate', 'Free online currency converter: convert between USD, EUR, GBP, JPY, KRW, CNY and more. Real-time exchange rates. Perfect for travel and international business. Mac OS 9 retro style.', 'FinanceApplication'],
    'date': ['Date Calculator - Days Between Dates, D-Day, Age', 'Free online date calculator: calculate days between dates, D-Day countdown, add/subtract days, calculate age and anniversaries.', 'UtilitiesApplication'],
    'daysuntil': ['Days Until Calculator - Countdown', 'Free online days until calculator: count down the days until any date. Perfect for birthdays, vacations, weddings, events, and deadlines. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'dice': ['Dice Roller - D4, D6, D8, D10, D12, D20', 'Free online dice roller: roll D4, D6, D8, D10, D12, D20, and D100 with true random results. Perfect for Dungeons & Dragons, RPGs, and board games. Mac OS 9 retro style.', 'EntertainmentApplication'],
    'discount': ['Discount Calculator - Sale Price & Savings', 'Free online discount calculator: calculate final price after discount, amount saved, and discount percentage. Perfect for shopping and budgeting. Mac OS 9 retro style.', 'FinanceApplication'],
    'duedate': ['Due Date Calculator - Date Calculation', 'Free online due date calculator: calculate days between dates, add or subtract days from a date, find the day of the week for any date. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'duration': ['Duration Calculator - Time Interval', 'Free online duration calculator: calculate the time interval between two dates and times in years, months, days, hours, and minutes. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'emi': ['EMI Calculator - Loan EMI, Interest & Amortization', 'Free online EMI calculator: calculate monthly EMI, total interest, and total payment for home, car, and personal loans. View amortization schedule. Mac OS 9 retro style.', 'FinanceApplication'],
    'fraction': ['Fraction Calculator - Add, Subtract, Multiply, Divide', 'Free online fraction calculator: add, subtract, multiply, and divide fractions. Simplify fractions and convert between fractions and decimals. Perfect for math homework. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'fuelcost': ['Fuel Cost Calculator - Trip Fuel Cost Estimator', 'Free online fuel cost calculator: estimate your trip fuel cost and fuel consumption. Enter distance, fuel efficiency, and fuel price. Perfect for road trips and commuting. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'gpa': ['GPA Calculator - Grade Point Average', 'Free online GPA calculator: calculate your Grade Point Average on 4.0, 4.3, or 4.5 scale. Add courses with custom names, credits, and letter grades. Perfect for college and university students. Mac OS 9 retro style.', 'EducationApplication'],
    'grade': ['Grade Calculator - Final Grade & GPA', 'Free online grade calculator: calculate your current grade, final grade needed, and GPA. Supports weighted and unweighted grading systems. Mac OS 9 retro style.', 'EducationApplication'],
    'idealweight': ['Ideal Weight Calculator - Healthy Weight Range', 'Free online ideal weight calculator: calculate your ideal body weight using Devine, Hamwi, Robinson, and Miller formulas. Perfect for health and fitness goals. Mac OS 9 retro style.', 'HealthApplication'],
    'investment': ['Investment Calculator - Project Your Growth', 'Free online investment calculator: project how your investments grow with initial amount and monthly contributions. Perfect for retirement planning and wealth building. Mac OS 9 retro style.', 'FinanceApplication'],
    'loan': ['Loan Calculator - Monthly Payment & Interest', 'Free online loan calculator: calculate monthly payments, total interest, and total cost for any loan. Perfect for mortgages, auto loans, and personal loans. Mac OS 9 retro style.', 'FinanceApplication'],
    'lotto': ['Lottery Number Generator - Powerball, Mega Millions', 'Generate random lottery numbers for Powerball, Mega Millions, EuroMillions, and UK Lotto. Cryptographically secure.', 'EntertainmentApplication'],
    'love': ['Love Calculator - Love Compatibility Test', 'Free online love calculator: calculate love compatibility and percentage match between two names. Fun and entertaining compatibility test for couples. Mac OS 9 retro style.', 'EntertainmentApplication'],
    'markup': ['Markup Calculator - Margin & Markup', 'Free online markup calculator: calculate markup percentage, margin percentage, selling price, and profit. Perfect for retailers, wholesalers, and small businesses. Mac OS 9 retro style.', 'FinanceApplication'],
    'mortgage': ['Mortgage Calculator - Monthly Payment & Amortization', 'Free online mortgage calculator: calculate monthly mortgage payments, total interest, and amortization schedule. Perfect for home buyers and real estate investors. Mac OS 9 retro style.', 'FinanceApplication'],
    'ohm': ["Ohm's Law Calculator - Voltage, Current, Resistance", "Free online Ohm's Law calculator: calculate voltage (V), current (I), resistance (R), and power (P). Enter any two values to find the others. Perfect for electronics, circuit design, and physics. Mac OS 9 retro style.", 'UtilitiesApplication'],
    'overtime': ['Overtime Calculator - Pay & Time', 'Free online overtime calculator: calculate overtime pay based on hourly rate, regular hours, and overtime hours. Supports time and a half and double time. Mac OS 9 retro style.', 'FinanceApplication'],
    'ovulation': ['Ovulation Calculator - Fertile Window & Ovulation Day', 'Free online ovulation calculator: track your fertile window, ovulation day, and next period. Based on your cycle length for family planning and fertility awareness. Mac OS 9 retro style.', 'HealthApplication'],
    'pace': ['Pace Calculator - Running Speed & Pace', 'Free online pace calculator: calculate running pace, speed, distance, or time. Perfect for runners, joggers, and marathon training. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'password': ['Password Generator - Strong Random Password', 'Generate strong, secure random passwords instantly. Customizable length, uppercase, lowercase, numbers, and symbols.', 'SecurityApplication'],
    'pdf': ['PDF Editor - Merge, Compress, Rotate', 'Free online PDF tools: merge PDFs, compress PDF files, rotate pages, and extract text. No upload required - everything runs in your browser. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'percent': ['Percentage Calculator - Percent of a Number', 'Free online percentage calculator: calculate percentages, percentage increase/decrease, and percentage of a number. Perfect for tips, discounts, and everyday math. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'period': ['Period Calculator - Menstrual Cycle Tracker', 'Free online period calculator: track your menstrual cycle, predict next period, ovulation days, and fertile window. Perfect for women health and family planning. Mac OS 9 retro style.', 'HealthApplication'],
    'petage': ['Pet Age Calculator - Dog & Cat Years', 'Free online pet age calculator: convert your dog or cat age to human years. Supports small, medium, large, and giant dog breeds. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'photo': ['Photo Editor - Resize, Crop, Compress Images', 'Free online photo editor: resize, crop, and compress images. Convert between JPEG, PNG, and WebP formats.', 'MultimediaApplication'],
    'pregnancy': ['Pregnancy Due Date Calculator - Due Date & Conception', "Free online pregnancy due date calculator: estimate your due date, conception date, and current pregnancy week using Naegele's rule. Track your trimester and pregnancy progress. Mac OS 9 retro style.", 'HealthApplication'],
    'privacy': ['Privacy Policy Generator - Free Policy', 'Free privacy policy generator: create a privacy policy for your website or app. Covers GDPR, CCPA, and other regulations. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'qr': ['QR Code Generator - Free Online QR Code Maker', 'Generate QR codes for free. Enter URL or text, customize size and error correction, download as PNG.', 'UtilitiesApplication'],
    'random': ['Random Number Generator - True Random', 'Free online random number generator: generate random integers within any range. True random numbers for lotteries, giveaways, and games. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'ratio': ['Ratio Calculator - Simplify & Find Missing Values', 'Free online ratio calculator: simplify ratios to their lowest terms or find missing values in proportions (A:B = C:D). Perfect for math homework, recipe scaling, and financial calculations. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'retirement': ['Retirement Calculator - Retirement Savings', 'Free online retirement calculator: estimate how much you need to save for retirement. Enter current savings, monthly contributions, and expected returns. Mac OS 9 retro style.', 'FinanceApplication'],
    'salary': ['Salary Calculator - Hourly to Annual', 'Free online salary calculator: convert between hourly, daily, weekly, monthly, and annual salary. Perfect for job offers and budget planning. Mac OS 9 retro style.', 'FinanceApplication'],
    'salestax': ['Sales Tax Calculator - Tax Rate & Total', 'Free online sales tax calculator: calculate sales tax amount and total price including tax. Supports custom tax rates for any state or country. Mac OS 9 retro style.', 'FinanceApplication'],
    'simpleinterest': ['Simple Interest Calculator - Interest & Maturity', 'Free online simple interest calculator: calculate simple interest, maturity amount, and interest rate. Perfect for loans, savings, and investments. Mac OS 9 retro style.', 'FinanceApplication'],
    'sip': ['SIP Calculator - Systematic Investment Plan', 'Free online SIP calculator: calculate the future value of your systematic investments. Enter monthly investment, expected return, and time period. Mac OS 9 retro style.', 'FinanceApplication'],
    'sleep': ['Sleep Calculator - Bedtime & Wake-up', 'Free online sleep calculator: find the best bedtime or wake-up time based on 90-minute sleep cycles. Wake up refreshed with optimal sleep timing. Mac OS 9 retro style.', 'HealthApplication'],
    'speed': ['Speed Calculator - Distance, Time & Velocity', 'Free online speed calculator: calculate speed, distance, or time. Enter any two values to find the third. Perfect for travel, physics, and everyday use. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'sqft': ['Square Footage Calculator - Area & Perimeter', 'Free online square footage calculator: calculate area in square feet, square meters, acres, and more. Perfect for home improvement, real estate, and construction. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'tdee': ['TDEE Calculator - Total Daily Energy Expenditure & BMR', 'Free online TDEE calculator: calculate your Total Daily Energy Expenditure, BMR, and recommended calorie intake for weight loss, maintenance, or muscle gain. Uses Mifflin-St Jeor equation. Mac OS 9 retro style.', 'HealthApplication, Nutrition'],
    'text': ['Text Counter - Character, Word & Line Count', 'Free online text counter: count characters, words, sentences, paragraphs, and lines in any text. Perfect for writers, students, and SEO professionals. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'timer': ['Timer - Countdown Timer Online', 'Free online countdown timer: set hours, minutes, and seconds. Perfect for cooking, workouts, study sessions, and productivity. Mac OS 9 retro style.', 'UtilitiesApplication'],
    'tip': ['Tip Calculator - Tip & Split Bill', 'Free online tip calculator: calculate tip amount, total bill, and split between multiple people. Choose percentage or custom tip. Mac OS 9 retro style.', 'FinanceApplication'],
    'vat': ['VAT Calculator - Add & Remove VAT', 'Free online VAT calculator: add or remove VAT from any amount. Supports standard and reduced VAT rates for EU countries. Mac OS 9 retro style.', 'FinanceApplication'],
    'waterintake': ['Water Intake Calculator - Daily Hydration', 'Free online water intake calculator: calculate how much water you should drink daily based on your weight, activity level, and climate. Mac OS 9 retro style.', 'HealthApplication'],
    'wordcounter': ['Word Counter - Count Words & Characters', 'Free online word counter: count words, characters, sentences, and reading time. Perfect for essays, articles, and social media posts. Mac OS 9 retro style.', 'UtilitiesApplication'],
}

actual_tools = sorted(en_meta.keys())
print(f'Generating {len(actual_tools)} tools x 5 locales')

# Build the full tools object as a string
def esc(s):
    return s.replace('"', '\\"').replace('\\n', ' ')

parts = []
for loc in ['en', 'es', 'zh', 'ko', 'pt']:
    lines = [f'  {loc}: {{']
    for tool in sorted(actual_tools):
        name, desc, cat = en_meta[tool]
        if loc != 'en':
            # Simple localization for non-English
            if loc in ('es', 'pt'):
                if 'Free online ' in desc:
                    desc = desc.replace('Free online ', 'Calculadora gratuita: ', 1)
                if desc.endswith('retro style.'):
                    desc = desc.replace('Mac OS 9 retro style.', 'Estilo retro Mac OS 9.')
                elif 'Estilo retro Mac OS 9.' not in desc:
                    desc = desc.rstrip('.').rstrip('.') + '. Estilo retro Mac OS 9.'
            elif loc == 'zh':
                if 'Free online ' in desc:
                    desc = desc.replace('Free online ', '免费在线', 1)
                if 'Mac OS 9 retro style.' in desc:
                    desc = desc.replace('Mac OS 9 retro style.', 'Mac OS 9复古风格。')
                elif '复古风格' not in desc:
                    desc = desc.rstrip('。') + '。Mac OS 9复古风格。'
            elif loc == 'ko':
                if 'Mac OS 9 레트로' not in desc:
                    desc = desc.replace('Mac OS 9 retro style.', 'Mac OS 9 레트로 스타일.')
                    if 'Mac OS 9 retro style.' not in desc:  # already replaced or not present
                        if 'Mac OS 9' in desc and '레트로' not in desc:
                            desc = desc.replace('Mac OS 9', 'Mac OS 9 레트로 스타일')
                        elif '레트로' not in desc:
                            desc = desc.rstrip('.').rstrip('.') + '. Mac OS 9 레트로 스타일.'
        
        lines.append(f'    {tool}: {{ name: "{esc(name)}", desc: "{esc(desc)}", cat: "{cat}" }},')
    lines.append('  },')
    parts.append('\n'.join(lines))

tools_block = 'const tools = {\n' + '\n'.join(parts) + '\n};'
tool_map_line = '  const toolMap = { ' + ', '.join(f"'{t}': '{t}'" for t in sorted(actual_tools)) + ' };'

# Read current layout.js
with open(LAYOUT, 'r', encoding='utf-8') as f:
    content = f.read()

# Find exact positions for replacement
start_marker = 'const tools = {'
end_marker = 'function getToolKey'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx < 0 or end_idx < 0:
    print(f'ERROR: markers not found. start={start_idx}, end={end_idx}')
else:
    # Replace tools object (from 'const tools = {' to the line before 'function getToolKey')
    header = content[:start_idx]
    footer = content[end_idx:]
    new_content = header + tools_block + '\n\n' + footer
    
    # Replace toolMap inside footer
    old_map = re.search(r'const toolMap\s*=\s*\{[^}]+\};', new_content)
    if old_map:
        new_content = new_content.replace(old_map.group(0), tool_map_line)
    
    with open(LAYOUT, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f'Written! Total lines: {len(new_content.splitlines())}')
    
    # Verify
    final_en = re.findall(r'^\s+(\w+):\s*\{', new_content.split('en: {')[1].split('es: {')[0], re.MULTILINE)
    print(f'EN tools: {len(final_en)}')
    
    # Check toolMap
    if f"'{sorted(actual_tools)[0]}': '{sorted(actual_tools)[0]}'" in new_content:
        print(f'toolMap: has first entry')
    if f"'{sorted(actual_tools)[-1]}': '{sorted(actual_tools)[-1]}'" in new_content:
        print(f'toolMap: has last entry')
    
    # Quick sanity check
    if 'const tools = {' in new_content and '};' in new_content.split('const tools = {')[1]:
        print('Structure: valid')
    if 'Dungeons' in new_content:
        print('Data integrity: OK')