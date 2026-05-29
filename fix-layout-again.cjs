const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(__dirname, 'dist');

// 1. Fix Contacto.html
let contactHtml = fs.readFileSync(path.join(rootDir, 'contacto.html'), 'utf8');

const newFormHtml = `
<div class="elementor-element elementor-element-5889665 elementor-widget elementor-widget-custom-form" style="width:100%;">
  <div class="elementor-widget-container">
    <div class="custom-contact-form-wrapper" style="width: 100%; padding: 30px; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
      <form id="modern-contact-form" class="modern-contact-form" action="/contact.php" method="POST">
        <div class="form-row" style="display:flex; gap:20px; margin-bottom:15px;">
          <div class="form-group" style="flex:1; display:flex; flex-direction:column;">
            <label for="fname" style="font-weight:bold; margin-bottom:5px; font-size:14px; color:#333;">Nombre *</label>
            <input type="text" id="fname" name="fname" required placeholder="Tu nombre" style="padding:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit;">
          </div>
          <div class="form-group" style="flex:1; display:flex; flex-direction:column;">
            <label for="lname" style="font-weight:bold; margin-bottom:5px; font-size:14px; color:#333;">Apellidos *</label>
            <input type="text" id="lname" name="lname" required placeholder="Tus apellidos" style="padding:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit;">
          </div>
        </div>
        <div class="form-row" style="display:flex; gap:20px; margin-bottom:15px;">
          <div class="form-group" style="flex:1; display:flex; flex-direction:column;">
            <label for="phone" style="font-weight:bold; margin-bottom:5px; font-size:14px; color:#333;">Teléfono *</label>
            <input type="tel" id="phone" name="phone" required placeholder="10 dígitos" style="padding:10px; border:1px solid #ddd; border-radius:6px; font-family:inherit;">
          </div>
          <div class="form-group" style="flex:1; display:flex; flex-direction:column;">
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

// Precisely target the ninja form widget using a substring extraction to avoid regex DOM destruction
let startIdx = contactHtml.indexOf('<div class="elementor-element elementor-element-5889665');
if (startIdx !== -1) {
    let scriptEndIdx = contactHtml.indexOf('nfForms.push(form);</script>', startIdx);
    if (scriptEndIdx !== -1) {
        // The widget usually ends with three </div> tags after the script
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
console.log('Fixed Contacto completely.');


// 2. Fix Distribuidores TRH Card completely
let distHtml = fs.readFileSync(path.join(distDir, 'distribuidores.html'), 'utf8');
let hidalgoIdx = distHtml.indexOf('Hidalgo 408');
if (hidalgoIdx !== -1) {
    // We need to find the elementor column "e-con" that has class "prod-card" that contains this text.
    // It is the parent of the whole TRH card.
    let cardStart = distHtml.lastIndexOf('<div class="elementor-element elementor-element-40519fc', hidalgoIdx);
    if (cardStart !== -1) {
        // Elementor containers like this are very large and complex to match with indexOf exactly.
        // But since this is a specific card, let's just use regex to remove it safely.
        // We know it starts at cardStart.
        // Let's find the NEXT card after it to know where it ends.
        let nextCard = distHtml.indexOf('<div class="elementor-element', hidalgoIdx + 100); 
        // Actually, since Elementor has nested divs, the safest way is counting divs, OR since we know the TRH card ends with VENTAS@TRH.COM.MX </a></h3><p class="elementor-icon-box-description"> Respuesta en menos de 1 hora</p></div></div></div></div></div>
        let ventasIdx = distHtml.indexOf('VENTAS@TRH.COM.MX', hidalgoIdx);
        if (ventasIdx !== -1) {
            let cardEnd = distHtml.indexOf('</div></div></div></div></div>', ventasIdx);
            if (cardEnd !== -1) {
                // Delete the whole card safely
                distHtml = distHtml.substring(0, cardStart) + distHtml.substring(cardEnd + 30);
                fs.writeFileSync(path.join(distDir, 'distribuidores.html'), distHtml);
                console.log('Removed full TRH card successfully.');
            } else {
                console.log('Could not find end of TRH card.');
            }
        }
    }
} else {
    // Maybe we already removed the Hidalgo text? No, it's there.
    console.log('Hidalgo 408 not found. TRH card already gone?');
}
