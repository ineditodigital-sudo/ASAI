const fs = require('fs');
const path = require('path');

const categories = [
  'hidraulica',
  'neumatica',
  'adaptadores',
  'industrial',
  'coples-rapidos',
  'cam-lock',
  'accesorios',
  'equipos'
];

let injectedCount = 0;

categories.forEach(cat => {
  const file = path.join(__dirname, `${cat}.html`);
  if (!fs.existsSync(file)) return;
  
  let html = fs.readFileSync(file, 'utf8');
  
  // Skip if already injected
  if (html.includes('id="category-products-container"')) return;
  
  const injection = `
  <div class="elementor-section elementor-top-section elementor-element elementor-section-boxed elementor-section-height-default" style="padding: 40px 20px;">
    <div class="elementor-container elementor-column-gap-default">
      <div id="category-products-container" data-category="${cat}" style="width: 100%;"></div>
    </div>
  </div>
  <script type="module" src="/src/category-renderer.js"></script>
  `;
  
  // Find where to inject
  let targetIndex = html.lastIndexOf('</footer>');
  if (targetIndex === -1) {
    targetIndex = html.lastIndexOf('<footer');
  }
  if (targetIndex === -1) {
    targetIndex = html.lastIndexOf('<div data-elementor-type="footer"');
  }
  if (targetIndex === -1) {
    targetIndex = html.lastIndexOf('</body>');
  }
  
  if (targetIndex !== -1) {
    html = html.substring(0, targetIndex) + injection + html.substring(targetIndex);
    fs.writeFileSync(file, html, 'utf8');
    injectedCount++;
    console.log(`Injected products grid into ${cat}.html`);
  }
});

console.log(`Successfully injected into ${injectedCount} files.`);
