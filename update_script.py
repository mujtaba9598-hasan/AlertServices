import glob

def update_script():
    html_files = glob.glob('*.html')
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if "fruit_values.js" in content:
            content = content.replace('fruit_values.js', 'trade_items.js')
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated script src in {file}")

if __name__ == "__main__":
    update_script()
