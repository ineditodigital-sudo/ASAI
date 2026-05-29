const fs = require('fs');
const html = fs.readFileSync('dist/distribuidores.html', 'utf8');
const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
console.log(imgs.map(m => m[1]).join('\n'));
