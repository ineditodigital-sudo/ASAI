const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

let modified = 0;
files.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    
    // Check if it has AEO
    if (html.includes('class="aeo-quick-answer"')) {
        
        // Use regex to find the style block and the div block
        const blockRegex = /<style>[\s\S]*?<\/style>[\s\S]*?<div class="aeo-quick-answer">[\s\S]*?<\/p>\s*<\/div>/i;
        const match = html.match(blockRegex);
        
        if (match) {
            const fullBlock = match[0];
            // Remove it from current position
            html = html.replace(fullBlock, '');
            
            // Hide H1
            if (!html.includes('.visually-hidden-h1')) {
                html = html.replace('</head>', '<style>.visually-hidden-h1 { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0,0,0,0) !important; white-space: nowrap !important; border: 0 !important; }</style></head>');
                html = html.replace('class="entry-title"', 'class="entry-title visually-hidden-h1"');
            }

            // Find first section
            const firstSectionEnd = html.indexOf('</section>');
            if (firstSectionEnd > -1) {
                html = html.substring(0, firstSectionEnd + 10) + '\\n' + fullBlock + '\\n' + html.substring(firstSectionEnd + 10);
            } else {
                html = html.replace('<div class="page-content">', '<div class="page-content">' + fullBlock);
            }
            
            fs.writeFileSync(p, html);
            let rootP = path.join(__dirname, f);
            if (fs.existsSync(rootP)) {
                fs.writeFileSync(rootP, html);
            }
            modified++;
        }
    }
});
console.log('Moved AEO block and hid H1 in ' + modified + ' files.');
