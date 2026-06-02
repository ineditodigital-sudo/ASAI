const fs = require('fs');
const html = fs.readFileSync('dist/contacto.html', 'utf8');

const formMatch = html.match(/<form[^>]*>([\s\S]*?)<\/form>/i);
if (formMatch) {
  console.log('--- FORM FIELDS ---');
  const inputs = formMatch[1].match(/<(input|textarea|select)[^>]*name=["'][^"']+["'][^>]*>/gi);
  console.log(inputs ? inputs.join('\n') : 'No inputs found');
} else {
  console.log('No form found in contacto.html');
}

// Let's also look at the carousel structure
const indexHtml = fs.readFileSync('dist/index.html', 'utf8');
const carouselMatch = indexHtml.match(/<div[^>]*class=["'][^"']*swiper-container[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i);
if (carouselMatch) {
  console.log('--- CAROUSEL STRUCTURE ---');
  console.log(carouselMatch[0].substring(0, 1000));
}
