import re

with open('trade_items.js', 'r', encoding='utf-8') as f:
    content = f.read()

skins = [
    "West Dragon", "East Dragon", "Galaxy Empyrean Kitsune", "Ember West Dragon",
    "Purple Lightning", "Blue Lightning", "Yellow Lightning", "Red Lightning", "Green Lightning"
]

transparent_pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

for skin in skins:
    pattern = r'(name:\s*"' + skin + r'".*?image:\s*")[^"]+(")'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        content = content[:match.start(1)] + match.group(1) + transparent_pixel + match.group(2) + content[match.end(2):]
            
with open('trade_items.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed images for skins.")
