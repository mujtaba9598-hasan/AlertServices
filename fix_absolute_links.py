import glob
import re

html_files = glob.glob('C:\\Users\\Mujtaba Hasan\\Downloads\\Gohar\\*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Use regex to find and replace href="/some-path" with href="some-path.html"
    # But ONLY if it's a known page
    pages = ['raids', 'trials', 'sea-events', 'pvp-training', 'grinding', 'titles', 'trading', 'calculator', 'why-us', 'about', 'contact', 'easter-egg-hints']
    
    for page in pages:
        content = re.sub(rf'href=[\'"]/{page}[\'"]', f'href="{page}.html"', content)
        
    # Handle the root path '/' -> 'index.html'
    content = re.sub(r'href=[\'"]/[\'"]', 'href="index.html"', content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("All absolute links fixed.")
