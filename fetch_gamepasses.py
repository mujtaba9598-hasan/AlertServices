import urllib.request
import re

html = urllib.request.urlopen(urllib.request.Request('https://blox-fruits.fandom.com/wiki/Gamepasses', headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
images = re.findall(r'https://static.wikia.nocookie.net/roblox-blox-piece/images/[a-f0-9]/[a-f0-9]{2}/[^\"\?]+', html)

# Print unique images that look like gamepasses
unique_images = list(set(images))
for img in unique_images:
    if "Gamepass" in img or "Notifier" in img or "Storage" in img or "Mastery" in img or "Money" in img or "Boss" in img or "Dark" in img or "Boat" in img:
        print(img)
