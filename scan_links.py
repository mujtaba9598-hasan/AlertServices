import glob
import re
import os

html_files = glob.glob('C:\\Users\\Mujtaba Hasan\\Downloads\\Gohar\\*.html')

issues = []

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find href="/..." or src="/..."
    matches = re.findall(r'(?:href|src)=[\'"](/[^\'"]*)[\'"]', content)
    for m in matches:
        # Ignore external links starting with //
        if not m.startswith('//'):
            issues.append(f"{os.path.basename(file)}: found absolute local link -> {m}")

if issues:
    print("Found broken absolute links:")
    for issue in issues:
        print(issue)
else:
    print("Scan complete: No absolute local links found. Everything is perfectly formatted for local use!")
