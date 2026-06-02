const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

const jsSnippet = `
<script>
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.eael-simple-menu-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
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
                    menu.style.left = '0';
                    menu.style.width = '100vw';
                    menu.style.backgroundColor = '#fff';
                    menu.style.zIndex = '9999';
                    menu.style.padding = '20px';
                    menu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
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
  if (content.includes('menu.style.flexDirection')) return; // already added

  content = content.replace('</body>', jsSnippet + '\n</body>');
  
  fs.writeFileSync(filePath, content);
  totalFixed++;
});

console.log(`Added menu JS to ${totalFixed} files`);

// Also update CSS for the space
const cssPath = path.join(__dirname, 'src', 'css', 'main.css');
let css = fs.readFileSync(cssPath, 'utf8');

const cssFix = `
/* Nuke header space */
.bhf-hidden { display: none !important; }
header#masthead, .elementor-7 { padding-top: 0 !important; margin-top: 0 !important; border-top: none !important; }
.elementor-7 .e-con { min-height: 0 !important; --min-height: 0 !important; }
.eael-simple-menu-toggle.opened { background: #f0f0f0; }
`;

if (!css.includes('.bhf-hidden { display: none')) {
    fs.appendFileSync(cssPath, cssFix);
    console.log('Appended CSS fix to main.css');
}
