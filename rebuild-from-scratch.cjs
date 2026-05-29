const fs = require('fs');
const path = require('path');

function rebuild(filePath, isLogos) {
  let html = fs.readFileSync(filePath, 'utf8');
  let wrapperStart = html.indexOf('<div class="elementor-image-carousel-wrapper');
  
  if (wrapperStart === -1) {
      console.log('No carousel wrapper found in', path.basename(filePath));
      return;
  }
  
  // Find the end of this wrapper. It usually ends with </div></div></div>
  // Let's just find the closing tags of the swiper.
  // Swiper is structured like: wrapper -> swiper-container -> swiper-wrapper -> swiper-slide ... -> </div></div></div>
  let wrapperEnd = html.indexOf('</div></div></div>', wrapperStart) + 18;
  if(wrapperEnd < wrapperStart + 20) {
      console.log('Could not find end of carousel wrapper in', path.basename(filePath));
      return;
  }
  
  let carouselHtml = html.substring(wrapperStart, wrapperEnd);
  
  // Extract images
  const imgs = [...carouselHtml.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi)];
  const validImgs = imgs.filter(m => !m[1].startsWith('data:image')).map(m => ({ src: m[1], alt: m[2] }));
  
  console.log(`Extracted ${validImgs.length} images from ${path.basename(filePath)}`);
  
  let swiperId = 'swiper-' + Math.random().toString(36).substr(2, 9);
  let slidesHtml = validImgs.map(img => {
    if (isLogos) {
      return `
      <div class="swiper-slide custom-logo-slide">
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
      </div>`;
    } else {
      let caption = img.alt.replace(/Mangueras y conexiones en M.xico\s*/i, '').toUpperCase() || 'SOLUCIÓN';
      return `
      <div class="swiper-slide custom-sol-slide">
        <div class="sol-card">
          <img src="${img.src}" alt="${img.alt}" loading="lazy">
          <div class="sol-caption">${caption}</div>
        </div>
      </div>`;
    }
  }).join('');

  let newCarouselHtml = `
  <div class="custom-carousel-wrapper" id="${swiperId}-wrap">
    <div class="swiper ${swiperId}">
      <div class="swiper-wrapper">
        ${slidesHtml}
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <!-- Navigation arrows outside swiper container to avoid clipping -->
    <div class="swiper-button-prev ${swiperId}-prev"></div>
    <div class="swiper-button-next ${swiperId}-next"></div>
  </div>
  `;

  html = html.substring(0, wrapperStart) + newCarouselHtml + html.substring(wrapperEnd);
  
  // Also clean up any extra duplicate carousels if they exist in the file (Elementor sometimes duplicates them for mobile/desktop)
  let nextWrapperStart = html.indexOf('<div class="elementor-image-carousel-wrapper', wrapperStart + newCarouselHtml.length);
  if (nextWrapperStart !== -1) {
      let nextWrapperEnd = html.indexOf('</div></div></div>', nextWrapperStart) + 18;
      // Just remove duplicate carousel entirely to avoid issues
      html = html.substring(0, nextWrapperStart) + html.substring(nextWrapperEnd);
      console.log('Removed duplicate carousel from', path.basename(filePath));
  }
  
  fs.writeFileSync(filePath, html);
}

rebuild(path.join(__dirname, 'dist', 'index.html'), false);
rebuild(path.join(__dirname, 'dist', 'distribuidores.html'), true);

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

/* Logos (Distribuidores) */
.custom-logo-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  padding: 10px;
  transition: transform 0.3s ease;
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
  
  html = html.replace('</body>', globalAssets + '\n</body>');
  fs.writeFileSync(htmlPath, html);
}

injectGlobal(path.join(__dirname, 'dist', 'index.html'));
injectGlobal(path.join(__dirname, 'dist', 'distribuidores.html'));
console.log('Injected clean global Swiper configuration.');
