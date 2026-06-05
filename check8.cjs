const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');
const pContent = html.indexOf('page-content');
const aeoIdx = html.indexOf('<div class="aeo-quick-answer">');
const bannerTextIdx = html.toLowerCase().indexOf('diferencias entre conexiones npt y jic', pContent);
const bannerContainerStart = html.lastIndexOf('data-element_type="container"', bannerTextIdx);

console.log('AEO index:', aeoIdx);
console.log('Banner text index:', bannerTextIdx);
console.log('Banner Container start index:', bannerContainerStart);
