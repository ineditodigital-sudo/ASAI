const fs = require('fs');
const html = fs.readFileSync('dist/index_from_server.html', 'utf8');
const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
console.log(imgs.map(m => m[1]).join('\n'));
