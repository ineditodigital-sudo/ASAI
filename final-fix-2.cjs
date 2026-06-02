const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(__dirname, 'dist');

// 1. Fix Contacto.html
let contactHtml = fs.readFileSync(path.join(rootDir, 'contacto.html'), 'utf8');

const newFormHtml = `
<div class="elementor-element elementor-element-5889665 elementor-widget">
  <div class="elementor-widget-container">
    <div class="custom-contact-form-wrapper" style="width: 100%; padding: 30px; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
      <form id="modern-contact-form" class="modern-contact-form" action="/contact.php" method="POST">
        <div class="form-row" style="display:flex; gap:20px; margin-bottom:15px; flex-wrap:wrap;">
          <div class="form-group" style="flex:1; min-width:200px; display:flex; flex-direction:column;">
            <label for="fname" style="font-weight:bold; margin-bottom:5px; font-size:14px; color:#333;">Nombre *</label>
            <input type="text" id="fname" name="fname" required placeholder="Tu nombre" style="padding:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit;">
          </div>
          <div class="form-group" style="flex:1; min-width:200px; display:flex; flex-direction:column;">
            <label for="lname" style="font-weight:bold; margin-bottom:5px; font-size:14px; color:#333;">Apellidos *</label>
            <input type="text" id="lname" name="lname" required placeholder="Tus apellidos" style="padding:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit;">
          </div>
        </div>
        <div class="form-row" style="display:flex; gap:20px; margin-bottom:15px; flex-wrap:wrap;">
          <div class="form-group" style="flex:1; min-width:200px; display:flex; flex-direction:column;">
            <label for="phone" style="font-weight:bold; margin-bottom:5px; font-size:14px; color:#333;">Teléfono *</label>
            <input type="tel" id="phone" name="phone" required placeholder="10 dígitos" style="padding:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit;">
          </div>
          <div class="form-group" style="flex:1; min-width:200px; display:flex; flex-direction:column;">
            <label for="email" style="font-weight:bold; margin-bottom:5px; font-size:14px; color:#333;">Correo *</label>
            <input type="email" id="email" name="email" required placeholder="tu@correo.com" style="padding:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit;">
          </div>
        </div>
        <div class="form-group" style="display:flex; flex-direction:column; margin-bottom:15px;">
          <label for="state" style="font-weight:bold; margin-bottom:5px; font-size:14px; color:#333;">Estado</label>
          <input type="text" id="state" name="state" placeholder="Tu estado" style="padding:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit;">
        </div>
        <div class="form-group" style="display:flex; flex-direction:column; margin-bottom:20px;">
          <label for="message" style="font-weight:bold; margin-bottom:5px; font-size:14px; color:#333;">Mensaje / Comentarios *</label>
          <textarea id="message" name="message" required rows="4" placeholder="¿En qué te podemos ayudar?" style="padding:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit;"></textarea>
        </div>
        <div class="form-submit" style="text-align:center;">
          <button type="submit" class="submit-btn" id="submit-btn" style="background:#00147d; color:#fff; border:none; padding:15px 40px; font-weight:bold; border-radius:30px; cursor:pointer; font-family:'LemonMilk', sans-serif;">ENVIAR</button>
        </div>
        <div id="form-response" class="form-response" style="margin-top:15px; text-align:center; display:none; padding:10px; border-radius:6px;"></div>
      </form>
    </div>
  </div>
</div>
`;

let startIdx = contactHtml.indexOf('<div class="elementor-element elementor-element-5889665');
if (startIdx !== -1) {
    let scriptEndIdx = contactHtml.indexOf('nfForms.push(form);</script>', startIdx);
    if (scriptEndIdx !== -1) {
        let endIdx = contactHtml.indexOf('</div></div></div>', scriptEndIdx);
        if (endIdx !== -1) {
            let originalWidget = contactHtml.substring(startIdx, endIdx + 18);
            contactHtml = contactHtml.replace(originalWidget, newFormHtml);
        }
    }
}

// Global fixes for contact
contactHtml = contactHtml.replace(/\/wp-content\/cache\/autoptimize\/css\//g, '/css/');
contactHtml = contactHtml.replace(/https:\/\/asaiint\.com\/([^"'\s]+)/g, (match, pathPart) => {
    if (pathPart.startsWith('wp-content') || pathPart.startsWith('wp-includes') || pathPart.startsWith('wp-admin')) return match;
    return '/' + pathPart;
});
contactHtml = contactHtml.replace(/href=["'](\/[^"']*\.html)(#[^"']*)?["']/gi, (match, p1, p2) => {
    let newHref = p1.replace(/\.html$/, '');
    if (newHref === '/index') newHref = '/';
    return 'href="' + newHref + (p2 || '') + '"';
});
// Lazy load fix
contactHtml = contactHtml.replace(/<img([^>]*)>/gi, (match, attrs) => {
  let newSrcMatch = attrs.match(/data-src=["']([^"']+)["']/i) || attrs.match(/data-lazy-src=["']([^"']+)["']/i);
  if (newSrcMatch && newSrcMatch[1]) {
      let realSrc = newSrcMatch[1];
      if (attrs.includes('data:image/svg+xml') || attrs.includes('data:image/gif')) {
          attrs = attrs.replace(/src=["'][^"']*["']/gi, '');
          attrs = attrs.replace(/data-src=["'][^"']*["']/gi, '');
          attrs = attrs.replace(/data-lazy-src=["'][^"']*["']/gi, '');
          if (attrs.includes('srcset="data:image')) {
              attrs = attrs.replace(/srcset=["'][^"']*["']/gi, '');
          }
          return '<img src="' + realSrc + '"' + attrs + '>';
      }
  }
  return match;
});
// Add script functionality for form
contactHtml = contactHtml.replace('</body>', `<script>
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('modern-contact-form');
  const responseDiv = document.getElementById('form-response');
  const submitBtn = document.getElementById('submit-btn');

  if(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'ENVIANDO...';
      responseDiv.style.display = 'block';
      responseDiv.textContent = 'Enviando...';
      
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
          responseDiv.textContent = result.message || 'Mensaje enviado correctamente.';
          responseDiv.style.background = '#d4edda';
          responseDiv.style.color = '#155724';
          form.reset();
        } else {
          throw new Error(result.message || 'Error al enviar');
        }
      })
      .catch(err => {
        responseDiv.textContent = 'Error al enviar. Intenta de nuevo.';
        responseDiv.style.background = '#f8d7da';
        responseDiv.style.color = '#721c24';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ENVIAR';
      });
    });
  }
});
</script></body>`);

fs.writeFileSync(path.join(distDir, 'contacto.html'), contactHtml);
console.log('Fixed Contacto completely without hardcoded widget width.');

// 2. Fix Distribuidores TRH Card completely
let distHtml = fs.readFileSync(path.join(rootDir, 'distribuidores.html'), 'utf8');

// A. Apply global fixes so it matches the rest of the site
distHtml = distHtml.replace(/\/wp-content\/cache\/autoptimize\/css\//g, '/css/');
distHtml = distHtml.replace(/https:\/\/asaiint\.com\/([^"'\s]+)/g, (match, pathPart) => {
    if (pathPart.startsWith('wp-content') || pathPart.startsWith('wp-includes') || pathPart.startsWith('wp-admin')) return match;
    return '/' + pathPart;
});
distHtml = distHtml.replace(/href=["'](\/[^"']*\.html)(#[^"']*)?["']/gi, (match, p1, p2) => {
    let newHref = p1.replace(/\.html$/, '');
    if (newHref === '/index') newHref = '/';
    return 'href="' + newHref + (p2 || '') + '"';
});

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

let swiperHtml = '<div class="custom-carousel-wrapper" id="swiper-dist" style="margin-top: 40px; margin-bottom: 40px;">\n';
swiperHtml += '<h2 style="text-align: center; color: #00147d; font-family: \'LemonMilk\', sans-serif; margin-bottom: 30px;">NUESTROS PRINCIPALES DISTRIBUIDORES</h2>\n';
swiperHtml += '<div class="swiper swiper-dist">\n<div class="swiper-wrapper">\n';
for (let img of distImages) {
    swiperHtml += '<div class="swiper-slide custom-logo-slide"><img src="' + img.src + '" alt="' + img.alt + '" loading="lazy"></div>\n';
}
swiperHtml += '</div><div class="swiper-pagination"></div></div>\n';
swiperHtml += '<div class="swiper-button-prev swiper-dist-prev"></div><div class="swiper-button-next swiper-dist-next"></div></div>\n';

let firstLogo = distHtml.indexOf('ALCA.webp');
if(firstLogo !== -1) {
    let startCarousel = distHtml.lastIndexOf('<section', firstLogo);
    let endCarousel = distHtml.indexOf('</section>', firstLogo) + 10;
    if (startCarousel !== -1 && endCarousel !== -1) {
        distHtml = distHtml.substring(0, startCarousel) + swiperHtml + distHtml.substring(endCarousel);
    }
}

// C. Lazy load fix
distHtml = distHtml.replace(/<img([^>]*)>/gi, (match, attrs) => {
  let newSrcMatch = attrs.match(/data-src=["']([^"']+)["']/i) || attrs.match(/data-lazy-src=["']([^"']+)["']/i);
  if (newSrcMatch && newSrcMatch[1]) {
      let realSrc = newSrcMatch[1];
      if (attrs.includes('data:image/svg+xml') || attrs.includes('data:image/gif')) {
          attrs = attrs.replace(/src=["'][^"']*["']/gi, '');
          attrs = attrs.replace(/data-src=["'][^"']*["']/gi, '');
          attrs = attrs.replace(/data-lazy-src=["'][^"']*["']/gi, '');
          if (attrs.includes('srcset="data:image')) {
              attrs = attrs.replace(/srcset=["'][^"']*["']/gi, '');
          }
          return '<img src="' + realSrc + '"' + attrs + '>';
      }
  }
  return match;
});

// D. Remove TRH Card
let hidalgoIdx = distHtml.indexOf('Hidalgo 408');
if (hidalgoIdx !== -1) {
    // The TRH card is inside an e-con container with class prod-card
    let cardStart = distHtml.lastIndexOf('<div class="elementor-element elementor-element-40519fc', hidalgoIdx);
    if (cardStart !== -1) {
        let ventasIdx = distHtml.indexOf('VENTAS@TRH.COM.MX', hidalgoIdx);
        if (ventasIdx !== -1) {
            let cardEnd = distHtml.indexOf('</div></div></div></div></div>', ventasIdx);
            if (cardEnd !== -1) {
                distHtml = distHtml.substring(0, cardStart) + distHtml.substring(cardEnd + 30);
                console.log('Removed full TRH card successfully from distHtml.');
            }
        }
    }
}

fs.writeFileSync(path.join(distDir, 'distribuidores.html'), distHtml);
console.log('Finished Distribuidores completely.');
