import glob
import os

html_files = glob.glob('*.html')
corrupted = []

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "</html>" not in content or "<nav>" not in content or "<body>" not in content:
        corrupted.append(file)
        print(f"Corrupted: {file} (Length: {len(content)})")
    else:
        # Check for weird string truncations
        if 'href="tradin' in content:
            corrupted.append(file)
            print(f"Corrupted (tradin): {file}")
        elif 'cursor: pointer;' in content and '<div class="diff-bar"' in content:
            # specifically for calculator.html
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if 'cursor: pointer;' in line:
                    if i + 1 < len(lines) and '<div class="diff-bar"' in lines[i+1]:
                         corrupted.append(file)
                         print(f"Corrupted (calculator): {file}")
                         break

print(f"Total HTML files: {len(html_files)}")
print(f"Total corrupted: {len(set(corrupted))}")
