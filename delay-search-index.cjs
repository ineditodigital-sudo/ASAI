const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');

const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));
let count = 0;

htmlFiles.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    
    // Replace the aggressive startup
    let oldCode = "ensureIndex();boot();let tries=0;";
    let newCode = "setTimeout(()=>{ensureIndex();}, 7000); boot(); let tries=0;";
    
    if (html.includes(oldCode)) {
        html = html.replace(oldCode, newCode);
        fs.writeFileSync(p, html);
        
        // sync back to root if present
        let rootP = path.join(__dirname, f);
        if (fs.existsSync(rootP)) {
            fs.writeFileSync(rootP, html);
        }
        count++;
    }
});

console.log(`Delayed search index in ${count} files.`);
