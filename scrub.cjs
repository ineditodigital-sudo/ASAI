const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.cjs'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  content = content.replace(/16_mR1y24!M\*/g, 'YOUR_FTP_PASSWORD');
  content = content.replace(/password:\s*['"][^'"]+['"]/gi, "password: 'YOUR_FTP_PASSWORD'");
  if (content !== original) {
    fs.writeFileSync(f, content);
    console.log('Scrubbed password from:', f);
  }
});
