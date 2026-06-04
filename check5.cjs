const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');
const sIdx = html.indexOf('<style>\n.aeo-quick-answer {');
console.log('Index of style tag:', sIdx);
console.log(html.substring(Math.max(0, sIdx - 200), sIdx));
