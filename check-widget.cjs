const fs = require('fs');
const rootContactHtml = fs.readFileSync('contacto.html', 'utf8');

// The widget we want to replace
const startMarker = '<div class="elementor-element elementor-element-5889665';
let startIdx = rootContactHtml.indexOf(startMarker);
let endIdx = rootContactHtml.indexOf('nfForms.push(form);</script>', startIdx);
let realEndIdx = rootContactHtml.indexOf('</div></div></div>', endIdx) + 18;

console.log('Replacing widget of length', realEndIdx - startIdx);
