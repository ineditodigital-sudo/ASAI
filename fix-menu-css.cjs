const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

const jsSnippet = `
<script id="asai-mobile-menu-fix-v4">
document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile menu toggle fix - Clone button to kill other listeners
    document.querySelectorAll('.eael-simple-menu-toggle').forEach(function(btn) {
        var newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        var container = newBtn.closest('.eael-simple-menu-container');
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (container) {
                container.classList.toggle('is-open');
            }
        });
    });

    // 2. Make mobile and desktop logos clickable to homepage
    document.querySelectorAll('.elementor-element-c6e2499 img, .elementor-element-c5eef79 img').forEach(function(img) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            window.location.href = '/';
        });
    });
});
</script>
`;

let totalFixed = 0;
const timestamp = Date.now();

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('eael-simple-menu-toggle')) return;

  // Remove previous versions
  const removeBlock = (id) => {
      const start = content.indexOf('<script id="' + id + '">');
      if (start !== -1) {
          const end = content.indexOf("</script>", start) + 9;
          content = content.substring(0, start) + content.substring(end);
      }
  };
  
  removeBlock("asai-mobile-menu-fix");
  removeBlock("asai-mobile-menu-fix-v2");
  removeBlock("asai-mobile-menu-fix-v3");

  const oldScriptStart = content.indexOf("<script>\ndocument.addEventListener('DOMContentLoaded', function() {\n    document.querySelectorAll('.eael-simple-menu-toggle')");
  if (oldScriptStart !== -1) {
      const oldScriptEnd = content.indexOf("</script>", oldScriptStart) + 9;
      content = content.substring(0, oldScriptStart) + content.substring(oldScriptEnd);
  }

  // Inject new script
  content = content.replace('</body>', jsSnippet + '\n</body>');
  
  // Cache bust CSS
  content = content.replace(/css\/main\.css(\?v=\d+)?/g, 'css/main.css?v=' + timestamp);
  
  fs.writeFileSync(filePath, content);
  totalFixed++;
});

console.log('Fixed JS in ' + totalFixed + ' files.');

// Fix CSS for robust menu toggle
const cssPath = path.join(__dirname, 'src', 'css', 'main.css');
let css = fs.readFileSync(cssPath, 'utf8');

const cssFix = `
/* Robust Mobile Menu Fix v4 */
@media (max-width: 1024px) {
    /* Hide the UL unless the container has .is-open */
    .eael-simple-menu-container:not(.is-open) ul.eael-simple-menu {
        display: none !important;
    }
    
    /* When open, style it as a dropdown */
    .eael-simple-menu-container.is-open ul.eael-simple-menu {
        display: flex !important;
        flex-direction: column !important;
        position: absolute !important;
        top: 100% !important;
        right: 0 !important;
        left: auto !important;
        width: 260px !important;
        background-color: #fff !important;
        z-index: 99999 !important;
        padding: 20px !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
        border-radius: 8px !important;
    }
}
`;

if (!css.includes('/* Robust Mobile Menu Fix v4 */')) {
    fs.appendFileSync(cssPath, cssFix);
    console.log('Appended Robust CSS to main.css');
}
