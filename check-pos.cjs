const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');
const aeoIdx = html.indexOf('<div class="aeo-quick-answer">');
console.log('AEO at:', aeoIdx);
const containerStart = html.indexOf('data-element_type="container"');
console.log('First container at:', containerStart);
