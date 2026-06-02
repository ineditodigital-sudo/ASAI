/**
 * fix-images.cjs
 * Fixes lazy-loaded images in all HTML files by converting:
 * - data-src -> src
 * - data-srcset -> srcset
 * - data-sizes -> sizes
 * Also fixes internal links from /neumatica/ to /neumatica.html etc.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;

// Get all HTML files
const htmlFiles = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.html'));

// URL mappings for internal links
const urlMap = {
  '/neumatica/': '/neumatica.html',
  '/hidraulica/': '/hidraulica.html',
  '/adaptadores/': '/adaptadores.html',
  '/industrial/': '/industrial.html',
  '/coples-rapidos/': '/coples-rapidos.html',
  '/cam-lock/': '/cam-lock.html',
  '/accesorios/': '/accesorios.html',
  '/equipos/': '/equipos.html',
  '/nosotros/': '/nosotros.html',
  '/contacto/': '/contacto.html',
  '/catalogo/': '/catalogo.html',
  '/distribuidores/': '/distribuidores.html',
  '/ubicaciones/': '/ubicaciones.html',
  '/blog/': '/blog.html',
};

let totalFixed = 0;
let totalFiles = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let changes = 0;

  // 1. Fix lazy-loaded images: replace data-src="..." with src="..." 
  //    when src is a placeholder SVG (from WP Fastest Cache lazy load)
  //    Pattern: src='data:image/svg+xml,...' data-src="..."
  content = content.replace(
    /src='data:image\/svg\+xml,[^']*'\s+([^>]*?)data-src="([^"]+)"/g,
    (match, attrs, dataSrc) => {
      changes++;
      return `src="${dataSrc}" ${attrs}`;
    }
  );

  // Also handle double-quoted SVG placeholders
  content = content.replace(
    /src="data:image\/svg\+xml,[^"]*"\s+([^>]*?)data-src="([^"]+)"/g,
    (match, attrs, dataSrc) => {
      changes++;
      return `src="${dataSrc}" ${attrs}`;
    }
  );

  // 2. Convert data-srcset -> srcset (remove old placeholder srcset if any)
  content = content.replace(/\s+data-srcset="([^"]+)"/g, (match, val) => {
    changes++;
    return ` srcset="${val}"`;
  });

  // 3. Convert data-sizes -> sizes
  content = content.replace(/\s+data-sizes="([^"]+)"/g, (match, val) => {
    changes++;
    return ` sizes="${val}"`;
  });

  // 4. Add lazyload class removal - replace class="lazyload ..." with class="..."
  content = content.replace(/class="lazyload ([^"]+)"/g, (match, classes) => {
    changes++;
    return `class="${classes.trim()}"`;
  });
  content = content.replace(/class="lazyload"/g, () => {
    changes++;
    return 'class=""';
  });
  content = content.replace(/class="([^"]*)\blazyload\b([^"]*)"/g, (match, before, after) => {
    changes++;
    return `class="${(before + after).trim()}"`;
  });

  // 5. Fix internal links (remove trailing slash, add .html)
  for (const [from, to] of Object.entries(urlMap)) {
    const escapedFrom = from.replace(/\//g, '\\/');
    // Fix href attributes
    const hrefRegex = new RegExp(`href="${escapedFrom}"`, 'g');
    content = content.replace(hrefRegex, `href="${to}"`);
    // Fix href with single quotes
    const hrefRegexSingle = new RegExp(`href='${escapedFrom}'`, 'g');
    content = content.replace(hrefRegexSingle, `href='${to}'`);
  }

  // 6. Remove WordPress xmlrpc pingback link (not needed in static site)
  content = content.replace(/<link rel="pingback" href="https:\/\/asaiint\.com\/xmlrpc\.php" \/>/g, '');

  // 7. Fix Facebook pixel - replace external noscript img
  // (leave as-is, it's not causing display issues)

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFiles++;
    console.log(`✅ Fixed: ${file} (${changes} changes)`);
  } else {
    console.log(`⏭  Skipped: ${file} (no changes needed)`);
  }
  totalFixed += changes;
});

console.log(`\n🎉 Done! Fixed ${totalFixed} issues across ${totalFiles} files out of ${htmlFiles.length} total.`);
