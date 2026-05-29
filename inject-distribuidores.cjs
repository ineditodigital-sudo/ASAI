const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'distribuidores.html');
let html = fs.readFileSync(filePath, 'utf8');

const logos = [
  { src: '/wp-content/uploads/2025/11/ALCA.webp', alt: 'ALCA' },
  { src: '/wp-content/uploads/2025/11/DIMABSA.webp', alt: 'DIMABSA' },
  { src: '/wp-content/uploads/2025/11/GRUPO-TRH.webp', alt: 'GRUPO TRH' },
  { src: '/wp-content/uploads/2025/11/HIDROCONEX.webp', alt: 'HIDROCONEX' },
  { src: '/wp-content/uploads/2025/11/ALINE.webp', alt: 'ALINE' },
  { src: '/wp-content/uploads/2025/11/BELMEN.webp', alt: 'BELMEN' },
  { src: '/wp-content/uploads/2025/11/HINEBA.webp', alt: 'HINEBA' },
  { src: '/wp-content/uploads/2025/11/MACOSUR.webp', alt: 'MACOSUR' },
  { src: '/wp-content/uploads/2025/11/MARISA.webp', alt: 'MARISA' }
];

let slidesHtml = logos.map(img => `
  <div class="swiper-slide custom-logo-slide">
    <img src="${img.src}" alt="${img.alt}" loading="lazy">
  </div>`).join('');

let swiperId = 'swiper-distribuidores-123';
let newCarouselHtml = `
  <div class="custom-carousel-wrapper" id="${swiperId}-wrap" style="margin-top: 40px; margin-bottom: 40px;">
    <h2 style="text-align: center; color: #00147d; font-family: 'LemonMilk', sans-serif; margin-bottom: 30px;">NUESTROS PRINCIPALES DISTRIBUIDORES</h2>
    <div class="swiper ${swiperId}">
      <div class="swiper-wrapper">
        ${slidesHtml}
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <div class="swiper-button-prev ${swiperId}-prev"></div>
    <div class="swiper-button-next ${swiperId}-next"></div>
  </div>
`;

// Insert the new carousel before the first logo
const alcaIdx = html.indexOf('/wp-content/uploads/2025/11/ALCA.webp');
if (alcaIdx !== -1) {
    // Find the container for these logos. Usually it's an e-con or elementor-widget-wrap.
    // Let's just find the closest previous `<div class="elementor-element` that is a container.
    let containerStart = html.lastIndexOf('<div class="elementor-element', alcaIdx);
    // Actually, to be safe, I will insert the new carousel at the start of that element, 
    // and I'll remove all the old images to clean up.
    
    html = html.substring(0, containerStart) + newCarouselHtml + html.substring(containerStart);
    
    // Now remove the old logos to prevent duplication
    logos.forEach(logo => {
        // Regex to remove the whole elementor-widget-image div containing this logo
        let regex = new RegExp('<div class="elementor-element[^>]+elementor-widget-image"[^>]*>[\\s\\S]*?' + logo.src.replace(/\//g, '\\/') + '[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>', 'i');
        html = html.replace(regex, '');
    });
}

// Add the global assets if missing (in case my previous script failed)
if (!html.includes('custom-carousel-wrapper')) {
    html = html.replace('</body>', newCarouselHtml + '\n</body>');
}

fs.writeFileSync(filePath, html);
console.log('Distribuidores carousel injected successfully.');
