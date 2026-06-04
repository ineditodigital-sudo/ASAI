const fs = require('fs');
const css = fs.readFileSync('dist/css/main.css', 'utf8');
const lines = css.split('\n');
console.log('Last 40 lines of main.css:');
console.log(lines.slice(-40).join('\n'));
