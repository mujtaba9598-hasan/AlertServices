import json
import re

# We will load the old trade_items.js content, find the normal Fruits and Gamepasses
# and just reconstruct the JS string.
with open("scraped_data.json", "r", encoding="utf-8") as f:
    scraped = json.load(f)

# A small dictionary mapping base fruit names to fandom URLs
image_map = {
    "Dragon": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/1/18/DragonFruit.png",
    "Kitsune": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/6/6f/KitsuneFruit.png",
    "Leopard": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/b/b5/LeopardFruit.png",
    "Tiger": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/b/b5/LeopardFruit.png",
    "Yeti": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/e/ea/BlizzardFruit.png",
    "Control": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/9/90/ControlFruit.png",
    "Lightning": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/a/ab/RumbleFruit.png",
    "Gas": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/6/61/SmokeFruit.png",
    "Dough": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/1/1a/DoughFruit.png",
    "T-Rex": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/b/b8/T-RexFruit.png",
    "Venom": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/c/c5/VenomFruit.png",
    "Spirit": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/0/07/SpiritFruit.png",
    "Mammoth": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/1/14/MammothFruit.png",
    "Gravity": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/a/a2/GravityFruit.png",
    "Pain": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/f/f0/PainFruit.png",
    "Portal": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/c/cb/PortalFruit.png",
    "Buddha": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/e/ea/BuddhaFruit.png",
    "Shadow": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/6/66/ShadowFruit.png",
    "Blizzard": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/e/ea/BlizzardFruit.png",
    "Creation": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/1/1a/DoughFruit.png",
    "Phoenix": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/8/89/PhoenixFruit.png",
    "Sound": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/3/30/SoundFruit.png",
    "Spider": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/a/ab/SpiderFruit.png",
    "Love": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/1/1a/LoveFruit.png",
    "Quake": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/0/07/QuakeFruit.png",
    "Magma": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/4/4d/MagmaFruit.png",
    "Ghost": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/e/ef/GhostFruit.png",
    "Light": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/4/4a/LightFruit.png",
    "Rubber": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/1/1c/RubberFruit.png",
    "Barrier": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/a/a8/BarrierFruit.png",
    "Ice": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/e/e4/IceFruit.png",
    "Dark": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/4/4b/DarkFruit.png",
    "Sand": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/8/87/SandFruit.png",
    "Diamond": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/6/6b/DiamondFruit.png",
    "Falcon": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/b/b3/FalconFruit.png",
    "Flame": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/e/ec/FlameFruit.png",
    "Spike": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/6/68/SpikeFruit.png",
    "Smoke": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/6/61/SmokeFruit.png",
    "Bomb": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/1/13/BombFruit.png",
    "Spring": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/e/e3/SpringFruit.png",
    "Chop": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/7/77/ChopFruit.png",
    "Spin": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/b/be/SpinFruit.png",
    "Rocket": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/3/30/RocketFruit.png",
    "Eagle": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/b/b3/FalconFruit.png", # Falcon image for Eagle
    "Blade": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/7/77/ChopFruit.png",  # Chop image for Blade
    "Meme-Meme": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/e/ea/BuddhaFruit.png",
    "Mythical Scrolls": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/9/98/Mythical_Scroll.png",
    "Legendary Scrolls": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/3/36/Legendary_Scroll.png",
    "Werewolf": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/b/b5/LeopardFruit.png",
    "Eclipse": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/4/4b/DarkFruit.png",
    "Parrot": "https://static.wikia.nocookie.net/blox-fruits-wiki/images/b/b3/FalconFruit.png",
}

def get_image(name):
    # Try exact match first
    if name in image_map:
        return image_map[name]
    
    # Try finding base fruit name in the item name
    for fruit_name, url in image_map.items():
        if fruit_name in name:
            return url
            
    # Default fallback
    return "https://static.wikia.nocookie.net/blox-fruits-wiki/images/b/b3/FalconFruit.png"

# Read existing trade_items.js to extract Fruits and Gamepasses
with open("trade_items.js", "r", encoding="utf-8") as f:
    js_content = f.read()

# We can use regex to extract the "Fruits" array and "Gamepasses" array exactly as they are.
fruits_match = re.search(r'"Fruits": \[\s*(.*?)\s*\],\s*"Permanent Fruits"', js_content, re.DOTALL)
gamepasses_match = re.search(r'"Gamepasses": \[\s*(.*?)\s*\],\s*"Skins"', js_content, re.DOTALL)

fruits_str = fruits_match.group(1) if fruits_match else ""
gamepasses_str = gamepasses_match.group(1) if gamepasses_match else ""

# Generate Permanent Fruits string
perms = scraped["Permanent Fruits"]
perms_str_list = []
for p in perms:
    img = get_image(p["name"])
    perms_str_list.append(f'    {{ name: "{p["name"]}", value: {p["value"]}, demand: 5, image: "{img}" }}')

perms_str = ",\n".join(perms_str_list)

# Generate Skins string
skins = scraped["Skins"]
skins_str_list = []
for s in skins:
    img = get_image(s["name"])
    skins_str_list.append(f'    {{ name: "{s["name"]}", value: {s["value"]}, demand: 5, image: "{img}" }}')

skins_str = ",\n".join(skins_str_list)

# Build the new JS file
new_js = f"""const tradeItems = {{
  "Fruits": [
    {fruits_str}
  ],
  "Permanent Fruits": [
{perms_str}
  ],
  "Gamepasses": [
    {gamepasses_str}
  ],
  "Skins": [
{skins_str}
  ]
}};

window.tradeItems = tradeItems;
"""

with open("trade_items.js", "w", encoding="utf-8") as f:
    f.write(new_js)
print("Updated trade_items.js successfully.")
