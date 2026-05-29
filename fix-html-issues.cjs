const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Fix Swiper carousel noscript lazy loading (Elementor image carousels)
  content = content.replace(
    /<noscript>\s*(<img[^>]+src=["']([^"']+)["'][^>]*>)\s*<\/noscript>\s*<img[^>]+src=["']data:image\/svg\+xml[^"']*["'][^>]*>/gi,
    '$1'
  );

  // 2. Remove .html extensions from internal links (href="/page.html" -> href="/page")
  content = content.replace(/href=["'](\/[^"']*\.html)(#[^"']*)?["']/gi, (match, p1, p2) => {
    let newHref = p1.replace(/\.html$/, '');
    if (newHref === '/index') newHref = '/';
    return `href="${newHref}${p2 || ''}"`;
  });

  // 3. Inject form handler for contacto.html
  if (file === 'contacto.html') {
      content = content.replace(/<form([^>]*)>/i, (match, p1) => {
          let attrs = p1.replace(/action=["'][^"']*["']/i, '').replace(/method=["'][^"']*["']/i, '');
          return `<form${attrs} action="/contact.php" method="POST" id="asai-contact-form">`;
      });

      if (!content.includes('asai-contact-form-handler')) {
          const formJs = `
<script id="asai-contact-form-handler">
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('asai-contact-form');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn ? btn.innerHTML : 'Enviar';
            if(btn) {
                btn.innerHTML = 'Enviando...';
                btn.disabled = true;
            }

            const formData = new FormData(form);
            const data = new URLSearchParams();
            
            // Map Elementor field names (form_fields[xxx]) to simple names
            for (const [key, value] of formData.entries()) {
                const k = key.toLowerCase();
                if (k.includes('name') || k.includes('nombre')) data.append('name', value);
                else if (k.includes('email') || k.includes('correo')) data.append('email', value);
                else if (k.includes('message') || k.includes('mensaje') || k.includes('asunto')) data.append('message', value);
                else if (k.includes('phone') || k.includes('telefono') || k.includes('tel')) data.append('phone', value);
                else if (k.includes('company') || k.includes('empresa')) data.append('company', value);
                else if (k.includes('location') || k.includes('ciudad') || k.includes('estado')) data.append('location', value);
                else data.append(key, value);
            }

            fetch('/contact.php', {
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if(data.status === 'success') form.reset();
            })
            .catch(err => {
                console.error(err);
                alert('Hubo un error al enviar el formulario. Por favor, comunícate al 449 813 4627.');
            })
            .finally(() => {
                if(btn) {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            });
        });
    }
});
</script>
`;
          content = content.replace('</body>', formJs + '\n</body>');
      }
  }

  if (content !== original) {
      fs.writeFileSync(filePath, content);
      modifiedCount++;
  }
});

console.log(`Modified ${modifiedCount} files.`);
