import re

with open("trade_items.js", "r", encoding="utf-8") as f:
    content = f.read()

# Gamepass exact Fandom URLs
replacements = {
    'name: "Fruit Notifier"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/9/98/BadgeFruitNotifier.png"',
    'name: "+1 Fruit Storage"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/6/6a/BadgeFruitStorage.png"',
    'name: "2x Mastery"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/1/16/BadgeMasteryx2.png"',
    'name: "2x Money"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/c/cf/BadgeMoneyx2.png"',
    'name: "2x Boss Drops"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/3/3a/BadgeBossDrops.png"',
    
    # Custom Skins mapping to physical fruits
    'name: "Galaxy Empyrean Kitsune"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/6/6f/KitsuneFruit.png"',
    'name: "Crimson Kitsune"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/6/6f/KitsuneFruit.png"',
    'name: "Ember West Dragon"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/2/29/Dragon_Fruit.png"',
    'name: "Fiend Yeti"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/2/2f/Yeti_Fruit.png/revision/latest"',
    
    # Lightning Skins
    'name: "Purple Lightning"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/7/78/Lightning_Fruit.png"',
    'name: "Blue Lightning"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/7/78/Lightning_Fruit.png"',
    'name: "Yellow Lightning"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/7/78/Lightning_Fruit.png"',
    'name: "Red Lightning"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/7/78/Lightning_Fruit.png"',
    'name: "Green Lightning"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/7/78/Lightning_Fruit.png"',
    
    # Pain Skins
    'name: "Super Spirit Pain"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/4/40/Pain_Fruit.png"',
    'name: "Sadness Pain"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/4/40/Pain_Fruit.png"',
    'name: "Celestial Pain"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/4/40/Pain_Fruit.png"',
    'name: "Frustration Pain"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/4/40/Pain_Fruit.png"',
    'name: "Torment Pain"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/4/40/Pain_Fruit.png"',
    
    # Bomb Skins
    'name: "Azura Bomb"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/4/43/Bomb_Fruit.png"',
    'name: "Thermite Bomb"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/4/43/Bomb_Fruit.png"',
    'name: "Nuclear Bomb"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/4/43/Bomb_Fruit.png"',
    'name: "Celebration Bomb"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/4/43/Bomb_Fruit.png"',
    
    # Diamond Skins
    'name: "Rose Quartz Diamond"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/8/88/Diamond_Fruit.png"',
    'name: "Emerald Diamond"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/8/88/Diamond_Fruit.png"',
    'name: "Topaz Diamond"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/8/88/Diamond_Fruit.png"',
    'name: "Ruby Diamond"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/8/88/Diamond_Fruit.png"',
    
    # Portals, Werewolf, Meme, Eclipse, etc.
    'name: "Divine Portal"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/8/8a/Portal_Fruit.png"',
    'name: "Orange Portal"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/8/8a/Portal_Fruit.png"',
    'name: "Werewolf"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/0/02/Leopard_Fruit.png"', # Assuming Werewolf maps to Leopard in visuals
    'name: "Meme-Meme"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/0/02/Dough_Fruit.png"',
    'name: "Eclipse"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/5/5c/Dark_Fruit.png"',
    'name: "Parrot"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/e/ef/Falcon_Fruit.png"',
    
    # Eagles and Dragon Tokens
    'name: "Eagle Matrix"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/e/ef/Falcon_Fruit.png"',
    'name: "Eagle Requiem"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/e/ef/Falcon_Fruit.png"',
    'name: "Eagle Glacier"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/e/ef/Falcon_Fruit.png"',
    'name: "Dragon Token"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/2/29/Dragon_Fruit.png"',
    'name: "Permanent Dragon Token"': 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/2/29/Dragon_Fruit.png"',
}

lines = content.split('\n')
for i in range(len(lines)):
    line = lines[i]
    for key, new_image_str in replacements.items():
        if key in line:
            # Replace the old image field
            lines[i] = re.sub(r'image:\s*"[^"]+"', new_image_str, line)
            break

with open("trade_items.js", "w", encoding="utf-8") as f:
    f.write('\n'.join(lines))

print("Gamepasses and Skins successfully updated!")
