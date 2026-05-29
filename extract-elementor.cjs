const fs = require('fs');
const path = require('path');
const sqlContent = fs.readFileSync(path.join('E:', 'ASAI', 'NUEVO SITIO ASAI', 'sqldump.sql'), 'utf8');
const outputDir = path.join('E:', 'ASAI', 'NUEVO SITIO ASAI', 'asai-clean-site', 'elementor_data');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
const regex = /\((\d+),\s*(\d+),\s*'_elementor_data',\s*'(\[[\s\S]*?\])'\)/g;
let match, count = 0;
while ((match = regex.exec(sqlContent)) !== null) {
  let jsonStr = match[3].replace(/\\'/g, "'").replace(/\\\\/g, "\\\\");
  try {
    fs.writeFileSync(path.join(outputDir, post_ + match[2] + .json), JSON.stringify(JSON.parse(jsonStr), null, 2));
    count++;
  } catch (e) {
    // ignore
  }
}
console.log(Extracted  + count +  configs.);
