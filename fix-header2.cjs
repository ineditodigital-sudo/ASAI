const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

const jsSnippet = `
<script id="asai-mobile-menu-fix">
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.eael-simple-menu-toggle').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var container = this.closest('.eael-simple-menu-container');
            var menu = container.querySelector('ul.eael-simple-menu');
            if (menu) {
                if (menu.style.display === 'flex') {
                    menu.style.display = '';
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
});
</script>
`;

let totalFixed = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('eael-simple-menu-toggle')) return;

  // Remove previous injected script if it exists
  const oldScriptStart = content.indexOf("<script>\ndocument.addEventListener('DOMContentLoaded', function() {\n    document.querySelectorAll('.eael-simple-menu-toggle')");
  if (oldScriptStart !== -1) {
      const oldScriptEnd = content.indexOf("</script>", oldScriptStart) + 9;
      content = content.substring(0, oldScriptStart) + content.substring(oldScriptEnd);
  }

  // Remove the script by ID if it exists (for idempotency)
  const idScriptStart = content.indexOf('<script id="asai-mobile-menu-fix">');
  if (idScriptStart !== -1) {
      const idScriptEnd = content.indexOf("</script>", idScriptStart) + 9;
      content = content.substring(0, idScriptStart) + content.substring(idScriptEnd);
  }

  // Inject the new script
  content = content.replace('</body>', jsSnippet + '\n</body>');
  
  fs.writeFileSync(filePath, content);
  totalFixed++;
});

console.log(`Updated menu JS in ${totalFixed} files`);
