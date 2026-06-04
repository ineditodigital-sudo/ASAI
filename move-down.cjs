const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

function moveAeoDownOneContainer(html) {
    const aeoRegex = /<style>\n?\.aeo-quick-answer\s*\{[\s\S]*?<\/style>\n*<div class="aeo-quick-answer">[\s\S]*?<\/p>\s*<\/div>/i;
    const aeoMatch = html.match(aeoRegex);
    if (!aeoMatch) return html;

    const aeoBlock = aeoMatch[0];
    const aeoStartIdx = html.indexOf(aeoBlock);
    
    // Remove it from its current place
    let cleanHtml = html.substring(0, aeoStartIdx) + html.substring(aeoStartIdx + aeoBlock.length);
    
    // Starting from where we removed it, find the NEXT container
    const containerMarker = 'data-element_type="container"';
    const nextContainerStart = cleanHtml.indexOf(containerMarker, aeoStartIdx - 100);
    
    if (nextContainerStart === -1) {
        return html; // fallback
    }

    // Find the opening <div of this next container
    const divStart = cleanHtml.lastIndexOf('<div', nextContainerStart);
    
    let openDivs = 0;
    let idx = divStart;
    
    while (idx < cleanHtml.length) {
        let nextOpen = cleanHtml.indexOf('<div', idx);
        let nextClose = cleanHtml.indexOf('</div>', idx);
        
        if (nextOpen !== -1 && nextOpen < nextClose) {
            openDivs++;
            idx = nextOpen + 4;
        } else if (nextClose !== -1) {
            openDivs--;
            idx = nextClose + 6;
            if (openDivs === 0) {
                break;
            }
        } else {
            break;
        }
    }
    
    // Insert AEO block right after this container closes
    if (openDivs === 0) {
        cleanHtml = cleanHtml.substring(0, idx) + '\n' + aeoBlock + '\n' + cleanHtml.substring(idx);
    } else {
        return html; // fallback
    }
    return cleanHtml;
}

let modified = 0;
files.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    
    if (html.includes('class="aeo-quick-answer"')) {
        const newHtml = moveAeoDownOneContainer(html);
        if (newHtml !== html) {
            fs.writeFileSync(p, newHtml);
            let rootP = path.join(__dirname, f);
            if (fs.existsSync(rootP)) {
                fs.writeFileSync(rootP, newHtml);
            }
            modified++;
        }
    }
});
console.log('Moved AEO down one more container in ' + modified + ' files.');
