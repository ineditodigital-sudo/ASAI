const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, 'distribuidores.html'),
    path.join(__dirname, 'dist', 'distribuidores.html')
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let html = fs.readFileSync(file, 'utf8');
    let hidalgoIdx = html.indexOf('Hidalgo 408');
    
    if (hidalgoIdx !== -1) {
        // The TRH card is enclosed in an elementor column container.
        let cardStart = html.lastIndexOf('<div class="elementor-element elementor-element-40519fc', hidalgoIdx);
        if (cardStart === -1) {
             // In case the id changed, search for a generic e-con-full
             cardStart = html.lastIndexOf('<div class="elementor-element', hidalgoIdx);
        }
        
        if (cardStart !== -1) {
            let ventasIdx = html.indexOf('ventas@trh.com.mx', hidalgoIdx);
            if (ventasIdx === -1) ventasIdx = html.indexOf('VENTAS@TRH.COM.MX', hidalgoIdx);
            
            if (ventasIdx !== -1) {
                let cardEnd = html.indexOf('</div></div></div></div></div>', ventasIdx);
                if (cardEnd !== -1) {
                    html = html.substring(0, cardStart) + html.substring(cardEnd + 30);
                    fs.writeFileSync(file, html);
                    console.log('Removed full TRH card successfully from:', file);
                } else {
                    console.log('Could not find card end in:', file);
                }
            } else {
                 console.log('Could not find ventas email in:', file);
            }
        } else {
            console.log('Could not find card start in:', file);
        }
    } else {
        console.log('Hidalgo 408 not found in:', file);
    }
});
