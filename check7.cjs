const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');
const pContent = html.indexOf('page-content');
const aeoIdx = html.indexOf('<div class="aeo-quick-answer">');
const bannerIdx = html.toLowerCase().indexOf('diferencias entre conexiones npt y jic', pContent);
console.log('AEO index:', aeoIdx);
console.log('Banner text index:', bannerIdx);
