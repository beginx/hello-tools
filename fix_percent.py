import os

path = "src/app/[locale]/percent/page.js"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Replace escaped backticks with actual backticks
text = text.replace("\\`", "`")

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed percent/page.js")