const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

const jsSnippet = `
<script id="asai-mobile-menu-fix-v3">
document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile menu toggle fix
    document.querySelectorAll('.eael-simple-menu-toggle').forEach(function(btn) {
        // Reset the menu display on load
        var container = btn.closest('.eael-simple-menu-container');
        var menu = container ? container.querySelector('ul.eael-simple-menu') : null;
        if (menu) menu.style.display = 'none';

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (menu) {
                if (menu.style.display === 'flex') {
                    menu.style.display = 'none';
                    this.classList.remove('opened');
                } else {
                    menu.style.display = 'flex';
                    menu.style.flexDirection = 'column';
                    menu.style.position = 'absolute';
                    menu.style.top = '100%';
                    menu.style.right = '0';
                    menu.style.left = 'auto';
                    menu.style.width = '260px';
                    menu.style.backgroundColor = '#fff';
                    menu.style.zIndex = '9999';
                    menu.style.padding = '20px';
                    menu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                    menu.style.borderRadius = '8px';
                    this.classList.add('opened');
                }
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

  const oldScriptStart = content.indexOf("<script>\ndocument.addEventListener('DOMContentLoaded', function() {\n    document.querySelectorAll('.eael-simple-menu-toggle')");
  if (oldScriptStart !== -1) {
      const oldScriptEnd = content.indexOf("</script>", oldScriptStart) + 9;
      content = content.substring(0, oldScriptStart) + content.substring(oldScriptEnd);
  }

  // Inject new script
  content = content.replace('</body>', jsSnippet + '\n</body>');
  fs.writeFileSync(filePath, content);
  totalFixed++;
});

console.log('Fixed JS in ' + totalFixed + ' files.');

// Fix CSS for space and overlapping text
const cssPath = path.join(__dirname, 'src', 'css', 'main.css');
let css = fs.readFileSync(cssPath, 'utf8');

const cssFix = `
/* Absolute Header Space Nuke */
html, body, #page { margin: 0 !important; padding: 0 !important; }
header#masthead {
    margin: 0 !important;
    padding: 0 !important;
    top: 0 !important;
    transform: none !important;
    position: relative !important;
}
.elementor-element-76aa6c8, .elementor-element-5b07108 {
    margin-top: 0 !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
}

/* Hide desktop menu items on mobile to prevent overlap */
@media (max-width: 1024px) {
    .eael-simple-menu-container .eael-simple-menu {
        display: none !important;
    }
}
`;

if (!css.includes('/* Absolute Header Space Nuke */')) {
    fs.appendFileSync(cssPath, cssFix);
    console.log('Appended final CSS to main.css');
}
