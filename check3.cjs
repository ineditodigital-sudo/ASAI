const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');
const aeoIdx = html.indexOf('<div class="aeo-quick-answer">');
console.log('Surrounding HTML around AEO block:');
console.log(html.substring(Math.max(0, aeoIdx - 300), aeoIdx + 50));
