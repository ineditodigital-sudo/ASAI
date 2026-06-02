const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

let totalFixed = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1. Replace src="data:image/svg..." with data-src value
  //    Pattern: src="data:image/svg+xml,..." data-src="REAL_URL"
  content = content.replace(
    /src="data:image\/svg\+xml[^"]*"\s+(?:data-srcset="[^"]*"\s+)?data-src="([^"]+)"/g,
    'src="$1"'
  );

  // 2. Also handle reversed order: data-src first, then src placeholder
  content = content.replace(
    /data-src="([^"]+)"\s+(?:data-srcset="[^"]*"\s+)?src="data:image\/svg\+xml[^"]*"/g,
    'src="$1"'
  );

  // 3. Handle data-srcset -> srcset
  content = content.replace(/\s+data-srcset="([^"]*)"/g, ' srcset="$1"');

  // 4. Remove leftover data-src attributes (in case some weren't caught above)
  content = content.replace(/\s+data-src="([^"]*)"/g, '');

  // 5. Remove lazyload class references
  content = content.replace(/\blazyloaded\b/g, '');
  content = content.replace(/\blazyload\b/g, '');

  // 6. Remove lazysizes script tag (no longer needed)
  content = content.replace(
    /<script[^>]+lazysizes\.min\.js[^>]*><\/script>/g,
    ''
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    totalFixed++;
    console.log('Fixed lazy loading in:', file);
  }
});

console.log(`\nTotal files fixed: ${totalFixed}/${htmlFiles.length}`);
