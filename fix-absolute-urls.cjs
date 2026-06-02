const fs = require('fs');
const path = require('path');

const dir = __dirname;
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/https:\/\/asaiint\.com\/wp-content\//g, '/wp-content/');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
    }
});

console.log(`Replaced absolute URLs in ${modifiedCount} HTML files.`);

// Now check public/wp-content/cache/autoptimize/css if it exists
const cssDir = path.join(dir, 'wp-content', 'cache', 'autoptimize', 'css');
if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    let cssModified = 0;
    cssFiles.forEach(file => {
        const filePath = path.join(cssDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        content = content.replace(/https:\/\/asaiint\.com\/wp-content\//g, '/wp-content/');
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            cssModified++;
        }
    });
    console.log(`Replaced absolute URLs in ${cssModified} CSS files.`);
}
