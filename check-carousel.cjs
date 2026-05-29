const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');
const idx = html.toLowerCase().indexOf('automotriz');
if (idx > -1) {
  console.log(html.substring(idx - 1000, idx + 200));
}
