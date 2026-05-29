const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace href="/something.html" with href="/something"
    content = content.replace(/href="\/([a-zA-Z0-9_-]+)\.html([#"?]?)/g, 'href="/$1$2');
    
    // Also fix the category urls in the JS
    content = content.replace(/const CATEGORY_URLS=\['\/hidraulica\.html','\/neumatica\.html','\/adaptadores\.html','\/industrial\.html','\/coples-rapidos\.html','\/cam-lock\.html','\/accesorios\.html','\/equipos\.html'\];/g, 
        "const CATEGORY_URLS=['/hidraulica','/neumatica','/adaptadores','/industrial','/coples-rapidos','/cam-lock','/accesorios','/equipos'];");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
    }
});

console.log(`Removed .html from links in ${modifiedCount} files.`);
