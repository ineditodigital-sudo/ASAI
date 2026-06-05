const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');
const wpPostStart = html.indexOf('data-elementor-type="wp-post"');
const bannerTextIdx = html.toLowerCase().indexOf('diferencias entre conexiones npt y jic', wpPostStart);
const bannerContainerStart = html.lastIndexOf('data-element_type="container"', bannerTextIdx);

console.log('wp-post start:', wpPostStart);
console.log('Banner container start:', bannerContainerStart);
