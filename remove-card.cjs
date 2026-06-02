const fs = require('fs');

let distHtml = fs.readFileSync('dist/distribuidores.html', 'utf8');
let hidalgoIdx = distHtml.indexOf('Hidalgo 408');
if (hidalgoIdx !== -1) {
    let cardStart = distHtml.lastIndexOf('<div class="elementor-element elementor-element-40519fc', hidalgoIdx);
    if (cardStart !== -1) {
        let ventasIdx = distHtml.indexOf('ventas@trh.com.mx', hidalgoIdx);
        if (ventasIdx !== -1) {
            let cardEnd = distHtml.indexOf('</div></div></div></div></div>', ventasIdx);
            if (cardEnd !== -1) {
                distHtml = distHtml.substring(0, cardStart) + distHtml.substring(cardEnd + 30);
                fs.writeFileSync('dist/distribuidores.html', distHtml);
                console.log('Removed full TRH card successfully.');
            }
        }
    }
}
