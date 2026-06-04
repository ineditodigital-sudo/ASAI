const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

let modified = 0;
files.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    
    // Check if it has AEO
    if (html.includes('<style>.aeo-quick-answer {')) {
        
        // Find the start and end of the AEO block
        const styleStart = html.indexOf('<style>.aeo-quick-answer {');
        const endStr = '</div></div>'; // This closes the aeo-quick-answer block. Wait, the block is:
        // <div class="aeo-quick-answer"><div class="aeo-quick-answer-title">...</div><p>...</p></div>
        // So the end is after </p></div>
        
        const aeoStartIdx = html.indexOf('<div class="aeo-quick-answer">');
        const pCloseIdx = html.indexOf('</p>', aeoStartIdx);
        const divCloseIdx = html.indexOf('</div>', pCloseIdx);
        
        const fullBlock = html.substring(styleStart, divCloseIdx + 6);
        
        // Remove it from its current position
        html = html.replace(fullBlock, '');
        
        // Also visually hide the ugly H1 entry-title if it exists
        if (!html.includes('.visually-hidden-h1')) {
            html = html.replace('</head>', '<style>.visually-hidden-h1 { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0,0,0,0) !important; white-space: nowrap !important; border: 0 !important; }</style></head>');
            html = html.replace('class="entry-title"', 'class="entry-title visually-hidden-h1"');
        }

        // Now, find the first elementor section (usually the blue banner) and place the AEO block AFTER it.
        // Elementor structure: <section class="elementor-section ..."> ... </section>
        const firstSectionEnd = html.indexOf('</section>');
        if (firstSectionEnd > -1) {
            html = html.substring(0, firstSectionEnd + 10) + '\n' + fullBlock + '\n' + html.substring(firstSectionEnd + 10);
        } else {
            // fallback: put it after page-content but without h1
            const pcIdx = html.indexOf('<div class="page-content">');
            if (pcIdx > -1) {
                html = html.replace('<div class="page-content">', '<div class="page-content">' + fullBlock);
            }
        }
        
        fs.writeFileSync(p, html);
        // Also update root dir
        let rootP = path.join(__dirname, f);
        if (fs.existsSync(rootP)) {
            fs.writeFileSync(rootP, html);
        }
        modified++;
    }
});
console.log('Moved AEO block and hid H1 in ' + modified + ' files.');
