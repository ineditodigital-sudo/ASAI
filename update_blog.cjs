const fs = require('fs');
const path = require('path');

const dir = 'e:/ASAI/NUEVO SITIO ASAI/asai-clean-site';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
const mainPages = [
  'index.html', 'nosotros.html', 'catalogo.html', 'blog.html', 
  'contacto.html', 'ubicaciones.html', 'distribuidores.html', 
  'cam-lock.html', 'equipos.html', 'accesorios.html', 
  'industrial.html', 'adaptadores.html', 'coples-rapidos.html', 
  'hidraulica.html', 'neumatica.html'
];
const blogPosts = files.filter(f => !mainPages.includes(f));

blogPosts.forEach(f => {
  let p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  
  content = content.replace(
    '<link rel="icon" type="image/svg+xml" href="/vite.svg">',
    '<link rel="icon" type="image/png" href="/wp-content/uploads/2025/11/FAVICON-asai.png">\n  <link rel="stylesheet" href="/src/css/main.css">'
  );
  
  content = content.replace(
    '<style>',
    '<style>\n    :root {\n      --color-primary-dark: #00147D;\n      --color-primary: #1A5C3A;\n      --color-bg-white: #ffffff;\n      --color-accent: #1A5C3A;\n      --font-heading: \'LEMONMILK\', \'Montserrat\', sans-serif;\n      --color-text-dark: #1a1a1a;\n      --color-border: #D1D1D1;\n    }'
  );
  
  fs.writeFileSync(p, content);
});
console.log('Blog posts updated!');
