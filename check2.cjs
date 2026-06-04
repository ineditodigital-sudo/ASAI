const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');
const cStart = html.indexOf('data-element_type="container"');
const dStart = html.lastIndexOf('<div', cStart);
console.log('First container:', html.substring(dStart, dStart + 500));
const aeoIdx = html.indexOf('<div class="aeo-quick-answer">');
console.log('AEO text:', html.substring(aeoIdx, aeoIdx + 50));
