const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');

const sIdx = html.indexOf('<section');
console.log('First <section> at:', sIdx);
const sEndIdx = html.indexOf('</section>');
console.log('First </section> at:', sEndIdx);
const aeoIdx = html.indexOf('<div class="aeo-quick-answer">');
console.log('AEO block at:', aeoIdx);

if (sIdx > -1) {
    console.log('Section snippet:', html.substring(sIdx, sIdx + 200));
}
if (aeoIdx > -1) {
    console.log('Text before AEO block:', html.substring(Math.max(0, aeoIdx - 100), aeoIdx));
}
