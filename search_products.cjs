const fs = require('fs');
const html = fs.readFileSync('neumatica.html', 'utf8');
const lines = html.split('\n');
let found = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('codigo') || lines[i].includes('código') || lines[i].includes('Código') || lines[i].includes('Codigo')) {
    console.log(`Line ${i}: ${lines[i].substring(0, 100)}...`);
    found = true;
  }
}
if (!found) console.log("No product codes found by simple search.");
