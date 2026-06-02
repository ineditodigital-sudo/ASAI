const fs = require('fs');

function checkFile(file) {
    const html = fs.readFileSync('dist/' + file, 'utf8');
    const match = html.match(/<link media="all" href="(\/css\/autoptimize_[^\"]+\.css)" rel="stylesheet">/);
    if (match) {
        const cssPath = 'dist' + match[1];
        console.log(file, 'CSS:', match[1], 'Exists:', fs.existsSync(cssPath));
        if (fs.existsSync(cssPath)) {
            console.log('  Size:', fs.statSync(cssPath).size);
        }
    } else {
        console.log(file, 'No autoptimize CSS found in head');
    }
}

checkFile('index.html');
checkFile('distribuidores.html');
checkFile('contacto.html');
