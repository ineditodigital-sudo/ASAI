const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, 'dist', 'wp-content', 'uploads');

const targets = [
    '2026/03/adaptadores-acero-724x1024.webp',
    '2026/03/hidraulica-724x1024.webp',
    '2026/03/neumatica-724x1024.webp',
    '2026/03/cam-lock-724x1024.webp',
    '2026/03/accesorios-724x1024.webp',
    '2026/03/coples-rapidos-724x1024.webp',
    '2026/03/industrial-1-724x1024.webp',
    '2026/03/equipo-724x1024.webp',
    '2025/10/LOGOTIPO-ASAI-COLORES-768x237.webp', // Reported size 768x237 rendered 247x76
    '2026/04/LOGO-ATREVETE-FULL-1-1-768x109.webp' // Reported size 768x109
];

async function resizeImages() {
    for (const target of targets) {
        const filePath = path.join(uploadsDir, target);
        if (fs.existsSync(filePath)) {
            try {
                const statsBefore = fs.statSync(filePath).size;
                
                // Read into buffer to allow overwriting the same file
                const buffer = fs.readFileSync(filePath);
                
                // Resize to 450px width for the large images (which covers 303px render + some retina)
                // For the logos, resize to 400px width.
                let targetWidth = 450;
                if (target.includes('LOGO')) targetWidth = 400;

                const newBuffer = await sharp(buffer)
                    .resize({ width: targetWidth, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer();
                
                fs.writeFileSync(filePath, newBuffer);
                const statsAfter = fs.statSync(filePath).size;
                console.log(`Optimized ${target}: ${(statsBefore/1024).toFixed(1)}KB -> ${(statsAfter/1024).toFixed(1)}KB`);
            } catch (err) {
                console.error(`Error processing ${target}:`, err.message);
            }
        } else {
            console.log(`File not found: ${filePath}`);
        }
    }
}

resizeImages();
