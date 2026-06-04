const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

function moveAeoAfterFirstContainer(html) {
    const aeoRegex = /<style>\s*\.aeo-quick-answer\s*\{[\s\S]*?<\/style>\s*<div class="aeo-quick-answer">[\s\S]*?<\/p>\s*<\/div>/i;
    const aeoMatch = html.match(aeoRegex);
    if (!aeoMatch) return html; // No AEO block found

    const aeoBlock = aeoMatch[0];
    html = html.replace(aeoBlock, ''); // Remove from original spot

    // Find the first elementor container
    const containerMarker = 'data-element_type="container"';
    const containerStart = html.indexOf(containerMarker);
    
    if (containerStart === -1) {
        // Fallback: put it back
        return html.replace('<div class="page-content">', '<div class="page-content">' + aeoBlock);
    }

    // Now find the start of the <div for this container
    const divStart = html.lastIndexOf('<div', containerStart);
    
    // Count divs to find the closing div
    let openDivs = 0;
    let idx = divStart;
    
    while (idx < html.length) {
        let nextOpen = html.indexOf('<div', idx);
        let nextClose = html.indexOf('</div>', idx);
        
        if (nextOpen !== -1 && nextOpen < nextClose) {
            openDivs++;
            idx = nextOpen + 4;
        } else if (nextClose !== -1) {
            openDivs--;
            idx = nextClose + 6;
            if (openDivs === 0) {
                // Found the matching close tag!
                break;
            }
        } else {
            break;
        }
    }
    
    // Insert AEO block right after the container's closing </div>
    if (openDivs === 0) {
        html = html.substring(0, idx) + '\n' + aeoBlock + '\n' + html.substring(idx);
    } else {
        html = html.replace('<div class="page-content">', '<div class="page-content">' + aeoBlock);
    }
    return html;
}

let modified = 0;
files.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    
    if (html.includes('class="aeo-quick-answer"')) {
        const newHtml = moveAeoAfterFirstContainer(html);
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
console.log('Moved AEO below banner in ' + modified + ' files.');
