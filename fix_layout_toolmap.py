import os

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
LAYOUT_PATH = os.path.join(BASE, 'src', 'app', '[locale]', 'layout.js')

with open(LAYOUT_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# === 1. ZH block: cagr closing -> add gpa/autoloan/investment ===
old_zh = '''    cagr: { name: "CAGR\u8ba1\u7b97\u5668 - \u5e74\u590d\u5408\u589e\u957f\u7387", desc: "\u514d\u8d39\u5728\u7ebfCAGR\u8ba1\u7b97\u5668\uff1a\u8ba1\u7b97\u6295\u8d44\u7684\u5e74\u590d\u5408\u589e\u957f\u7387\u3002\u8f93\u5165\u521d\u59cb\u503c\u3001\u6700\u7ec8\u503c\u548c\u5e74\u6570\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "FinanceApplication" },
  },
  ko:'''
new_zh = '''    cagr: { name: "CAGR\u8ba1\u7b97\u5668 - \u5e74\u590d\u5408\u589e\u957f\u7387", desc: "\u514d\u8d39\u5728\u7ebfCAGR\u8ba1\u7b97\u5668\uff1a\u8ba1\u7b97\u6295\u8d44\u7684\u5e74\u590d\u5408\u589e\u957f\u7387\u3002\u8f93\u5165\u521d\u59cb\u503c\u3001\u6700\u7ec8\u503c\u548c\u5e74\u6570\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "FinanceApplication" },
    gpa: { name: "GPA\u8ba1\u7b97\u5668 - \u5e73\u5747\u5b66\u5206\u79ef\u70b9", desc: "\u514d\u8d39\u5728\u7ebfGPA\u8ba1\u7b97\u5668\uff1a\u57284.0\u30014.3\u62164.5\u6807\u5ea6\u4e0a\u8ba1\u7b97\u60a8\u7684\u5e73\u5747\u5b66\u5206\u79ef\u70b9\u3002\u9002\u5408\u5927\u5b66\u751f\u4f7f\u7528\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "EducationApplication" },
    autoloan: { name: "\u6c7d\u8f66\u8d37\u6b3e\u8ba1\u7b97\u5668 - \u6c7d\u8f66\u8d37\u6b3e\u6708\u4f9b", desc: "\u514d\u8d39\u5728\u7ebf\u6c7d\u8f66\u8d37\u6b3e\u8ba1\u7b97\u5668\uff1a\u4f30\u7b97\u6708\u4f9b\u3001\u603b\u5229\u606f\u548c\u603b\u8d37\u6b3e\u6210\u672c\u3002\u9002\u5408\u65b0\u8f66\u548c\u4e8c\u624b\u8f66\u4e70\u5bb6\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "FinanceApplication" },
    investment: { name: "\u6295\u8d44\u8ba1\u7b97\u5668 - \u6295\u8d44\u589e\u957f\u9884\u6d4b", desc: "\u514d\u8d39\u5728\u7ebf\u6295\u8d44\u8ba1\u7b97\u5668\uff1a\u9884\u6d4b\u60a8\u7684\u6295\u8d44\u589e\u957f\u3002\u9002\u5408\u9000\u4f11\u89c4\u5212\u548c\u8d22\u5bcc\u7d2f\u79ef\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "FinanceApplication" },
  },
  ko:'''
content = content.replace(old_zh, new_zh)

# === 2. KO block: cagr closing -> add gpa/autoloan/investment ===
old_ko = '''    cagr: { name: "CAGR \uacc4\uc0b0\uae30 - \uc5f0\ud3c9\uade0 \uc131\uc7a5\ub960", desc: "\ubb34\ub8cc CAGR \uacc4\uc0b0\uae30: \ud22c\uc790\uc758 \uc5f0\ud3c9\uade0 \uc131\uc7a5\ub960\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. \ucd08\uae30\uac12, \ucd5c\uc885\uac12, \ub144\uc218\ub97c \uc785\ub825\ud558\uc138\uc694. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.", cat: "FinanceApplication" },
  },
  pt:'''
new_ko = '''    cagr: { name: "CAGR \uacc4\uc0b0\uae30 - \uc5f0\ud3c9\uade0 \uc131\uc7a5\ub960", desc: "\ubb34\ub8cc CAGR \uacc4\uc0b0\uae30: \ud22c\uc790\uc758 \uc5f0\ud3c9\uade0 \uc131\uc7a5\ub960\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. \ucd08\uae30\uac12, \ucd5c\uc885\uac12, \ub144\uc218\ub97c \uc785\ub825\ud558\uc138\uc694. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.", cat: "FinanceApplication" },
    gpa: { name: "GPA \uacc4\uc0b0\uae30 - \ud559\uc810 \ud3c9\uade0\uc810", desc: "\ubb34\ub8cc GPA \uacc4\uc0b0\uae30: 4.0, 4.3, 4.5 \uc2a4\ucf00\uc77c\uc5d0\uc11c \ud559\uc810 \ud3c9\uade0\uc810\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. \ub300\ud559\uc0dd\uc744 \uc704\ud55c \ubb34\ub8cc \uc6f9 \ud234\uc785\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.", cat: "EducationApplication" },
    autoloan: { name: "\uc790\ub3d9\ucc28 \ud560\ubd80 \uacc4\uc0b0\uae30", desc: "\ubb34\ub8cc \uc790\ub3d9\ucc28 \ud560\ubd80 \uacc4\uc0b0\uae30: \ucc28\ub7c9\uac00\uaca9, \uacc4\uc57d\uae08, \uc774\uc728, \uae30\uac04\uc744 \uc785\ub825\ud558\uc5ec \uc6d4 \ud560\ubd80\uae08\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.", cat: "FinanceApplication" },
    investment: { name: "\ud22c\uc790 \uacc4\uc0b0\uae30 - \ud22c\uc790 \uc218\uc775\ub960", desc: "\ubb34\ub8cc \ud22c\uc790 \uacc4\uc0b0\uae30: \ucd08\uae30 \ud22c\uc790\uae08, \uc6d4 \uc801\ub9bd\uae08\uc73c\ub85c \ubbf8\ub798 \uac00\uce58\uc640 \uc218\uc775\ub960\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.", cat: "FinanceApplication" },
  },
  pt:'''
content = content.replace(old_ko, new_ko)

# === 3. Expand toolMap to all 59 tools ===
# Current toolMap line (find and replace)
import re
map_match = re.search(r"const toolMap\s*=\s*\{([^}]+)\};", content)
if map_match:
    # Get all actual tool directories
    page_dir = os.path.join(BASE, 'src', 'app', '[locale]')
    actual_tools = sorted([
        item for item in os.listdir(page_dir)
        if os.path.isfile(os.path.join(page_dir, item, 'page.js'))
    ])
    
    # Build new toolMap entries in alphabetical order
    entries = []
    for tool in actual_tools:
        entries.append(f"'/{tool}': '{tool}'")
    
    new_map = "const toolMap = { " + ", ".join(entries) + " };"
    content = content.replace(map_match.group(0), new_map)
    print(f"toolMap updated: {len(actual_tools)} entries")
else:
    print("ERROR: toolMap not found")

with open(LAYOUT_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! ZH/KO blocks + toolMap updated.")
print()