const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));

let totalFixed = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Remove <style>.lazyload{display:none}</style>
  content = content.replace(/<style>\.lazyload\{display:none\}<\/style>/gi, '');
  content = content.replace(/<style type="text\/css">\.lazyload\{display:none\}<\/style>/gi, '');

  // Remove lazyload classes from elements
  content = content.replace(/class="([^"]*)lazyload([^"]*)"/gi, (match, p1, p2) => {
    const newClass = `${p1}${p2}`.replace(/\s+/g, ' ').trim();
    return newClass ? `class="${newClass}"` : '';
  });
  
  content = content.replace(/class="([^"]*)lazyloading([^"]*)"/gi, (match, p1, p2) => {
    const newClass = `${p1}${p2}`.replace(/\s+/g, ' ').trim();
    return newClass ? `class="${newClass}"` : '';
  });

  content = content.replace(/class="([^"]*)lazyloaded([^"]*)"/gi, (match, p1, p2) => {
    const newClass = `${p1}${p2}`.replace(/\s+/g, ' ').trim();
    return newClass ? `class="${newClass}"` : '';
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixed++;
  }
});

console.log(`Fixed lazyload display issues in ${totalFixed} files.`);
