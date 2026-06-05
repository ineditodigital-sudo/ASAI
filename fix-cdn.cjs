const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

let modified = 0;
files.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    let originalHtml = html;

    // 1. Bypass CDN cache for resized images by adding ?v=opt
    const imageNames = [
        'adaptadores-acero-724x1024.webp',
        'hidraulica-724x1024.webp',
        'neumatica-724x1024.webp',
        'cam-lock-724x1024.webp',
        'accesorios-724x1024.webp',
        'coples-rapidos-724x1024.webp',
        'industrial-1-724x1024.webp',
        'equipo-724x1024.webp',
        'LOGOTIPO-ASAI-COLORES-768x237.webp',
        'LOGO-ATREVETE-FULL-1-1-768x109.webp',
        'Banner-patrocinadores-Rieleros.webp'
    ];

    imageNames.forEach(img => {
        // Regex to replace .webp" or .webp' with .webp?v=opt"
        let re = new RegExp(img + '(["\'])', 'g');
        html = html.replace(re, img + '?v=opt$1');
        
        // Also fix in srcset
        let reSrcset = new RegExp(img + ' ', 'g');
        html = html.replace(reSrcset, img + '?v=opt ');
    });

    // 2. Add fetchpriority="high" to the Rieleros banner directly!
    // Since the image might be named ?v=opt now
    let rielerosRe = /<img([^>]*Banner-patrocinadores-Rieleros\.webp[^>]*)>/gi;
    html = html.replace(rielerosRe, (match, inner) => {
        if (!inner.includes('fetchpriority')) {
            // Check if it has loading="lazy" and remove it because hero images shouldn't be lazy
            let noLazy = inner.replace(/loading=["']lazy["']/i, '');
            return `<img fetchpriority="high" ${noLazy}>`;
        }
        return match;
    });

    if (html !== originalHtml) {
        fs.writeFileSync(p, html);
        let rootP = path.join(__dirname, f);
        if (fs.existsSync(rootP)) {
            fs.writeFileSync(rootP, html);
        }
        modified++;
    }
});

console.log(`Cache-busting tags added in ${modified} files.`);
