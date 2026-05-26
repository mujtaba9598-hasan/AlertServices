import os

template_file = r"C:\Users\Mujtaba Hasan\Downloads\Gohar\index.html"
with open(template_file, 'r', encoding='utf-8') as f:
    template = f.read()

pages = {
    "raids.html": ("Raids", "Raids Service", "Professional Raid Carries"),
    "trials.html": ("V4 Trials", "V4 Trials Service", "Fast & Reliable V4 Awakening"),
    "sea-events.html": ("Sea Events", "Sea Events Service", "Leviathan, Terrorshark, and more"),
    "pvp-training.html": ("PvP Training", "PvP Training Service", "Learn combos from the pros"),
    "grinding.html": ("Grinding", "Grinding Service", "Max Level & Mastery Boosting"),
    "titles.html": ("Titles", "Titles Service", "Rare & Event Titles Unlocking")
}

directory = r"C:\Users\Mujtaba Hasan\Downloads\Gohar"

for filename, (title, hero_title, hero_subtitle) in pages.items():
    content = template.replace(
        "<title>Alert Service | Blox Fruits Boosting</title>",
        f"<title>{title} | Alert Service</title>"
    )
    content = content.replace(
        '<h1 class="hero-title" style="text-shadow: 0 0 20px var(--lime-green), 0 0 40px var(--lime-green);">Alert Service</h1>',
        f'<h1 class="hero-title" style="text-shadow: 0 0 20px var(--lime-green), 0 0 40px var(--lime-green);">{hero_title}</h1>'
    )
    content = content.replace(
        '<p class="hero-subtitle">The Premium Blox Fruits Boosting & Trading Community</p>',
        f'<p class="hero-subtitle">{hero_subtitle}</p>'
    )
    
    # Update active nav state
    content = content.replace('<li><a href="index.html" class="active">Home</a></li>', '<li><a href="index.html">Home</a></li>')
    # Because it's in the dropdown, we don't strictly need to set an active state for the child, 
    # but we will just write it out.
    
    out_path = os.path.join(directory, filename)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Rebuilt {filename}")
