const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');
const aeoIdx = html.indexOf('<div class="aeo-quick-answer">');
console.log('AEO index:', aeoIdx);
console.log(html.substring(Math.max(0, aeoIdx - 250), aeoIdx));
