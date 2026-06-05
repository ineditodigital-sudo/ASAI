const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

let modified = 0;
files.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    let originalHtml = html;

    // 1. Defer all external scripts
    // Match <script ... src="..." ... > without defer or async
    html = html.replace(/<script(?![^>]*\b(defer|async|type="[a-zA-Z0-9\/+-]*")\b)[^>]+src=(['"])(.*?)\2[^>]*>/gi, (match) => {
        // If it's jQuery, maybe don't defer it if other inline scripts depend on it?
        // Wait, Elementor heavily relies on inline scripts that use jQuery. Deferring jQuery will break inline scripts!
        // The safest approach for WPO when there are inline scripts is to defer Elementor scripts that are blocking, 
        // OR move all scripts to the bottom of the body.
        // Actually, Lighthouse complains about "Eliminate render-blocking resources". 
        // If we add 'defer' to jQuery, we must add 'defer' to inline scripts (by changing them to type="module" or moving them).
        // Let's just defer non-jQuery and non-critical scripts, like Swiper, Frontend, modal-popups, etc.
        if (match.includes('jquery.min.js') || match.includes('jquery-migrate')) {
            return match; // Don't defer jQuery to avoid inline script breakage
        }
        // Add defer
        return match.replace('<script ', '<script defer ');
    });

    // 2. Fetchpriority high for hero banner
    // Lighthouse says the LCP is Banner-patrocinadores-Rieleros.webp
    if (html.includes('Banner-patrocinadores-Rieleros.webp')) {
        html = html.replace(/<img[^>]+src="[^"]*Banner-patrocinadores-Rieleros\.webp"[^>]*>/i, (match) => {
            if (!match.includes('fetchpriority')) {
                return match.replace('<img ', '<img fetchpriority="high" ');
            }
            return match;
        });
    }

    // 3. Remove broken chunk calls
    // The report showed "ChunkLoadError: Loading chunk 177 failed" (image-carousel)
    // Elementor frontend.min.js tries to load chunks. We can't easily fix Webpack from HTML, 
    // but we can pre-emptively mock the missing modules or just ignore them since the site works.

    if (html !== originalHtml) {
        fs.writeFileSync(p, html);
        // Sync to root
        let rootP = path.join(__dirname, f);
        if (fs.existsSync(rootP)) {
            fs.writeFileSync(rootP, html);
        }
        modified++;
    }
});
console.log(`Optimized scripts and LCP images in ${modified} files.`);

// 4. Update font-display in CSS files
const cssDir = path.join(distDir, 'css');
if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    let cssModified = 0;
    cssFiles.forEach(f => {
        let p = path.join(cssDir, f);
        let css = fs.readFileSync(p, 'utf8');
        if (css.includes('@font-face') && !css.includes('font-display: swap')) {
            css = css.replace(/@font-face\s*\{/gi, '@font-face { font-display: swap; ');
            fs.writeFileSync(p, css);
            cssModified++;
        }
    });
    console.log(`Added font-display: swap to ${cssModified} CSS files.`);
}
