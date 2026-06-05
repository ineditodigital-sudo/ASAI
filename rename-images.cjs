const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const uploadsDir = path.join(distDir, 'wp-content', 'uploads');

const targets = [
    '2026/03/adaptadores-acero-724x1024.webp',
    '2026/03/hidraulica-724x1024.webp',
    '2026/03/neumatica-724x1024.webp',
    '2026/03/cam-lock-724x1024.webp',
    '2026/03/accesorios-724x1024.webp',
    '2026/03/coples-rapidos-724x1024.webp',
    '2026/03/industrial-1-724x1024.webp',
    '2026/03/equipo-724x1024.webp',
    '2025/10/LOGOTIPO-ASAI-COLORES-768x237.webp',
    '2026/04/LOGO-ATREVETE-FULL-1-1-768x109.webp',
    '2026/02/Banner-patrocinadores-Rieleros.webp'
];

// 1. Rename files locally (copy them to -opt.webp)
targets.forEach(target => {
    let oldPath = path.join(uploadsDir, target);
    if (fs.existsSync(oldPath)) {
        let newName = target.replace('.webp', '-opt.webp');
        // Handle the case where it already has -opt from a previous run? It doesn't.
        let newPath = path.join(uploadsDir, newName);
        fs.copyFileSync(oldPath, newPath);
        console.log(`Copied ${target} -> ${newName}`);
    }
});

// 2. Update HTML files
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));
let modified = 0;
htmlFiles.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    let originalHtml = html;

    targets.forEach(target => {
        let baseName = path.basename(target);
        let optName = baseName.replace('.webp', '-opt.webp');
        
        // Remove the ?v=opt we added earlier just in case
        let reOpt = new RegExp(baseName + '\\?v=opt', 'g');
        html = html.replace(reOpt, optName);
        
        // Replace regular occurrences
        let re = new RegExp(baseName, 'g');
        html = html.replace(re, optName);
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
console.log(`Updated HTML in ${modified} files.`);
