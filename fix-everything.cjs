const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

// 1. Remove GRUPO TRH from all files
htmlFiles.forEach(file => {
    let filePath = path.join(distDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let original = html;
    
    // Remove TRH mentions in text
    html = html.replace(/Grupo TRH/gi, '');
    
    // Remove TRH images
    // If it's inside a swiper-slide or elementor widget, we should ideally remove the whole slide.
    // Let's remove the whole custom-logo-slide containing TRH:
    html = html.replace(/<div class="swiper-slide[^>]*>[\s\S]*?GRUPO-TRH[\s\S]*?<\/div>\s*/gi, '');
    
    // Let's remove elementor blocks containing TRH
    html = html.replace(/<div class="elementor-element[^>]*>[\s\S]*?GRUPO-TRH[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '');

    // Just in case, remove any remaining TRH image tags
    html = html.replace(/<img[^>]*GRUPO-TRH[^>]*>/gi, '');
    
    if (html !== original) {
        fs.writeFileSync(filePath, html);
    }
});

// 2. Restore index.html from index_from_server.html and rebuild carousels properly
const indexBackup = path.join(distDir, 'index_from_server.html');
const indexPath = path.join(distDir, 'index.html');
let indexHtml = fs.readFileSync(indexBackup, 'utf8');

// The Soluciones images in index_from_server.html
const solImages = [
    { src: '/assets/autasai-rey13y6o0ophvih7pt5n8dcr15s8jwl968pj9xgkjs-D8EeGwyr.webp', alt: 'Automotriz' },
    { src: '/assets/consasai-rey13y6o0ophvih7pt5n8dcr15s8jwl968pj9xgkjs-C_0HQUkY.webp', alt: 'Construcción' },
    { src: '/assets/textasai-rey13y6o0ophvih7pt5n8dcr15s8jwl968pj9xgkjs-CBML0TG3.webp', alt: 'Textil' },
    { src: '/assets/agrasai-rey13y6o0ophvih7pt5n8dcr15s8jwl968pj9xgkjs-CI5pjb0d.webp', alt: 'Agrícola' },
    { src: '/assets/petqasai-rey13y6o0ophvih7pt5n8dcr15s8jwl968pj9xgkjs-D3J85qRA.webp', alt: 'Petroquímica' },
    { src: '/assets/maqasai-rey13z4i7iqs74fukbk9sv47mjnlrlozidd0r7f6dk-C7uvS6Gg.webp', alt: 'Maquinaria' },
    { src: '/assets/tranasai-rey13y6o0ophvih7pt5n8dcr15s8jwl968pj9xgkjs-U4inZbRW.jpg', alt: 'Transporte' },
    { src: '/assets/metmeasai-rey13y6o0ophvih7pt5n8dcr15s8jwl968pj9xgkjs-TwUz4En2.webp', alt: 'Metalmecánica' },
    { src: '/assets/alimasai-scaled-rey13y6o0ophvih7pt5n8dcr15s8jwl968pj9xgkjs-CpoX2QlB.webp', alt: 'Alimenticia' },
    { src: '/assets/minasai-rge2ip0mpwqpyi4lgb2ovfg3752rt3m4cu6o9rfgnc-DsBkwkXm.webp', alt: 'Minería' }
];

// The Distribuidores images in index_from_server.html (Excluding TRH)
const distImages = [
    { src: '/wp-content/uploads/2025/11/ALCA-300x300.webp', alt: 'ALCA' },
    { src: '/wp-content/uploads/2025/11/DIMABSA-300x300.webp', alt: 'DIMABSA' },
    { src: '/wp-content/uploads/2025/11/HIDROCONEX-300x300.webp', alt: 'HIDROCONEX' },
    { src: '/wp-content/uploads/2025/11/HINEBA-300x300.webp', alt: 'HINEBA' },
    { src: '/wp-content/uploads/2025/11/MACOSUR-300x300.webp', alt: 'MACOSUR' },
    { src: '/wp-content/uploads/2025/11/MARISA-300x300.webp', alt: 'MARISA' },
    { src: '/wp-content/uploads/2025/11/ALINE-300x300.webp', alt: 'ALINE' },
    { src: '/wp-content/uploads/2025/11/BELMEN-300x300.webp', alt: 'BELMEN' },
    { src: '/wp-content/uploads/2025/11/HIDROCONEX-1-300x300.webp', alt: 'HIDROCONEX' },
    { src: '/wp-content/uploads/2026/03/Frame-5-_1_-300x300.webp', alt: 'Distribuidor' }
];

function buildCarousel(images, isLogos) {
    let swiperId = 'swiper-' + Math.random().toString(36).substr(2, 9);
    let slidesHtml = images.map(img => {
        if (isLogos) {
            return `
            <div class="swiper-slide custom-logo-slide">
              <img src="${img.src}" alt="${img.alt}" loading="lazy">
            </div>`;
        } else {
            return `
            <div class="swiper-slide custom-sol-slide">
              <div class="sol-card">
                <img src="${img.src}" alt="${img.alt}" loading="lazy">
                <div class="sol-caption">${img.alt}</div>
              </div>
            </div>`;
        }
    }).join('');

    return `
    <div class="custom-carousel-wrapper" id="${swiperId}-wrap" style="margin-top: 40px; margin-bottom: 40px;">
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
}

// In index.html, we need to replace the two old carousels with the new ones
// First carousel in index.html is Soluciones.
let w1Start = indexHtml.indexOf('<div class="elementor-image-carousel-wrapper');
if (w1Start !== -1) {
    let w1End = indexHtml.indexOf('</div></div></div>', w1Start) + 18;
    indexHtml = indexHtml.substring(0, w1Start) + buildCarousel(solImages, false) + indexHtml.substring(w1End);
}

// Second carousel in index.html is Distribuidores
let w2Start = indexHtml.indexOf('<div class="elementor-image-carousel-wrapper'); // now finding the next one
if (w2Start !== -1) {
    let w2End = indexHtml.indexOf('</div></div></div>', w2Start) + 18;
    indexHtml = indexHtml.substring(0, w2Start) + buildCarousel(distImages, true) + indexHtml.substring(w2End);
}

// Ensure GRUPO TRH is really gone from indexHtml
indexHtml = indexHtml.replace(/Grupo TRH/gi, '');

// Clean up .html extensions from internal links in index.html because we are restoring it from backup
indexHtml = indexHtml.replace(/href=["'](\/[^"']*\.html)(#[^"']*)?["']/gi, (match, p1, p2) => {
    let newHref = p1.replace(/\.html$/, '');
    if (newHref === '/index') newHref = '/';
    return `href="${newHref}${p2 || ''}"`;
});

fs.writeFileSync(indexPath, indexHtml);

// 3. Inject the CSS and JS universally
const globalAssets = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<style>
/* Base Custom Carousel Styles */
.custom-carousel-wrapper {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px 40px; /* Space for arrows and pagination */
}
.custom-carousel-wrapper .swiper {
  width: 100%;
  height: 100%;
  padding-bottom: 20px;
  padding-top: 10px;
  overflow: hidden;
}

/* Soluciones Cards */
.custom-sol-slide .sol-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 280px;
  background: #00147d;
}
.custom-sol-slide .sol-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 20, 125, 0.2);
}
.custom-sol-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease, opacity 0.3s ease;
  opacity: 0.85; /* slight darken */
}
.custom-sol-slide .sol-card:hover img {
  transform: scale(1.05);
  opacity: 0.6; /* darken more on hover so text pops */
}
.custom-sol-slide .sol-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px 15px;
  text-align: center;
  color: #fff;
  font-family: 'LemonMilk', 'Montserrat', sans-serif;
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 1px;
  background: linear-gradient(to top, rgba(0, 20, 125, 0.95) 0%, rgba(0, 20, 125, 0) 100%);
  text-shadow: 0 2px 4px rgba(0,0,0,0.6);
  z-index: 2;
  transition: padding 0.3s ease;
}
.custom-sol-slide .sol-card:hover .sol-caption {
  padding-bottom: 30px;
}

/* Logos (Distribuidores) - BARE LOGOS NO BACKGROUND */
.custom-logo-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  padding: 10px;
  transition: transform 0.3s ease;
  background: transparent !important; /* NO BACKGROUND */
  border: none !important;
  box-shadow: none !important;
}
.custom-logo-slide:hover {
  transform: scale(1.05);
}
.custom-logo-slide img {
  max-width: 100%;
  max-height: 100px;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s ease;
}
.custom-logo-slide:hover img {
  filter: grayscale(0%);
  opacity: 1;
}

/* Navigation & Pagination */
.custom-carousel-wrapper .swiper-button-prev,
.custom-carousel-wrapper .swiper-button-next {
  color: #00147d;
  background: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  top: 45%;
  margin-top: -20px;
}
.custom-carousel-wrapper .swiper-button-prev:after,
.custom-carousel-wrapper .swiper-button-next:after {
  font-size: 16px;
  font-weight: bold;
}
.custom-carousel-wrapper .swiper-button-prev { left: 10px; }
.custom-carousel-wrapper .swiper-button-next { right: 10px; }
.custom-carousel-wrapper .swiper-button-prev:hover,
.custom-carousel-wrapper .swiper-button-next:hover {
  background: #00147d;
  color: #fff;
}
.custom-carousel-wrapper .swiper-pagination-bullet-active {
  background: #1a5c3a;
}
@media (max-width: 768px) {
  .custom-carousel-wrapper { padding: 0 30px 40px; }
  .custom-sol-slide .sol-card { height: 220px; }
}
</style>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.custom-carousel-wrapper').forEach(wrap => {
    const swiperEl = wrap.querySelector('.swiper');
    const nextEl = wrap.querySelector('.swiper-button-next');
    const prevEl = wrap.querySelector('.swiper-button-prev');
    const pagEl = wrap.querySelector('.swiper-pagination');
    
    const isLogos = swiperEl.querySelector('.custom-logo-slide');
    
    new Swiper(swiperEl, {
      slidesPerView: isLogos ? 2 : 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: { nextEl, prevEl },
      pagination: { el: pagEl, clickable: true },
      breakpoints: {
        640: { slidesPerView: isLogos ? 3 : 2, spaceBetween: 20 },
        768: { slidesPerView: isLogos ? 4 : 3, spaceBetween: 30 },
        1024: { slidesPerView: isLogos ? 5 : 4, spaceBetween: 30 },
      }
    });
  });
});
</script>
`;

function injectGlobal(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(/<style>\s*\/\* Premium Carousel Styles \*\/[\s\S]*?<\/script>\s*<\/script>/i, '');
  html = html.replace(/<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/swiper@11[^>]+>/g, '');
  html = html.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/swiper@11[^>]+><\/script>/g, '');
  html = html.replace(/<style>\s*\/\* Base Custom Carousel Styles \*\/[\s\S]*?<\/script>\s*<\/script>/i, '');
  
  if (!html.includes('/* Base Custom Carousel Styles */')) {
    html = html.replace('</body>', globalAssets + '\n</body>');
  }
  fs.writeFileSync(htmlPath, html);
}

injectGlobal(indexPath);
injectGlobal(path.join(distDir, 'distribuidores.html'));
console.log('Fixed everything.');
