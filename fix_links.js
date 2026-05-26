const fs = require('fs');
const path = require('path');
const dir = __dirname;

fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Replace old blank discord links with the specific link
  content = content.replace(/href="https:\/\/discord\.gg\/"/g, 'href="https://discord.gg/fjherjCq6"');
  
  // Specifically in index.html and others, if we changed 'Join Discord' or 'Open Ticket' to contact.html, change back to discord
  // E.g., <a href="contact.html" class="btn btn-primary"><i class="fab fa-discord"></i> Join Discord</a>
  content = content.replace(/href="contact\.html"([^>]*><i class="fab fa-discord")/g, 'href="https://discord.gg/fjherjCq6" target="_blank"$1');

  // Also replace any contact.html link containing 'Ticket'
  content = content.replace(/href="contact\.html"([^>]*><i class="fas fa-ticket-alt")/g, 'href="https://discord.gg/fjherjCq6" target="_blank"$1');
  
  // In contact.html, we can link the word "Discord" or the AlertEasy name
  // Actually, the prompt says "make every discord hyperlinked to..." 
  // Let's replace the Discord card in contact.html: 
  // <p>Add me on Discord to book a service or ask questions.</p> -> Add me on <a href="https://discord.gg/fjherjCq6" style="color: var(--lime-green);">Discord</a>
  content = content.replace(/Add me on Discord/g, 'Add me on <a href="https://discord.gg/fjherjCq6" style="color: var(--lime-green); text-decoration: underline;" target="_blank">Discord</a>');

  fs.writeFileSync(path.join(dir, file), content);
});
console.log("Discord links updated!");
