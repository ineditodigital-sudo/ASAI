const fs = require('fs');
const path = require('path');

const pluginsDir = path.join(__dirname, 'public', 'wp-content', 'plugins');
const themesDir = path.join(__dirname, 'public', 'wp-content', 'themes');

if (fs.existsSync(pluginsDir)) {
    fs.rmSync(pluginsDir, { recursive: true, force: true });
}
if (fs.existsSync(themesDir)) {
    fs.rmSync(themesDir, { recursive: true, force: true });
}

console.log("Deleted plugins and themes from public.");
