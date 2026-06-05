const fs = require('fs');
const html = fs.readFileSync('dist/diferencias-conexiones-npt-jic.html', 'utf8');
const wpPostStart = html.indexOf('data-elementor-type="wp-post"');
const firstContainerAfterWpPost = html.indexOf('data-element_type="container"', wpPostStart);
console.log('First container after wp-post:', firstContainerAfterWpPost);
