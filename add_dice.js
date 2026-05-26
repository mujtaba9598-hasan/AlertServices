const fs = require('fs');
const path = require('path');
const dir = __dirname;

const diceHtml = `\n  <!-- Easter Egg Dice -->\n  <div class="easter-egg-dice" onclick="rollDice()">\n    <i class="fas fa-dice-d20"></i>\n  </div>\n`;

fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  if (!content.includes('easter-egg-dice')) {
    // Insert right after <body>
    content = content.replace(/<body>/, `<body>${diceHtml}`);
    fs.writeFileSync(path.join(dir, file), content);
  }
});
console.log("Dice added to all files!");
