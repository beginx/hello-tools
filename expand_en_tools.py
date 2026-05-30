import os, re

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT_PATH = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')

with open(LAYOUT_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Get all actual tool directories
page_dir = os.path.join(BASE, 'src', 'app', '[locale]')
actual_tools = sorted([
    item for item in os.listdir(page_dir)
    if os.path.isfile(os.path.join(page_dir, item, 'page.js'))
])
print(f"Actual tools ({len(actual_tools)}): {actual_tools}")

# EN metadata for all missing tools
en_extra = {
    'age': ('Age Calculator - Calculate Your Exact Age', '"Free online age calculator: calculate your exact age in years, months, days, hours, minutes, and seconds. Find your age on any date and time until your next birthday. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'average': ('Average Calculator - Mean, Median, Mode', '"Free online average calculator: calculate mean, median, mode, and range for any set of numbers. Perfect for students, teachers, and data analysis. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'bodyfat': ('Body Fat Calculator - BMI Method & Navy Seal', '"Free online body fat calculator: estimate your body fat percentage using BMI method or US Navy method. Track your fitness progress and body composition. Mac OS 9 retro style."', 'HealthApplication'),
    'compound': ('Compound Interest Calculator - Investment Growth', '"Free online compound interest calculator: see how your investments grow over time. Enter principal, monthly contributions, rate, and years for a full year-by-year breakdown. Mac OS 9 retro style."', 'FinanceApplication'),
    'currency': ('Currency Converter - Exchange Rate', '"Free online currency converter: convert between USD, EUR, GBP, JPY, KRW, CNY and more. Real-time exchange rates. Perfect for travel and international business. Mac OS 9 retro style."', 'FinanceApplication'),
    'daysuntil': ('Days Until Calculator - Countdown', '"Free online days until calculator: count down the days until any date. Perfect for birthdays, vacations, weddings, events, and deadlines. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'discount': ('Discount Calculator - Sale Price & Savings', '"Free online discount calculator: calculate final price after discount, amount saved, and discount percentage. Perfect for shopping and budgeting. Mac OS 9 retro style."', 'FinanceApplication'),
    'duedate': ('Due Date Calculator - Date Calculation', '"Free online due date calculator: calculate days between dates, add or subtract days from a date, find the day of the week for any date. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'duration': ('Duration Calculator - Time Interval', '"Free online duration calculator: calculate the time interval between two dates and times in years, months, days, hours, and minutes. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'emi': ('EMI Calculator - Loan EMI, Interest & Amortization', '"Free online EMI calculator: calculate monthly EMI, total interest, and total payment for home, car, and personal loans. View amortization schedule. Mac OS 9 retro style."', 'FinanceApplication'),
    'fraction': ('Fraction Calculator - Add, Subtract, Multiply, Divide', '"Free online fraction calculator: add, subtract, multiply, and divide fractions. Simplify fractions and convert between fractions and decimals. Perfect for math homework. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'fuelcost': ('Fuel Cost Calculator - Trip Fuel Cost Estimator', '"Free online fuel cost calculator: estimate your trip fuel cost and fuel consumption. Enter distance, fuel efficiency, and fuel price. Perfect for road trips and commuting. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'grade': ('Grade Calculator - Final Grade & GPA', '"Free online grade calculator: calculate your current grade, final grade needed, and GPA. Supports weighted and unweighted grading systems. Mac OS 9 retro style."', 'EducationApplication'),
    'idealweight': ('Ideal Weight Calculator - Healthy Weight Range', '"Free online ideal weight calculator: calculate your ideal body weight using Devine, Hamwi, Robinson, and Miller formulas. Perfect for health and fitness goals. Mac OS 9 retro style."', 'HealthApplication'),
    'loan': ('Loan Calculator - Monthly Payment & Interest', '"Free online loan calculator: calculate monthly payments, total interest, and total cost for any loan. Perfect for mortgages, auto loans, and personal loans. Mac OS 9 retro style."', 'FinanceApplication'),
    'love': ('Love Calculator - Love Compatibility Test', '"Free online love calculator: calculate love compatibility and percentage match between two names. Fun and entertaining compatibility test for couples. Mac OS 9 retro style."', 'EntertainmentApplication'),
    'markup': ('Markup Calculator - Margin & Markup', '"Free online markup calculator: calculate markup percentage, margin percentage, selling price, and profit. Perfect for retailers, wholesalers, and small businesses. Mac OS 9 retro style."', 'FinanceApplication'),
    'mortgage': ('Mortgage Calculator - Monthly Payment & Amortization', '"Free online mortgage calculator: calculate monthly mortgage payments, total interest, and amortization schedule. Perfect for home buyers and real estate investors. Mac OS 9 retro style."', 'FinanceApplication'),
    'overtime': ('Overtime Calculator - Pay & Time', '"Free online overtime calculator: calculate overtime pay based on hourly rate, regular hours, and overtime hours. Supports time and a half and double time. Mac OS 9 retro style."', 'FinanceApplication'),
    'pace': ('Pace Calculator - Running Speed & Pace', '"Free online pace calculator: calculate running pace, speed, distance, or time. Perfect for runners, joggers, and marathon training. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'pdf': ('PDF Editor - Merge, Compress, Rotate', '"Free online PDF tools: merge PDFs, compress PDF files, rotate pages, and extract text. No upload required - everything runs in your browser. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'percent': ('Percentage Calculator - Percent of a Number', '"Free online percentage calculator: calculate percentages, percentage increase/decrease, and percentage of a number. Perfect for tips, discounts, and everyday math. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'period': ('Period Calculator - Menstrual Cycle Tracker', '"Free online period calculator: track your menstrual cycle, predict next period, ovulation days, and fertile window. Perfect for women health and family planning. Mac OS 9 retro style."', 'HealthApplication'),
    'petage': ('Pet Age Calculator - Dog & Cat Years', '"Free online pet age calculator: convert your dog or cat age to human years. Supports small, medium, large, and giant dog breeds. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'privacy': ('Privacy Policy Generator - Free Policy', '"Free privacy policy generator: create a privacy policy for your website or app. Covers GDPR, CCPA, and other regulations. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'random': ('Random Number Generator - True Random', '"Free online random number generator: generate random integers within any range. True random numbers for lotteries, giveaways, and games. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'retirement': ('Retirement Calculator - Retirement Savings', '"Free online retirement calculator: estimate how much you need to save for retirement. Enter current savings, monthly contributions, and expected returns. Mac OS 9 retro style."', 'FinanceApplication'),
    'salary': ('Salary Calculator - Hourly to Annual', '"Free online salary calculator: convert between hourly, daily, weekly, monthly, and annual salary. Perfect for job offers and budget planning. Mac OS 9 retro style."', 'FinanceApplication'),
    'salestax': ('Sales Tax Calculator - Tax Rate & Total', '"Free online sales tax calculator: calculate sales tax amount and total price including tax. Supports custom tax rates for any state or country. Mac OS 9 retro style."', 'FinanceApplication'),
    'simpleinterest': ('Simple Interest Calculator - Interest & Maturity', '"Free online simple interest calculator: calculate simple interest, maturity amount, and interest rate. Perfect for loans, savings, and investments. Mac OS 9 retro style."', 'FinanceApplication'),
    'sip': ('SIP Calculator - Systematic Investment Plan', '"Free online SIP calculator: calculate the future value of your systematic investments. Enter monthly investment, expected return, and time period. Mac OS 9 retro style."', 'FinanceApplication'),
    'sleep': ('Sleep Calculator - Bedtime & Wake-up', '"Free online sleep calculator: find the best bedtime or wake-up time based on 90-minute sleep cycles. Wake up refreshed with optimal sleep timing. Mac OS 9 retro style."', 'HealthApplication'),
    'sqft': ('Square Footage Calculator - Area & Perimeter', '"Free online square footage calculator: calculate area in square feet, square meters, acres, and more. Perfect for home improvement, real estate, and construction. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'text': ('Text Counter - Character, Word & Line Count', '"Free online text counter: count characters, words, sentences, paragraphs, and lines in any text. Perfect for writers, students, and SEO professionals. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'timer': ('Timer - Countdown Timer Online', '"Free online countdown timer: set hours, minutes, and seconds. Perfect for cooking, workouts, study sessions, and productivity. Mac OS 9 retro style."', 'UtilitiesApplication'),
    'tip': ('Tip Calculator - Tip & Split Bill', '"Free online tip calculator: calculate tip amount, total bill, and split between multiple people. Choose percentage or custom tip. Mac OS 9 retro style."', 'FinanceApplication'),
    'vat': ('VAT Calculator - Add & Remove VAT', '"Free online VAT calculator: add or remove VAT from any amount. Supports standard and reduced VAT rates for EU countries. Mac OS 9 retro style."', 'FinanceApplication'),
    'waterintake': ('Water Intake Calculator - Daily Hydration', '"Free online water intake calculator: calculate how much water you should drink daily based on your weight, activity level, and climate. Mac OS 9 retro style."', 'HealthApplication'),
    'wordcounter': ('Word Counter - Count Words & Characters', '"Free online word counter: count words, characters, sentences, and reading time. Perfect for essays, articles, and social media posts. Mac OS 9 retro style."', 'UtilitiesApplication'),
}

# Build the extra tools block for EN
extra_lines_en = []
for tool, (name, desc, cat) in sorted(en_extra.items()):
    extra_lines_en.append(f'    {tool}: {{ name: {name}, desc: {desc}, cat: "{cat}" }},')

# Insert after investment line in EN block, before "  },"
en_block_end_pattern = '''    investment: { name: "Investment Calculator - Project Your Growth", desc: "Free online investment calculator: project how your investments grow with initial amount and monthly contributions. Perfect for retirement planning and wealth building. Mac OS 9 retro style.", cat: "FinanceApplication" },
  },
  es:'''

# Find this pattern and add extra tools before },<space>
new_en_block = '''    investment: { name: "Investment Calculator - Project Your Growth", desc: "Free online investment calculator: project how your investments grow with initial amount and monthly contributions. Perfect for retirement planning and wealth building. Mac OS 9 retro style.", cat: "FinanceApplication" },
''' + '\n'.join(extra_lines_en) + '''
  },
  es:'''

content = content.replace(en_block_end_pattern, new_en_block)

with open(LAYOUT_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print("EN block expanded with 39 missing tools!")
print(f"Total lines in layout.js: {len(content.splitlines())}")

# Verify tool count
match = re.search(r'en:\s*\{([^}]+)\}', content[:5000], re.DOTALL)
if match:
    en_block = match.group(1)
    tools_in_en = re.findall(r'^\s+(\w+):\s*\{', en_block, re.MULTILINE)
    print(f"EN tools count: {len(tools_in_en)}")