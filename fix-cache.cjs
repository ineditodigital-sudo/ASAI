const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

let totalFixed = 0;
const timestamp = Date.now();

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace old cache buster if exists, or append new one
  content = content.replace(/css\/main\.css(\?v=\d+)?/g, 'css/main.css?v=' + timestamp);
  
  fs.writeFileSync(filePath, content);
  totalFixed++;
});

console.log('Cache-busted main.css in ' + totalFixed + ' files.');
