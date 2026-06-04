const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

const styleBlock = `
<style>
.aeo-quick-answer {
    max-width: 900px !important;
    margin: 40px auto 50px auto !important;
    background-color: #f4f7fc !important;
    border: 1px solid #e2e8f0 !important;
    border-left: 8px solid #00147d !important;
    border-radius: 12px !important;
    padding: 30px 40px !important;
    box-shadow: 0 10px 25px rgba(0,20,125,0.08) !important;
    font-family: 'Montserrat', sans-serif !important;
    color: #333 !important;
    display: block !important;
    clear: both !important;
}
.aeo-quick-answer-title {
    font-weight: 800 !important;
    font-size: 1.25rem !important;
    color: #00147d !important;
    margin-bottom: 15px !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    text-transform: uppercase !important;
}
.aeo-quick-answer-title svg {
    width: 28px !important;
    height: 28px !important;
    fill: #00147d !important;
}
.aeo-quick-answer p {
    margin: 0 !important;
    font-size: 1.1rem !important;
    line-height: 1.6 !important;
    color: #444 !important;
}
@media (max-width: 768px) {
    .aeo-quick-answer { margin: 30px 15px !important; padding: 20px !important; }
}
</style>
`;

let modified = 0;
files.forEach(f => {
    let p = path.join(distDir, f);
    let html = fs.readFileSync(p, 'utf8');
    if (html.includes('<div class="aeo-quick-answer">')) {
        if (!html.includes('<style>.aeo-quick-answer {')) {
            html = html.replace('<div class="aeo-quick-answer">', styleBlock + '<div class="aeo-quick-answer">');
            fs.writeFileSync(p, html);
            // Also copy to root if it exists
            let rootP = path.join(__dirname, f);
            if (fs.existsSync(rootP)) {
                fs.writeFileSync(rootP, html);
            }
            modified++;
        }
    }
});
console.log('Injected hardcoded <style> to ' + modified + ' files.');
