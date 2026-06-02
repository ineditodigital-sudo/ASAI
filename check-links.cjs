const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const links = html.match(/<link[^>]+>/g);
console.log(links ? links.join('\n') : 'No links');
