const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

function processFile(p, f) {
    let html = fs.readFileSync(p, 'utf8');
    
    const aeoRegex = /<style>\s*\.aeo-quick-answer[\s\S]*?<\/style>\s*<div class="aeo-quick-answer">[\s\S]*?<\/p>\s*<\/div>/i;
    const aeoMatch = html.match(aeoRegex);
    if (!aeoMatch) return;

    const aeoBlock = aeoMatch[0];
    
    // 1. Remove AEO block from current place
    let cleanHtml = html.replace(aeoBlock, '');
    
    // 2. Identify the blue banner container.
    // The easiest way to find the blue banner is to look for the first text node of the title, 
    // or look for the first container that has the dark blue background color.
    // In elementor, backgrounds are often inline or in a <style> block, but let's just find the h1 or title text.
    // Since each post has a different title, let's extract the title from the <title> tag.
    const titleMatch = cleanHtml.match(/<title>(.*?) - ASAI/i);
    let bannerContainerStart = -1;
    
    if (titleMatch) {
        let pageTitle = titleMatch[1].split(':')[0].trim(); // Get the main part of the title
        
        const pContent = cleanHtml.indexOf('page-content');
        if (pContent > -1) {
            let titleIdx = cleanHtml.toLowerCase().indexOf(pageTitle.toLowerCase(), pContent);
            if (titleIdx > -1) {
                // Now trace back to the closest container
                bannerContainerStart = cleanHtml.lastIndexOf('data-element_type="container"', titleIdx);
            }
        }
    }
    
    if (bannerContainerStart === -1) {
        // Fallback: search for the specific class of the blue banner if we know it.
        // Or search for 'e-con-boxed' inside wp-post.
        console.log("Could not find banner container for", f);
        return;
    }

    // Now find the start of the <div for this container
    const divStart = cleanHtml.lastIndexOf('<div', bannerContainerStart);
    
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
    
    // Insert AEO block right after the blue banner container closes!
    if (openDivs === 0) {
        cleanHtml = cleanHtml.substring(0, idx) + '\n' + aeoBlock + '\n' + cleanHtml.substring(idx);
        
        // Final sanity check: is the new index of AEO > the banner text index?
        fs.writeFileSync(p, cleanHtml);
        let rootP = path.join(__dirname, f);
        if (fs.existsSync(rootP)) {
            fs.writeFileSync(rootP, cleanHtml);
        }
        return true;
    }
    
    return false;
}

let modified = 0;
files.forEach(f => {
    let p = path.join(distDir, f);
    if (processFile(p, f)) {
        modified++;
    }
});
console.log('Successfully moved AEO past the blue banner in ' + modified + ' files.');
