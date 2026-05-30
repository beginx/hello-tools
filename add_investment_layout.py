import os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT_PATH = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')

with open(LAYOUT_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# --- EN: add investment between autoloan and }, ---
content = content.replace(
    '    autoloan: { name: "Auto Loan Calculator - Car Loan Payments", desc: "Free online auto loan calculator: estimate your monthly car payments, total interest, and total loan cost. Enter vehicle price, down payment, interest rate, and loan term. Perfect for new and used car buyers. Mac OS 9 retro style.", cat: "FinanceApplication" },\n  },',
    '    autoloan: { name: "Auto Loan Calculator - Car Loan Payments", desc: "Free online auto loan calculator: estimate your monthly car payments, total interest, and total loan cost. Enter vehicle price, down payment, interest rate, and loan term. Perfect for new and used car buyers. Mac OS 9 retro style.", cat: "FinanceApplication" },\n    investment: { name: "Investment Calculator - Project Your Growth", desc: "Free online investment calculator: project how your investments grow with initial amount and monthly contributions. Perfect for retirement planning and wealth building. Mac OS 9 retro style.", cat: "FinanceApplication" },\n  },'
)

# --- ToolMap: add /investment ---
content = content.replace(
    "'/autoloan': 'autoloan' };",
    "'/autoloan': 'autoloan', '/investment': 'investment' };"
)

with open(LAYOUT_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print('layout.js updated with investment (EN + toolMap)!')