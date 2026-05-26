import re

with open("trade_items.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # 1. Skip Barrier and Falcon
    if 'name: "Barrier"' in line or 'name: "Perm Barrier"' in line:
        continue
    if 'name: "Falcon"' in line or 'name: "Perm Eagle"' in line:
        # Note: Perm Eagle was mapped to Falcon Fruit in our previous step
        continue
        
    # 2. Fix Dragons
    if 'name: "West Dragon"' in line or 'name: "East Dragon"' in line or 'name: "Perm West Dragon"' in line or 'name: "Perm East Dragon"' in line:
        line = re.sub(r'image:\s*"[^"]+"', 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/2/29/Dragon_Fruit.png"', line)
        
    # 3. Fix Yeti
    if 'name: "Yeti"' in line or 'name: "Perm Yeti"' in line:
        # Ignore "Fiend Yeti" which is a skin
        if 'name: "Fiend Yeti"' not in line:
            line = re.sub(r'image:\s*"[^"]+"', 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/2/2f/Yeti_Fruit.png/revision/latest"', line)
            
    # 4. Fix Gas
    if 'name: "Gas"' in line or 'name: "Perm Gas"' in line:
        line = re.sub(r'image:\s*"[^"]+"', 'image: "https://static.wikia.nocookie.net/roblox-blox-piece/images/e/ed/Gas_Fruit.png/revision/latest"', line)
        
    new_lines.append(line)

# Handle trailing commas if we removed the last item in a list
# In this structure, usually the last item might not have a comma.
# Let's clean up trailing commas before closing brackets
content = "".join(new_lines)
content = re.sub(r',\s*\]', '\n  ]', content)

with open("trade_items.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Data fixed successfully.")
