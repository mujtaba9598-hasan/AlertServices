import os
import re
import json
import cloudscraper
from bs4 import BeautifulSoup

def download_images():
    scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False})
    
    # URLs to scrape
    urls = [
        "https://bloxfruitsvalues.com/calculator",
        "https://bloxfruitsvalues.com/"
    ]
    
    os.makedirs('assets/images/perms', exist_ok=True)
    os.makedirs('assets/images/skins', exist_ok=True)
    
    img_urls = set()
    
    for url in urls:
        print(f"Fetching {url}")
        res = scraper.get(url)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            for img in soup.find_all('img'):
                src = img.get('src')
                if src:
                    if src.startswith('/'):
                        src = "https://bloxfruitsvalues.com" + src
                    img_urls.add(src)
    
    print(f"Found {len(img_urls)} unique images.")
    
    # Filter for perms and skins if they have identifiable names
    for url in img_urls:
        filename = url.split('/')[-1].split('?')[0]
        if 'perm' in filename.lower() or 'skin' in filename.lower() or 'kitsune' in filename.lower() or 'dragon' in filename.lower() or 'yeti' in filename.lower():
            try:
                print(f"Downloading {filename} ...")
                img_data = scraper.get(url).content
                path = f"assets/images/perms/{filename}"
                with open(path, 'wb') as f:
                    f.write(img_data)
            except Exception as e:
                print(f"Failed to download {url}: {e}")

if __name__ == "__main__":
    download_images()
