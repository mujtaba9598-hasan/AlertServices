const fs = require('fs');
const path = require('path');
const cssPath = path.join(__dirname, 'styles.css');

let content = fs.readFileSync(cssPath, 'utf8');

// Replace root variables
if (!content.includes('--lime-rgb')) {
  content = content.replace('--lime-green: #39ff14;', '--lime-green: #39ff14;\n  --lime-rgb: 57, 255, 20;');
}

// Add blue theme
if (!content.includes('.blue-theme')) {
  content += `\nbody.blue-theme {\n  --lime-green: #00e5ff;\n  --lime-rgb: 0, 229, 255;\n  --lime-dark: #0088cc;\n}\n`;
}

// Replace all rgba(57, 255, 20, X) or rgba(57,255,20,X)
content = content.replace(/rgba\(57,\s*255,\s*20,\s*([0-9.]+)\)/g, 'rgba(var(--lime-rgb), $1)');

fs.writeFileSync(cssPath, content);
console.log("styles.css updated with rgb variables!");
