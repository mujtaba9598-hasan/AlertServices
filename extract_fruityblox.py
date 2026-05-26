from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import json

options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(options=options)
driver.get("https://fruityblox.com/fruits")
time.sleep(5)

images = driver.find_elements(By.TAG_NAME, 'img')
urls = [img.get_attribute('src') for img in images if img.get_attribute('src')]
print(f"Extracted {len(urls)} image URLs.")
with open('fruityblox_urls.json', 'w') as f:
    json.dump(list(set(urls)), f, indent=2)
driver.quit()
