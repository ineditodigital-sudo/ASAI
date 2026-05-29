const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname);
const htmlFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));
const sourceRoot = "E:\\ASAI\\NUEVO SITIO ASAI";
const targetRoot = path.join(__dirname, "public");

const scriptsToCopy = new Set();

htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    // Match script src
    const regex = /<script[^>]+src=["'](\/wp-(?:content|includes)[^"']+)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        // Exclude autoptimize js because Vite warns about them, but wait, do we need them?
        // Actually, autoptimize js ARE referenced in the HTML! So we must copy them too!
        let scriptPath = match[1];
        // Strip query string e.g. ?ver=1.7.1058
        scriptPath = scriptPath.split('?')[0];
        scriptsToCopy.add(scriptPath);
    }
});

console.log(`Found ${scriptsToCopy.size} script files to copy.`);

scriptsToCopy.forEach(scriptPath => {
    // scriptPath is like /wp-content/plugins/elementor/assets/js/frontend.min.js
    const sourcePath = path.join(sourceRoot, scriptPath.replace(/\//g, '\\'));
    const targetPath = path.join(targetRoot, scriptPath.replace(/\//g, '\\'));
    
    if (fs.existsSync(sourcePath)) {
        // Create directory
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        // Copy file
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied: ${scriptPath}`);
    } else {
        console.log(`MISSING: ${sourcePath}`);
    }
});

