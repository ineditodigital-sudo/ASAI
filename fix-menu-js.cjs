const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

const jsSnippet = `
<script id="asai-mobile-menu-fix-v5">
document.addEventListener('DOMContentLoaded', function() {
    var mobileContainers = document.querySelectorAll('.elementor-hidden-desktop .eael-simple-menu-container, .elementor-hidden-laptop .eael-simple-menu-container');
    
    mobileContainers.forEach(function(container) {
        var menu = container.querySelector('ul.eael-simple-menu');
        if (menu) {
            menu.style.setProperty('display', 'none', 'important');
        }
        
        var btn = container.querySelector('.eael-simple-menu-toggle');
        if (btn) {
            var newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (menu) {
                    if (menu.style.display === 'none') {
                        menu.style.setProperty('display', 'flex', 'important');
                        menu.style.setProperty('flex-direction', 'column', 'important');
                        menu.style.setProperty('position', 'absolute', 'important');
                        menu.style.setProperty('top', '100%', 'important');
                        menu.style.setProperty('right', '0', 'important');
                        menu.style.setProperty('left', 'auto', 'important');
                        menu.style.setProperty('width', '260px', 'important');
                        menu.style.setProperty('background-color', '#fff', 'important');
                        menu.style.setProperty('z-index', '99999', 'important');
                        menu.style.setProperty('padding', '20px', 'important');
                        menu.style.setProperty('box-shadow', '0 10px 30px rgba(0,0,0,0.2)', 'important');
                        menu.style.setProperty('border-radius', '8px', 'important');
                    } else {
                        menu.style.setProperty('display', 'none', 'important');
                    }
                }
            });
        }
    });

    document.querySelectorAll('.elementor-element-c6e2499 img, .elementor-element-c5eef79 img').forEach(function(img) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() { window.location.href = '/'; });
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

  const removeBlock = (id) => {
      const start = content.indexOf('<script id="' + id + '">');
      if (start !== -1) {
          const end = content.indexOf("</script>", start) + 9;
          content = content.substring(0, start) + content.substring(end);
      }
  };
  
  removeBlock("asai-mobile-menu-fix-v4");
  removeBlock("asai-mobile-menu-fix-v3");

  // Inject new script
  content = content.replace('</body>', jsSnippet + '\n</body>');
  
  fs.writeFileSync(filePath, content);
  totalFixed++;
});

console.log('Fixed JS with inline force in ' + totalFixed + ' files.');
