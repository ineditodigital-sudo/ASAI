const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));

let fixed = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let orig = content;
  
  // Replace '/hidraulica/' with '/hidraulica.html' etc in CATEGORY_URLS
  content = content.replace(/const CATEGORY_URLS=\['\/hidraulica\/','\/neumatica\/','\/adaptadores\/','\/industrial\/','\/coples-rapidos\/','\/cam-lock\/','\/accesorios\/','\/equipos\/'\];/g, 
    "const CATEGORY_URLS=['/hidraulica.html','/neumatica.html','/adaptadores.html','/industrial.html','/coples-rapidos.html','/cam-lock.html','/accesorios.html','/equipos.html'];");
    
  if (content !== orig) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixed++;
  }
});

console.log(`Fixed CATEGORY_URLS in ${fixed} files.`);
