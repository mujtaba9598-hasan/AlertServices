from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import json

def extract_images():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(options=options)
    
    print("Navigating to BFV...")
    driver.get("https://bloxfruitsvalues.com/calculator")
    
    # Wait for the JS to load
    time.sleep(5)
    
    images = driver.find_elements(By.TAG_NAME, 'img')
    urls = []
    for img in images:
        src = img.get_attribute('src')
        if src:
            urls.append(src)
            
    print(f"Extracted {len(urls)} image URLs.")
    
    with open('bfv_image_urls.json', 'w') as f:
        json.dump(list(set(urls)), f, indent=2)
        
    driver.quit()

if __name__ == "__main__":
    extract_images()
