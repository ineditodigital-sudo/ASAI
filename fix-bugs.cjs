const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

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

let lazyCount = 0;

htmlFiles.forEach(file => {
  let html = fs.readFileSync(path.join(distDir, file), 'utf8');
  let original = html;

  // 1. Fix contact form
  if (file === 'contacto.html') {
      let startIdx = html.indexOf('<div class="elementor-element elementor-element-5889665');
      if (startIdx !== -1) {
          let endIdx = html.indexOf('</div></div></div>', startIdx);
          if (endIdx !== -1) {
              html = html.substring(0, startIdx) + newFormHtml + html.substring(endIdx + 18);
              console.log('Injected contact form.');
          }
      }
  }

  // 2. Fix Lazy Load
  html = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
      // Find data-src or data-lazy-src
      let newSrcMatch = attrs.match(/data-src=["']([^"']+)["']/i) || attrs.match(/data-lazy-src=["']([^"']+)["']/i);
      
      if (newSrcMatch && newSrcMatch[1]) {
          let realSrc = newSrcMatch[1];
          // Check if src is an SVG placeholder
          if (attrs.includes('data:image/svg+xml') || attrs.includes('data:image/gif')) {
              // Strip the old src, data-src, data-lazy-src
              attrs = attrs.replace(/src=["'][^"']*["']/gi, '');
              attrs = attrs.replace(/data-src=["'][^"']*["']/gi, '');
              attrs = attrs.replace(/data-lazy-src=["'][^"']*["']/gi, '');
              // Clean up srcset if needed (sometimes srcset has placeholders)
              if (attrs.includes('srcset="data:image')) {
                  attrs = attrs.replace(/srcset=["'][^"']*["']/gi, '');
              }
              return '<img src="' + realSrc + '"' + attrs + '>';
          }
      }
      return match;
  });

  if (html !== original) {
    fs.writeFileSync(path.join(distDir, file), html);
    lazyCount++;
  }
});

console.log('Fixed lazy loading in ' + lazyCount + ' files.');
