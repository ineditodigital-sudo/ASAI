const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const rootDir = __dirname;

// 1. Fix Contacto Form Wrappers
const contactPath = path.join(distDir, 'contacto.html');
const rootContactHtml = fs.readFileSync(path.join(rootDir, 'contacto.html'), 'utf8');

let startIdx = rootContactHtml.indexOf('<div class="elementor-element elementor-element-5889665');
let endIdx = rootContactHtml.indexOf('</div></div></div>', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    let originalWidget = rootContactHtml.substring(startIdx, endIdx + 18);
    let containerStart = originalWidget.indexOf('<div class="elementor-widget-container">') + '<div class="elementor-widget-container">'.length;
    let containerEnd = originalWidget.lastIndexOf('</div>', originalWidget.length - 19);
    
    const newFormHtml = `
<div class="custom-contact-form-wrapper" style="width: 100%; max-width: none; margin: 0;">
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
`;
    let injectedWidget = originalWidget.substring(0, containerStart) + newFormHtml + originalWidget.substring(containerEnd);
    
    let html = rootContactHtml;
    html = html.replace(/\/wp-content\/cache\/autoptimize\/css\//g, '/css/');
    html = html.replace(/https:\/\/asaiint\.com\/([^"'\s]+)/g, (match, pathPart) => {
        if (pathPart.startsWith('wp-content') || pathPart.startsWith('wp-includes') || pathPart.startsWith('wp-admin')) return match;
        return '/' + pathPart;
    });
    html = html.replace(/href=["'](\/[^"']*\.html)(#[^"']*)?["']/gi, (match, p1, p2) => {
        let newHref = p1.replace(/\.html$/, '');
        if (newHref === '/index') newHref = '/';
        return 'href="' + newHref + (p2 || '') + '"';
    });
    
    html = html.replace(originalWidget, injectedWidget);
    
    html = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
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
    
    fs.writeFileSync(contactPath, html);
    console.log('Fixed Contacto form wrappers.');
}

// 2. Fix Distribuidores TRH Card
const distPath = path.join(distDir, 'distribuidores.html');
let distHtml = fs.readFileSync(distPath, 'utf8');

let trhIdx = distHtml.indexOf('GRUPO-TRH');
if (trhIdx !== -1) {
    let startTag = distHtml.lastIndexOf('<div class="elementor-element', trhIdx);
    if (startTag !== -1) {
        let endTag = distHtml.indexOf('</div></div></div>', trhIdx);
        if (endTag !== -1) {
            distHtml = distHtml.substring(0, startTag) + distHtml.substring(endTag + 18);
            fs.writeFileSync(distPath, distHtml);
            console.log('Removed TRH card safely from distribuidores.');
        }
    }
}
