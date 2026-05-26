import os
import glob

directory = r"C:\Users\Mujtaba Hasan\Downloads\Gohar"
html_files = glob.glob(os.path.join(directory, '*.html'))

replacements = {
    "href='/'": "href='index.html'",
    'href="/"': 'href="index.html"',
    "href='/raids'": "href='raids.html'",
    'href="/raids"': 'href="raids.html"',
    "href='/trials'": "href='trials.html'",
    'href="/trials"': 'href="trials.html"',
    "href='/sea-events'": "href='sea-events.html'",
    'href="/sea-events"': 'href="sea-events.html"',
    "href='/pvp-training'": "href='pvp-training.html'",
    'href="/pvp-training"': 'href="pvp-training.html"',
    "href='/grinding'": "href='grinding.html'",
    'href="/grinding"': 'href="grinding.html"',
    "href='/titles'": "href='titles.html'",
    'href="/titles"': 'href="titles.html"',
    "href='/trading'": "href='trading.html'",
    'href="/trading"': 'href="trading.html"',
    "href='/calculator'": "href='calculator.html'",
    'href="/calculator"': 'href="calculator.html"',
    "href='/why-us'": "href='why-us.html'",
    'href="/why-us"': 'href="why-us.html"',
    "href='/about'": "href='about.html'",
    'href="/about"': 'href="about.html"',
    "href='/contact'": "href='contact.html'",
    'href="/contact"': 'href="contact.html"'
}

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed links in {file}")
