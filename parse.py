import re
import json

with open("scraped.html", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Try to find JSON embedded in scripts
script_tags = re.findall(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', content, re.DOTALL)
if script_tags:
    try:
        data = json.loads(script_tags[0])
        # Try to find fruits deep in the Next.js props
        # We will just print the entire JSON keys to navigate or try to find 'fruits'
        print("Found NEXT_DATA. Looking for values...")
        with open("parsed.json", "w", encoding="utf-8") as out:
            json.dump(data, out, indent=2)
        print("Dumped NEXT_DATA to parsed.json")
    except Exception as e:
        print("Error parsing JSON:", e)
else:
    print("No NEXT_DATA script found. Searching for HTML patterns...")
    # Look for Fruit names and values in HTML if it's static
    # Like <p class="...">Kitsune</p> <p>115,000,000</p>
    # Just a generic regex for numbers
    matches = re.findall(r'>([A-Za-z\- ]+)<.*?>([\d,]+)<', content)
    for m in matches:
        print(m)
