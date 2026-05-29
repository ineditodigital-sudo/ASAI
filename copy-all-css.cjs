const fs = require('fs');
const path = require('path');

const autoptimizeSrc = 'e:/ASAI/NUEVO SITIO ASAI/wp-content/cache/autoptimize/css';
const distCss = path.join(__dirname, 'dist/css');

fs.mkdirSync(distCss, { recursive: true });

// Find all unique CSS files referenced in dist HTML
const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));
const needed = new Set();

htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join(distDir, f), 'utf8');
  const matches = content.match(/\/css\/(autoptimize_[a-f0-9]+\.css)/g) || [];
  matches.forEach(m => needed.add(m.replace('/css/', '')));
});

console.log(`Need ${needed.size} unique CSS files`);

let copied = 0, missing = 0;
needed.forEach(filename => {
  const src = path.join(autoptimizeSrc, filename);
  const dest = path.join(distCss, filename);
  if (fs.existsSync(src)) {
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      copied++;
    }
  } else {
    console.log('MISSING:', filename);
    missing++;
  }
});

console.log(`Copied: ${copied}, Already present: ${needed.size - copied - missing}, Missing from backup: ${missing}`);
