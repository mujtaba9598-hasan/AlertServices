import re
data = open('trade_items.js', encoding='utf-8').read()
items = re.findall(r'name:\s*[\'"]([^\'"]+)[\'"]', data)
print("Skins:")
for n in items:
    if 'Skin' in n or 'Galaxy' in n or 'West' in n or 'East' in n or 'Lightning' in n or 'T-Rex' in n:
        print(n)
