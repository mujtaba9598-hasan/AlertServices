const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;
const htmlFiles = fs.readdirSync(directoryPath).filter(file => file.endsWith('.html'));

const newNav = `<ul class="nav-links">
      <li><a href="index.html" id="index">Home</a></li>
      <li class="dropdown">
        <a href="#" id="services">Services <i class="fas fa-caret-down"></i></a>
        <ul class="dropdown-menu">
          <li><a href="raids.html" id="raids">Raids</a></li>
          <li><a href="trials.html" id="trials">V4 Trials</a></li>
          <li><a href="sea-events.html" id="sea-events">Sea Events</a></li>
          <li><a href="pvp-training.html" id="pvp-training">PvP</a></li>
          <li><a href="grinding.html" id="grinding">Grinding</a></li>
          <li><a href="titles.html" id="titles">Titles</a></li>
        </ul>
      </li>
      <li><a href="trading.html" id="trading">Trading</a></li>
      <li><a href="why-us.html" id="why-us">Why Us</a></li>
      <li><a href="about.html" id="about">About Us</a></li>
      <li><a href="contact.html" id="contact">Contact</a></li>
    </ul>`;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(path.join(directoryPath, file), 'utf8');
  
  // Replace the existing nav-links block
  const navRegex = /<ul class="nav-links">[\s\S]*?<\/ul>/;
  content = content.replace(navRegex, newNav);

  // Set active class
  const idName = file.split('.')[0];
  // We want to replace `id="filename"` with `class="active" id="filename"`
  // If the file is one of the services, we also highlight the 'Services' dropdown
  
  content = content.replace(`id="${idName}"`, `class="active" id="${idName}"`);
  
  const services = ['raids', 'trials', 'sea-events', 'pvp-training', 'grinding', 'titles'];
  if (services.includes(idName)) {
    content = content.replace(`id="services"`, `class="active" id="services"`);
  }

  // Remove the remaining id attributes from the nav links to clean up
  // Be careful not to remove the active ones' ids if we just added class="active" id="..."
  // Actually, we can just strip id="..." from the final string
  content = content.replace(/ id="[a-z-]+" /g, ' ');
  content = content.replace(/ id="[a-z-]+">/g, '>');

  fs.writeFileSync(path.join(directoryPath, file), content);
  console.log(`Updated ${file}`);
});
