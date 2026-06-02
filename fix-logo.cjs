const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

let totalFixed = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace bad elementor thumbs URL with the correct one
  content = content.replace(/\/wp-content\/uploads\/elementor\/thumbs\/LOGOTIPO-ASAI-COLORES-scaled-[^"']+/g, '/wp-content/uploads/2025/10/LOGOTIPO-ASAI-COLORES-1024x315.webp');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    totalFixed++;
    console.log('Fixed logo in:', file);
  }
});

console.log(`Total files fixed: ${totalFixed}`);
