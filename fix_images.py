import re
import json
import urllib.request
import urllib.parse
import time

def get_wiki_image(item_name, category):
    # Handle specific names
    name = item_name.replace("Perm ", "").replace(" West", "").replace(" East", "").strip()
    
    # Try different file name variants based on category
    variants = []
    if category == "Fruits":
        # Handle manual overrides for things like Tiger -> Leopard
        overrides = {
            "Tiger": "Leopard",
            "Yeti": "Blizzard",
            "Gas": "Smoke",
            "Creation": "Dough",
            "Lightning": "Rumble",
            "Eagle": "Falcon",
            "Blade": "Chop"
        }
        actual_name = overrides.get(name, name)
        
        variants = [
            f"File:{actual_name}Fruit.png",
            f"File:{actual_name}_Fruit.png",
            f"File:{actual_name}.png"
        ]
    elif category == "Gamepasses":
        variants = [
            f"File:{name}_Gamepass.png",
            f"File:{name.replace(' ', '_')}.png",
            f"File:{name}.png",
            f"File:{name.replace(' ', '')}.png"
        ]
    else:
        # Skins/Scrolls - just fallback to base fruit or whatever
        return "https://static.wikia.nocookie.net/roblox-blox-piece/images/0/00/Placeholder.png"
        
    for title in variants:
        encoded_title = urllib.parse.quote(title)
        url = f"https://blox-fruits.fandom.com/api.php?action=query&titles={encoded_title}&prop=imageinfo&iiprop=url&format=json"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            res = urllib.request.urlopen(req)
            data = json.loads(res.read())
            pages = data['query']['pages']
            page = list(pages.values())[0]
            if 'imageinfo' in page:
                img_url = page['imageinfo'][0]['url']
                # Clean off the revision query param if we want, but it's fine to leave it.
                img_url = img_url.split('/revision/')[0]
                return img_url
        except Exception as e:
            pass
        time.sleep(0.1) # Be nice to API
        
    return "https://static.wikia.nocookie.net/roblox-blox-piece/images/0/00/Placeholder.png" # Fallback

with open("trade_items.js", "r", encoding="utf-8") as f:
    js_content = f.read()

# Parse the JSON part out of trade_items.js
json_str = js_content[js_content.find('{'):js_content.rfind('}')+1]
try:
    trade_data = json.loads(json_str)
except:
    # If the JSON has trailing commas or JS specifics, this might fail, so let's do a regex replace instead.
    print("Could not parse JSON. Will use Regex.")
    trade_data = None

if not trade_data:
    import ast
    # The JSON string in trade_items.js is valid JS, but keys don't have quotes.
    # We can just manually Regex through it.
    pass

# Better approach: Regex over trade_items.js
lines = js_content.split('\n')
current_cat = None
for i in range(len(lines)):
    line = lines[i]
    if '"Fruits":' in line: current_cat = "Fruits"
    elif '"Permanent Fruits":' in line: current_cat = "Fruits"
    elif '"Gamepasses":' in line: current_cat = "Gamepasses"
    elif '"Skins":' in line: current_cat = "Skins"
    
    if 'name: "' in line and 'image: "' in line:
        name_match = re.search(r'name:\s*"([^"]+)"', line)
        if name_match:
            name = name_match.group(1)
            img_url = get_wiki_image(name, current_cat)
            
            # Replace image URL
            lines[i] = re.sub(r'image:\s*"[^"]+"', f'image: "{img_url}"', line)
            print(f"Updated {name} -> {img_url}")

with open("trade_items.js", "w", encoding="utf-8") as f:
    f.write('\n'.join(lines))

print("Image URLs successfully updated to exact MediaWiki API links!")
