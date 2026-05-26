import urllib.request
import os

url_base = "https://alertservicing.netlify.app"
files_to_fetch = ["index.html", "calculator.html", "styles.css", "script.js", "trade_items.js", "calculator.js"]
output_dir = r"C:\Users\Mujtaba Hasan\Downloads\Gohar\netlify_backup"

os.makedirs(output_dir, exist_ok=True)

for file in files_to_fetch:
    url = f"{url_base}/{file}"
    out_path = os.path.join(output_dir, file)
    try:
        urllib.request.urlretrieve(url, out_path)
        print(f"Successfully downloaded {file}")
    except Exception as e:
        print(f"Failed to download {file}: {e}")
