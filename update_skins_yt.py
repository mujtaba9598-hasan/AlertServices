import re
import subprocess
import time

def get_yt_thumbnail(query):
    try:
        print(f"Searching YT for: {query}")
        result = subprocess.run(
            ['yt-dlp', '--get-thumbnail', f'ytsearch1:Blox Fruits {query}'],
            capture_output=True, text=True, check=True
        )
        url = result.stdout.strip().split('\n')[-1]
        print(f"Found: {url}")
        return url
    except Exception as e:
        print(f"Error for {query}: {e}")
        return None

with open('trade_items.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the skins we want to update
skins = [
    "West Dragon", "East Dragon", "Galaxy Empyrean Kitsune", "Ember West Dragon",
    "Purple Lightning", "Blue Lightning", "Yellow Lightning", "Red Lightning", "Green Lightning"
]

for skin in skins:
    # Find the block for this skin
    pattern = r'(name:\s*"' + skin + r'".*?image:\s*")[^"]+(")'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        url = get_yt_thumbnail(skin)
        if url:
            content = content[:match.start(1)] + match.group(1) + url + match.group(2) + content[match.end(2):]
            
with open('trade_items.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Finished updating trade_items.js")
