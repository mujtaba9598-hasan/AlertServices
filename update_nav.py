import os
import glob

def update_nav():
    html_files = glob.glob('*.html')
    
    for file in html_files:
        if file == 'calculator.html':
            continue
            
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Target injection point:
        # <li><a href="trading.html" class="active">Trading</a></li> or without class
        # We'll just replace <li><a href="trading.html"
        
        # Make sure we don't duplicate
        if "calculator.html" in content:
            continue
            
        content = content.replace('<li><a href="trading.html">Trading</a></li>', '<li><a href="trading.html">Trading</a></li>\n      <li><a href="calculator.html">Calculator</a></li>')
        content = content.replace('<li><a href="trading.html" class="active">Trading</a></li>', '<li><a href="trading.html" class="active">Trading</a></li>\n      <li><a href="calculator.html">Calculator</a></li>')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")

if __name__ == "__main__":
    update_nav()
