const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(__dirname, 'dist');

// Make sure dist exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Global Swiper Assets to inject
const globalAssets = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<style>
/* Base Custom Carousel Styles */
.custom-carousel-wrapper {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 60px 40px;
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
  opacity: 0.85;
}
.custom-sol-slide .sol-card:hover img {
  transform: scale(1.05);
  opacity: 0.6;
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
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
.custom-logo-slide:hover {
  transform: scale(1.05);
}
.custom-logo-slide img {
  max-width: 100%;
  max-height: 130px;
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

function buildCarousel(images, isLogos, title = '') {
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

    let titleHtml = title ? `<h2 style="text-align: center; color: #00147d; font-family: 'LemonMilk', sans-serif; margin-bottom: 30px;">${title}</h2>` : '';

    return `
    <div class="custom-carousel-wrapper" id="${swiperId}-wrap" style="margin-top: 40px; margin-bottom: 40px;">
      ${titleHtml}
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

// 1. Read all original HTML files from root
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    let html = fs.readFileSync(path.join(rootDir, file), 'utf8');

    // --- GLOBAL FIXES ---

    // A. Fix autoptimize CSS paths
    html = html.replace(/\/wp-content\/cache\/autoptimize\/css\//g, '/css/');
    
    // B. Fix absolute URL domains
    html = html.replace(/https:\/\/asaiint\.com\/([^"'\s]+)/g, (match, pathPart) => {
        if (pathPart.startsWith('wp-content') || pathPart.startsWith('wp-includes') || pathPart.startsWith('wp-admin')) {
            return match; // Leave WP assets absolute or untouched
        }
        return '/' + pathPart;
    });

    // C. Remove .html from internal links
    html = html.replace(/href=["'](\/[^"']*\.html)(#[^"']*)?["']/gi, (match, p1, p2) => {
        let newHref = p1.replace(/\.html$/, '');
        if (newHref === '/index') newHref = '/';
        return `href="${newHref}${p2 || ''}"`;
    });

    // D. Inject main.css for hamburger menu fix
    if (!html.includes('/css/main.css')) {
        html = html.replace('</head>', '  <link rel="stylesheet" href="/css/main.css">\n</head>');
    }

    // --- SPECIFIC FILE FIXES ---

    if (file === 'contacto.html') {
        // Inject the custom contact form HTML
        const newFormHtml = `
<div class="custom-contact-form-wrapper">
  <form id="modern-contact-form" class="modern-contact-form" action="/contact.php" method="POST">
    <div class="form-row">
      <div class="form-group">
        <label for="fname">Nombre *</label>
        <input type="text" id="fname" name="fname" required placeholder="Tu nombre">
      </div>
      <div class="form-group">
        <label for="lname">Apellidos *</label>
        <input type="text" id="lname" name="lname" required placeholder="Tus apellidos">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="phone">Teléfono *</label>
        <input type="tel" id="phone" name="phone" required placeholder="10 dígitos">
      </div>
      <div class="form-group">
        <label for="email">Correo *</label>
        <input type="email" id="email" name="email" required placeholder="tu@correo.com">
      </div>
    </div>
    <div class="form-group">
      <label for="state">Estado</label>
      <input type="text" id="state" name="state" placeholder="Tu estado">
    </div>
    <div class="form-group">
      <label for="message">Mensaje / Comentarios *</label>
      <textarea id="message" name="message" required rows="4" placeholder="¿En qué te podemos ayudar?"></textarea>
    </div>
    <div class="form-submit">
      <button type="submit" class="submit-btn" id="submit-btn">ENVIAR</button>
    </div>
    <div id="form-response" class="form-response"></div>
  </form>
</div>

<style>
.custom-contact-form-wrapper {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Montserrat', sans-serif;
}
.modern-contact-form .form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.modern-contact-form .form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.modern-contact-form label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 0.9rem;
}
.modern-contact-form input,
.modern-contact-form textarea {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background: #fafafa;
}
.modern-contact-form input:focus,
.modern-contact-form textarea:focus {
  outline: none;
  border-color: #00147d;
  box-shadow: 0 0 0 3px rgba(0, 20, 125, 0.1);
  background: #fff;
}
.modern-contact-form .form-submit {
  text-align: center;
  margin-top: 10px;
}
.modern-contact-form .submit-btn {
  background: #00147d;
  color: #fff;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  font-family: 'LemonMilk', sans-serif;
  letter-spacing: 1px;
}
.modern-contact-form .submit-btn:hover {
  background: #000f5c;
  transform: translateY(-2px);
}
.modern-contact-form .submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
.form-response {
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  display: none;
}
.form-response.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  display: block;
}
.form-response.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  display: block;
}
@media (max-width: 768px) {
  .modern-contact-form .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('modern-contact-form');
  const responseDiv = document.getElementById('form-response');
  const submitBtn = document.getElementById('submit-btn');

  if(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'ENVIANDO...';
      responseDiv.className = 'form-response';
      responseDiv.textContent = '';
      
      const formData = new FormData(form);
      const data = new URLSearchParams(formData);
      
      fetch('/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data.toString()
      })
      .then(res => res.json().catch(() => { throw new Error('Respuesta no válida del servidor') }))
      .then(result => {
        if(result.status === 'success' || result.message) {
          responseDiv.textContent = result.message || 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.';
          responseDiv.classList.add('success');
          form.reset();
        } else {
          throw new Error(result.message || 'Error al enviar');
        }
      })
      .catch(err => {
        responseDiv.textContent = 'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.';
        responseDiv.classList.add('error');
        console.error(err);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ENVIAR';
      });
    });
  }
});
</script>`;
        html = html.replace(/<form[^>]*>([\s\S]*?)<\/form>/i, newFormHtml);
    }

    if (file === 'index.html') {
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

        // Replace Soluciones carousel (the first elementor-image-carousel-wrapper)
        let w1Start = html.indexOf('<div class="elementor-image-carousel-wrapper');
        if (w1Start !== -1) {
            let w1End = html.indexOf('</div></div></div>', w1Start) + 18;
            html = html.substring(0, w1Start) + buildCarousel(solImages, false) + html.substring(w1End);
        }

        // Replace Distribuidores carousel (the second elementor-image-carousel-wrapper)
        let w2Start = html.indexOf('<div class="elementor-image-carousel-wrapper'); 
        if (w2Start !== -1) {
            let w2End = html.indexOf('</div></div></div>', w2Start) + 18;
            html = html.substring(0, w2Start) + buildCarousel(distImages, true) + html.substring(w2End);
        }
        
        html = html.replace('</body>', globalAssets + '\n</body>');
    }

    if (file === 'distribuidores.html') {
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

        let firstLogo = html.indexOf('ALCA.webp');
        if(firstLogo !== -1) {
            let start = html.lastIndexOf('<section', firstLogo);
            let end = html.indexOf('</section>', firstLogo) + 10;
            if (start !== -1 && end !== -1) {
                html = html.substring(0, start) + buildCarousel(distImages, true, 'NUESTROS PRINCIPALES DISTRIBUIDORES') + html.substring(end);
            }
        }
        
        html = html.replace('</body>', globalAssets + '\n</body>');
    }

    if (file === 'ubicaciones.html') {
        // Safe regex to remove the Grupo TRH object from the mapData JS array
        html = html.replace(/\{nombre:"Grupo TRH"[^}]+\},?/g, '');
    }

    // Write to dist
    fs.writeFileSync(path.join(distDir, file), html);
});

// Copy src/css/main.css to dist/css/main.css
const cssOutDir = path.join(distDir, 'css');
if (!fs.existsSync(cssOutDir)) {
    fs.mkdirSync(cssOutDir, { recursive: true });
}
fs.copyFileSync(path.join(rootDir, 'src', 'css', 'main.css'), path.join(cssOutDir, 'main.css'));

console.log('Rebuild master completed. All 66 files processed and written to dist/.');
