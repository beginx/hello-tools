import os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
PAGES_DIR = os.path.join(BASE, 'src', 'app', '[locale]')

# Define new footer links for each tool (category-appropriate)
# Format: [ (path, label), ... ]
FOOTER_LINKS = {
    'tdee': [
        ('', 'Home'),
        ('/calorieburn', 'Calorie Burn'),
        ('/bmi', 'BMI'),
        ('/bodyfat', 'Body Fat'),
        ('/duedate', 'Due Date'),
        ('/pregnancy', 'Pregnancy'),
    ],
    'calorieburn': [
        ('', 'Home'),
        ('/tdee', 'TDEE'),
        ('/bmi', 'BMI'),
        ('/bodyfat', 'Body Fat'),
        ('/idealweight', 'Ideal Weight'),
        ('/duedate', 'Due Date'),
    ],
    'pregnancy': [
        ('', 'Home'),
        ('/ovulation', 'Ovulation'),
        ('/duedate', 'Due Date'),
        ('/bmi', 'BMI'),
        ('/tdee', 'TDEE'),
        ('/calorieburn', 'Calorie Burn'),
    ],
    'ovulation': [
        ('', 'Home'),
        ('/pregnancy', 'Pregnancy'),
        ('/duedate', 'Due Date'),
        ('/bmi', 'BMI'),
        ('/tdee', 'TDEE'),
        ('/age', 'Age Calculator'),
    ],
    'cagr': [
        ('', 'Home'),
        ('/sip', 'SIP'),
        ('/compound', 'Compound'),
        ('/simpleinterest', 'Simple Interest'),
        ('/loan', 'Loan'),
        ('/mortgage', 'Mortgage'),
    ],
}

FOOTER_TEMPLATE = """      <div className="os9-footer" style={{maxWidth:400,width:'100%',fontSize:10,textAlign:'center',opacity:0.6,marginTop:12}}>
        <a href={'/' + locale} className="underline">Home</a>
__LINKS__
        <span className="mx-2">|</span>
        hello-tools 2026
      </div>"""

for tool_key, links in FOOTER_LINKS.items():
    file_path = os.path.join(PAGES_DIR, tool_key, 'page.js')
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Generate new footer
    link_lines = []
    for path, label in links:
        if path == '':
            continue  # Home is already first
        link_lines.append(f'        <span className="mx-2">|</span>')
        link_lines.append(f'        <a href={{\'/\' + locale + \'{path}\'}} className="underline">{label}</a>')
    
    new_footer = FOOTER_TEMPLATE.replace('__LINKS__', '\n'.join(link_lines))
    
    # Replace old footer (from os9-footer to the closing of that div before the final </div>)
    old_start = '      <div className="os9-footer"'
    old_end = '        hello-tools 2026\n      </div>'
    
    start_idx = content.find(old_start)
    end_idx = content.find(old_end, start_idx) + len(old_end)
    
    if start_idx >= 0 and end_idx > start_idx:
        content = content[:start_idx] + new_footer + content[end_idx:]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated footer: {tool_key}')
    else:
        print(f'Could not find footer in: {tool_key}')

print('\nAll footers updated!')