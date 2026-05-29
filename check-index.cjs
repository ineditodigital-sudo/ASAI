const fs = require('fs');
const html = fs.readFileSync('dist/index.html', 'utf8');

const carousels = [...html.matchAll(/<div class="custom-carousel-wrapper"[^>]*>([\s\S]*?)<\/div>\s*<!-- Navigation arrows/g)];

carousels.forEach((match, i) => {
  const imgs = [...match[1].matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  console.log(`Carousel ${i + 1}:`);
  console.log(imgs.map(m => m[1]).join('\n'));
});
