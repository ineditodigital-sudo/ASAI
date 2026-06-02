const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
let count = 0;

// Get all HTML files in dist root
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const before = content;

  // Fix autoptimize CSS path - move from wp-content/cache to /css/
  content = content.replace(
    /href="\/wp-content\/cache\/autoptimize\/css\/(autoptimize_[a-f0-9]+\.css)"/g,
    'href="/css/$1"'
  );

  if (content !== before) changed = true;

  if (changed) {
    fs.writeFileSync(filePath, content);
    count++;
  }
});

console.log('Fixed CSS paths in ' + count + ' HTML files');
