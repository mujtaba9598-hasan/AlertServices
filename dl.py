import os
import re

try:
    with open('scraped_debug.html', 'r', encoding='utf-8') as f:
        html = f.read()
    imgs = re.findall(r'src=["\'](https://bloxfruitsvalues.com/[^"\']+\.(?:png|webp|jpg))["\']', html)
    print(list(set(imgs))[:5])
except Exception as e:
    print(e)
