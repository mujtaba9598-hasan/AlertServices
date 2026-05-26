import os
import re
import json
import requests
from bs4 import BeautifulSoup
import cloudscraper

def scrape_values():
    print("Initializing Cloudscraper...")
    scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False})
    
    url = "https://bloxfruitsvalues.com/"
    print(f"Fetching {url} ...")
    response = scraper.get(url)
    
    if response.status_code != 200:
        print(f"Failed to fetch. Status code: {response.status_code}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    fruits = []
    
    os.makedirs('assets/fruits', exist_ok=True)

    # BloxFruitsValues puts fruits in grid elements, usually with class containing "fruit" or inside a list
    # Let's find all images that look like fruits
    images = soup.find_all('img')
    
    fruit_data = []
    
    # Simple fallback list if scraping DOM is too complex without seeing it
    # We will try to extract any div that has text "Value:" or similar
    # Since we can't see the exact DOM easily, let's do a regex on the HTML for values
    
    print("Saving HTML to inspect later if needed...")
    with open("scraped_debug.html", "w", encoding="utf-8") as f:
        f.write(response.text)

    # Instead of guessing the DOM, let's try a regex for the JS data or JSON if it exists
    # If not, let's just generate a baseline database with Fandom wiki images for now,
    # and update the scraper once we know the DOM.
    
    print("Scraping finished. Check scraped_debug.html for DOM structure.")

if __name__ == "__main__":
    scrape_values()
