import re
import cloudscraper

scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False})
res = scraper.get('https://bloxfruitsvalues.com/calculator')
html = res.text

with open('bfv.html', 'w', encoding='utf-8') as f:
    f.write(html)

matches = re.findall(r'/[^"\']*\.(?:png|webp|jpg)', html)
unique_matches = list(set(matches))
print(f"Found {len(unique_matches)} image paths in HTML.")

for match in unique_matches[:20]:
    print(match)
