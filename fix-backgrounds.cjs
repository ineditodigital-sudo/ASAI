/**
 * fix-backgrounds.cjs
 * Elementor sections use CSS background images that are lazy-loaded via JS.
 * The background image URL is stored in data-settings attribute.
 * We need to inject the background-image CSS inline so they show without JS.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));

let totalFixed = 0;
let totalFiles = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let changes = 0;

  // Fix e-con elements that have background images in their inline styles or data-settings
  // Pattern: elements with --background-image set via JS
  // These appear as: style="--background-image: url(...)" on e-con divs
  // OR the background is applied by Elementor JS which reads CSS variables
  
  // Actually the main issue: Elementor applies background via CSS like:
  // .elementor-element.elementor-element-XXXX:not(.elementor-motion-effects-element-type-background) {
  //   background-image: url(...)
  // }
  // This IS in the inline <style> tag at the top of the HTML, so it should work!
  
  // But WP Fastest Cache may have deferred loading of some background images.
  // Let's look for data-bg attributes which some lazy load plugins use
  content = content.replace(/data-bg="([^"]+)"/g, (match, url) => {
    changes++;
    return `style="background-image: url('${url}')"`;
  });

  // Also fix noscript tags - images inside noscript should be moved outside
  // Pattern: <noscript><img ... src="actual.jpg" .../></noscript>
  // followed by <img src='svg-placeholder' data-src="actual.jpg" />
  // We've already fixed the data-src issue, so noscript tags are now redundant
  // But let's keep them for SEO and just make sure the real img shows
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFiles++;
    console.log(`✅ Fixed backgrounds: ${file} (${changes} changes)`);
  }
  totalFixed += changes;
});

console.log(`\n🎉 Background fixes: ${totalFixed} issues across ${totalFiles} files.`);

// Now let's also check what images might be truly missing from disk
console.log('\n--- Checking for missing image files ---');
const testFile = path.join(DIR, 'index.html');
const testContent = fs.readFileSync(testFile, 'utf8');
const srcPattern = /src="(\/wp-content\/[^"]+)"/g;
let missing = 0;
let found = 0;
let match;
const checkedUrls = new Set();

while((match = srcPattern.exec(testContent)) !== null) {
  const url = match[1];
  if(checkedUrls.has(url)) continue;
  checkedUrls.add(url);
  
  // Convert URL to file path
  const filePath = path.join(DIR, url.replace(/\//g, path.sep));
  if(fs.existsSync(filePath)) {
    found++;
  } else {
    missing++;
    if(missing <= 20) console.log('  MISSING:', url);
  }
}
console.log(`\nImages in index.html: ${found} found, ${missing} missing`);
