const fs = require('fs');
const path = require('path');

const cacheDir = 'e:/ASAI/NUEVO SITIO ASAI/wp-content/cache/all';
const destDir = 'e:/ASAI/NUEVO SITIO ASAI/asai-clean-site';

const spamWords = ['casino', 'spin', 'slot', 'bet', 'win', 'jackpot', 'gambling', 'fortune', 'lucky', 'blackjack', 'poker'];

function isSpam(name) {
  const lower = name.toLowerCase();
  return spamWords.some(word => lower.includes(word));
}

function processHtml(content) {
  // 1. Replace internal absolute links
  content = content.replace(/https:\/\/asaiint\.com\/([a-zA-Z0-9_-]+)\/?(?=["'])/g, '/$1.html');
  content = content.replace(/https:\/\/asaiint\.com\/?(?=["'])/g, '/index.html');
  
  // 2. Fix wp-content to be relative to root
  content = content.replace(/https:\/\/asaiint\.com\/wp-content\//g, '/wp-content/');

  // 3. Fix wp-includes to be relative to root
  content = content.replace(/https:\/\/asaiint\.com\/wp-includes\//g, '/wp-includes/');

  // 4. Inject script to override form submissions to WhatsApp
  const waScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Redirect to whatsapp
      window.open('https://wa.me/524498134627?text=Hola%20ASAI,%20me%20gustar%C3%ADa%20hacer%20una%20consulta%20desde%20el%20sitio%20web.', '_blank');
    });
  });
});
</script>
</body>`;
  
  content = content.replace(/<\/body>/i, waScript);
  
  return content;
}

function extractAll() {
  const items = fs.readdirSync(cacheDir, { withFileTypes: true });
  
  let count = 0;

  for (const item of items) {
    if (item.isDirectory()) {
      if (isSpam(item.name)) {
        console.log('Skipping spam directory:', item.name);
        continue;
      }
      
      const indexPath = path.join(cacheDir, item.name, 'index.html');
      if (fs.existsSync(indexPath)) {
        const destHtml = path.join(destDir, `${item.name}.html`);
        let content = fs.readFileSync(indexPath, 'utf8');
        content = processHtml(content);
        fs.writeFileSync(destHtml, content);
        console.log('Extracted:', destHtml);
        count++;
      }
    } else if (item.isFile() && item.name === 'index.html') {
      const destHtml = path.join(destDir, 'index.html');
      let content = fs.readFileSync(path.join(cacheDir, item.name), 'utf8');
      content = processHtml(content);
      fs.writeFileSync(destHtml, content);
      console.log('Extracted:', destHtml);
      count++;
    }
  }
  
  console.log(`Total non-spam pages extracted: ${count}`);
}

extractAll();
