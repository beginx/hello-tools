import json, os, re, sys

BASE = r"C:\Users\1one\AppData\Local\Temp\opencode\hw0505"
LOCALE_DIR = os.path.join(BASE, "src", "app", "[locale]")
MSGS_DIR = os.path.join(BASE, "src", "messages")

DONE = {"age","grade","fraction","tip","daysuntil","convert","salary",
        "average","percent","date","discount","duration","idealweight"}

all_tools = sorted([d for d in os.listdir(LOCALE_DIR) 
             if os.path.isdir(os.path.join(LOCALE_DIR, d))])
remaining = [t for t in all_tools if t not in DONE]

# English SEO descriptions for all remaining tools
SEO_EN = {
    "bmi": "Calculate your Body Mass Index (BMI) instantly using your height and weight. This free BMI calculator tells you whether you are underweight, normal, overweight, or obese based on standard BMI categories. Track your health and fitness progress with accurate BMI measurements.",
    "bodyfat": "Calculate your body fat percentage using various measurement methods including US Navy, BMI-based, and simple measurements. This free body fat calculator helps you track your fitness progress and understand your body composition better.",
    "compound": "Calculate compound interest growth for your investments. Enter principal, interest rate, time period, and compounding frequency to see how your money grows over time. This free compound interest calculator shows year-by-year growth with detailed charts.",
    "currency": "Convert between world currencies using real-time exchange rates. Select from USD, EUR, JPY, GBP, KRW, and many more currencies. This free currency converter helps with international travel, online shopping, and business transactions.",
    "duedate": "Calculate your estimated due date using Naegele's rule based on your last menstrual period or conception date. This free due date calculator shows your due date, conception date, current week of pregnancy, and trimester information.",
    "fuelcost": "Calculate your fuel cost for any trip based on distance, fuel efficiency, and fuel price. Enter kilometers or miles, fuel consumption rate, and price per unit to estimate total fuel cost for your journey.",
    "loan": "Calculate your monthly loan payments, total interest, and total repayment amount. Enter loan amount, interest rate, and loan term to see your amortization schedule. This free loan calculator helps with mortgage, auto, and personal loan planning.",
    "lotto": "Calculate lottery odds, combinations, and probabilities for various lotto games. Enter your numbers and the game parameters to see your chances of winning. This free lotto calculator helps you understand lottery mathematics.",
    "markup": "Calculate markup percentage, selling price, and profit margin from cost price. Enter your cost and desired markup or margin to determine the optimal selling price. This free markup calculator helps with pricing strategy and profit analysis.",
    "mortgage": "Calculate your monthly mortgage payments including principal and interest. Enter home price, down payment, interest rate, and loan term to see your amortization schedule. This free mortgage calculator helps with home buying decisions.",
    "overtime": "Calculate overtime pay based on your regular hourly rate and overtime hours. Supports common overtime multipliers like time-and-a-half and double time. This free overtime calculator helps employees and employers track overtime compensation.",
    "pace": "Calculate running pace, speed, distance, or time for your workouts. Enter any two values to calculate the third. This free pace calculator supports kilometers and miles, perfect for runners planning their training and race strategies.",
    "password": "Generate strong, secure passwords with customizable length and character types. Include uppercase, lowercase, numbers, and symbols. This free password generator creates random passwords that meet security requirements.",
    "pdf": "Extract text content from PDF files, count pages, and analyze PDF metadata. Upload a PDF file to extract text, count words, characters, and paragraphs. This free PDF text extractor and analyzer for document processing.",
    "period": "Track your menstrual cycle and predict your next period, ovulation, and fertile window. Enter your cycle length and last period date to get personalized predictions. This free period calculator helps with reproductive health tracking.",
    "photo": "Calculate photo file sizes, aspect ratios, print sizes, and resolution. Enter image dimensions and DPI to see optimal print sizes and file sizes. This free photo calculator helps photographers plan their prints and digital storage.",
    "privacy": "Learn about our privacy practices and how we handle your data. This privacy policy page explains data collection, cookies, third-party services, and your rights regarding personal information when using our free online tools.",
    "qr": "Generate QR codes for URLs, text, phone numbers, and more. Customize QR code size and error correction level. This free QR code generator creates downloadable QR codes for business cards, websites, and marketing materials.",
    "random": "Generate random numbers, coin flips, dice rolls, and random choices. Set custom ranges and options. This free random generator is perfect for games, giveaways, statistical sampling, and decision making.",
    "retirement": "Calculate how much you need to save for retirement using the 4% rule. Enter your current age, retirement age, savings, monthly contributions, and expected return rate. This free retirement calculator shows year-by-year growth projections.",
    "simpleinterest": "Calculate simple interest on loans and investments. Enter principal amount, annual interest rate, and time period in years, months, or days. This free simple interest calculator shows total interest earned and final amount.",
    "sip": "Calculate your Systematic Investment Plan returns. Enter monthly investment amount, expected return rate, and investment period to see your total investment, estimated returns, and maturity amount. This free SIP calculator for mutual fund planning.",
    "text": "Count words, characters, sentences, paragraphs, and lines in any text. Get real-time statistics including reading time and speaking time. This free word counter and text analyzer for writers, students, and content creators.",
    "timer": "Set a countdown timer with hours, minutes, and seconds. Start, pause, and reset the timer as needed. This free online timer is perfect for cooking, workouts, study sessions, and productivity timing.",
    "vat": "Calculate VAT (Value Added Tax) amounts for different countries. Choose from preset VAT rates including UK, EU, Australia, and more. This free VAT calculator helps with business accounting, invoicing, and tax compliance.",
    "waterintake": "Calculate your recommended daily water intake based on body weight and exercise level. Enter your weight and how much you exercise to see how much water you should drink daily. This free water intake calculator helps you stay hydrated.",
    "wordcounter": "Count words, characters, sentences, paragraphs, and lines in any text. Get real-time statistics with reading time estimates. This free word counter helps writers, students, and professionals optimize their content length."
}

LOCALES = ["en", "ko", "es", "zh", "pt"]

def update_messages_json(tool, en_desc):
    """Add seoDescription to tool's 5 locale JSON files"""
    for locale in ["ko", "es", "zh", "pt"]:
        filepath = os.path.join(MSGS_DIR, locale, f"{tool}.json")
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            # Check if seoDescription already exists
            if '"seoDescription"' in content:
                print(f"  {locale}/{tool}.json: already has seoDescription, skipping")
                continue
            # Add before closing }
            trimmed = content.rstrip().rstrip("}")
            if trimmed.endswith(","):
                trimmed = trimmed.rstrip(",")
            new_content = f'{trimmed},"seoDescription":"{en_desc}"}}\n'
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"  {locale}/{tool}.json: added seoDescription")
        else:
            print(f"  {locale}/{tool}.json: NOT FOUND")

def update_page_js(tool, related_links):
    """Add SEO Description + Related Tools to page.js before os9-footer"""
    filepath = os.path.join(LOCALE_DIR, tool, "page.js")
    if not os.path.exists(filepath):
        print(f"  {tool}/page.js: NOT FOUND")
        return
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "seoDescription" in content:
        print(f"  {tool}/page.js: already has seoDescription, skipping")
        return
    
    # Get the related links HTML
    links_html = "\n".join(
        f'                <a href={{\`/\${{locale}}/{path}\`}} className="underline">{name}</a>'
        for path, name in related_links
    )
    
    seo_section = f'''          {{/* SEO Description + Related Tools */}}
          <div className="mt-4 px-1">
            <p className="text-xs leading-relaxed" style={{{{ opacity: 0.65 }}}}>{{t('seoDescription')}}</p>
            <div className="mt-2 text-xs" style={{{{ opacity: 0.55 }}}}>
              <span style={{{{ fontWeight: 600 }}}}>Related Tools:</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
{links_html}
              </div>
            </div>
          </div>'''
    
    # Find the 5 closing divs pattern before os9-footer
    # Pattern: last occurrence of </div>\n      </div>\n      <div className="os9-footer"
    pattern = r'(</div>\s*\n\s*</div>\s*\n\s*<div className="os9-footer")'
    match = re.search(pattern, content)
    if match:
        # Insert seo_section before the last closing </div></div> before footer
        insert_pos = match.start()
        modified = content[:insert_pos] + seo_section + '\n        </div>\n      </div>\n      ' + content[match.start(1)+len('</div>\n      </div>\n      '):]
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(modified)
        print(f"  {tool}/page.js: updated")
    else:
        print(f"  {tool}/page.js: couldn't find footer pattern!")
        print(f"  Last 5 lines: {repr(content[-200:])}")

# Related tools mapping (path, display name)
RELATED = {
    "bmi": [("idealweight","Ideal Weight Calculator"), ("bodyfat","Body Fat Calculator"), ("calorie","Calorie Calculator")],
    "bodyfat": [("bmi","BMI Calculator"), ("idealweight","Ideal Weight Calculator"), ("waterintake","Water Intake Calculator")],
    "compound": [("sip","SIP Calculator"), ("simpleinterest","Simple Interest Calculator"), ("retirement","Retirement Calculator")],
    "currency": [("convert","Unit Converter"), ("percent","Percent Calculator"), ("vat","VAT Calculator")],
    "duedate": [("period","Period Calculator"), ("age","Age Calculator"), ("daysuntil","Days Until Calculator")],
    "fuelcost": [("salary","Salary Converter"), ("overtime","Overtime Calculator"), ("vat","VAT Calculator")],
    "loan": [("mortgage","Mortgage Calculator"), ("compound","Compound Interest Calculator"), ("simpleinterest","Simple Interest Calculator")],
    "lotto": [("random","Random Generator"), ("password","Password Generator"), ("qr","QR Code Generator")],
    "markup": [("discount","Discount Calculator"), ("percent","Percent Calculator"), ("vat","VAT Calculator")],
    "mortgage": [("loan","Loan Calculator"), ("compound","Compound Interest Calculator"), ("simpleinterest","Simple Interest Calculator")],
    "overtime": [("salary","Salary Converter"), ("tip","Tip Calculator"), ("fuelcost","Fuel Cost Calculator")],
    "pace": [("duration","Time Duration Calculator"), ("timer","Timer"), ("date","Date Calculator")],
    "password": [("qr","QR Code Generator"), ("random","Random Generator"), ("lotto","Lotto Odds Calculator")],
    "pdf": [("text","Text Analyzer"), ("wordcounter","Word Counter"), ("photo","Photo Calculator")],
    "period": [("duedate","Due Date Calculator"), ("age","Age Calculator"), ("daysuntil","Days Until Calculator")],
    "photo": [("pdf","PDF Text Extractor"), ("qr","QR Code Generator"), ("password","Password Generator")],
    "privacy": [("age","Age Calculator"), ("bmi","BMI Calculator"), ("timer","Timer")],
    "qr": [("password","Password Generator"), ("random","Random Generator"), ("lotto","Lotto Odds Calculator")],
    "random": [("lotto","Lotto Odds Calculator"), ("password","Password Generator"), ("qr","QR Code Generator")],
    "retirement": [("compound","Compound Interest Calculator"), ("sip","SIP Calculator"), ("simpleinterest","Simple Interest Calculator")],
    "simpleinterest": [("compound","Compound Interest Calculator"), ("sip","SIP Calculator"), ("loan","Loan Calculator")],
    "sip": [("compound","Compound Interest Calculator"), ("retirement","Retirement Calculator"), ("simpleinterest","Simple Interest Calculator")],
    "text": [("wordcounter","Word Counter"), ("pdf","PDF Text Extractor"), ("timer","Timer")],
    "timer": [("duration","Time Duration Calculator"), ("date","Date Calculator"), ("daysuntil","Days Until Calculator")],
    "vat": [("discount","Discount Calculator"), ("tip","Tip Calculator"), ("percent","Percent Calculator")],
    "waterintake": [("bmi","BMI Calculator"), ("idealweight","Ideal Weight Calculator"), ("bodyfat","Body Fat Calculator")],
    "wordcounter": [("text","Text Analyzer"), ("pdf","PDF Text Extractor"), ("timer","Timer")],
}

print("=== Updating remaining 27 tools ===\n")
for tool in remaining:
    print(f"\n--- {tool} ---")
    # 1. Update english messages JSON (if it exists)
    en_file = os.path.join(MSGS_DIR, "en", f"{tool}.json")
    if os.path.exists(en_file):
        with open(en_file, "r", encoding="utf-8") as f:
            content = f.read()
        if '"seoDescription"' not in content:
            trimmed = content.rstrip().rstrip("}")
            if trimmed.endswith(","):
                trimmed = trimmed.rstrip(",")
            new_content = f'{trimmed},"seoDescription":"{SEO_EN[tool]}"}}\n'
            with open(en_file, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"  en/{tool}.json: added")
        else:
            print(f"  en/{tool}.json: already has seoDescription")
        
        # 2. Update other locale messages
        update_messages_json(tool, SEO_EN[tool])
    else:
        print(f"  en/{tool}.json: NOT FOUND (app.json based)")
    
    # 3. Update page.js
    if tool in RELATED:
        update_page_js(tool, RELATED[tool])
    else:
        print(f"  {tool}/page.js: no related tools mapping, skipping")

print("\n=== ALL DONE ===")