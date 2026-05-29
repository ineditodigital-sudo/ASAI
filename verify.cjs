/**
 * check-background-url.cjs
 * Check the URL in the background-image CSS
 */
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Get the full background-image url context
const bgUrlMatch = html.match(/background-image:url\([^)]+\)/g) || [];
console.log('Background URL patterns:', bgUrlMatch.length);
bgUrlMatch.forEach((m,i) => console.log(`  [${i}]`, m.substring(0,300)));

// Search for image-16 with different path formats
const patterns = ['image-16', '2025/11/image', '11/image-16'];
patterns.forEach(pat => {
  const idx = html.indexOf(pat);
  if(idx >= 0) {
    console.log(`\nFound "${pat}" at position ${idx}:`);
    console.log(html.substring(idx-100, idx+200));
  } else {
    console.log(`\n"${pat}" NOT found`);
  }
});

// Check what CSS files are linked
const cssLinks = html.match(/href="([^"]+\.css[^"]*)"/g) || [];
console.log('\nCSS links found:');
cssLinks.forEach(l => console.log(' ', l));
