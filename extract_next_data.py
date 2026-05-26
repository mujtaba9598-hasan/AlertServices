import json
import cloudscraper
from bs4 import BeautifulSoup

def scrape_next_data():
    scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False})
    res = scraper.get("https://bloxfruitsvalues.com/calculator")
    if res.status_code == 200:
        soup = BeautifulSoup(res.text, 'html.parser')
        script = soup.find('script', id='__NEXT_DATA__')
        if script:
            data = json.loads(script.string)
            with open('next_data.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print("Successfully extracted next_data.json")
        else:
            print("Could not find __NEXT_DATA__")
    else:
        print(f"Failed to fetch. Status code: {res.status_code}")

if __name__ == "__main__":
    scrape_next_data()
